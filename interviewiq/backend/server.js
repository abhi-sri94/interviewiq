import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import User from "./models/User.js";
import Job from "./models/Job.js";
import Interview from "./models/Interview.js";

dotenv.config();
console.log("KEY =", process.env.GEMINI_API_KEY);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend running...");
});

// Helper to robustly extract and parse JSON from LLM text responses
const extractJSON = (text) => {
    try {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
            const jsonStr = text.substring(start, end + 1);
            return JSON.parse(jsonStr);
        }
        return JSON.parse(text);
    } catch (e) {
        throw new Error("Failed to parse response from AI: " + e.message);
    }
};

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Optional User Extractor Helper
const getOptionalUserId = (req) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.id;
        }
    } catch (e) {
        // Ignore parsing/verification errors to fallback
    }
    return null;
};

// --- User Profile Route ---
app.get("/api/user/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Auth Routes ---
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AI Resume Analyzer Route ---
app.post("/api/analyze-resume", authMiddleware, upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No resume PDF provided" });
        }
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: "No job description provided" });
        }

        // Parse PDF buffer to text
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        // Send to Gemini
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
You are an expert ATS (Applicant Tracking System) and senior recruiter.
Analyze the following resume against the provided job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY a valid JSON object using this exact structure, but replace the values with your actual calculated analysis. The atsScore MUST be a dynamically calculated integer from 0 to 100 representing the true match percentage.

{
  "atsScore": [Insert calculated integer from 0 to 100],
  "matchedKeywords": ["List", "of", "matching", "skills"],
  "missingKeywords": ["List", "of", "missing", "skills"],
  "strengths": ["List", "of", "resume", "strengths"],
  "weaknesses": ["List", "of", "areas", "lacking"],
  "improvementTips": ["Actionable", "tips", "for", "improvement"]
}
`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
        }
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const result = extractJSON(textResponse);

        // Update authenticated user record
        await User.findByIdAndUpdate(req.userId, {
            resumeText,
            targetJobDescription: jobDescription,
            resumeAnalysis: result
        });

        res.json(result);

    } catch (err) {
        console.error("Resume Analysis Error:", err);
        res.status(500).json({ error: err.message || "Failed to analyze resume" });
    }
});

app.get("/generate-question", async (req, res) => {
    try {
        const role = req.query.role || "Frontend React Developer";
        console.log("API KEY:", process.env.GEMINI_API_KEY);

        const userId = getOptionalUserId(req);
        let resumeText = "";
        let jobDesc = "";
        let userAnalysis = null;

        if (userId) {
            const user = await User.findById(userId);
            if (user && user.resumeText) {
                resumeText = user.resumeText;
                jobDesc = user.targetJobDescription;
                userAnalysis = user.resumeAnalysis;
            }
        }

        let promptText = `Generate one single interview question for a candidate applying for the role of ${role}. To ensure a realistic and comprehensive interview, randomly choose to generate EITHER a deep technical role-specific question OR a behavioral/situational question (focusing on teamwork, conflict resolution, problem-solving, cultural fit, or career goals). The question MUST be conversational, direct, and under 2 sentences maximum. Do not add any introductory or concluding text, just output the question itself.`;

        if (resumeText) {
            promptText = `
You are a senior technical interviewer.
Generate one single interview question tailored specifically to this candidate's resume and target job description.
To ensure a comprehensive interview, choose to generate either a question probing a project or skill listed in their resume (especially checking any missing keywords or weaknesses identified in their analysis), or a behavioral question relating to their past experience.
The question must be tailored to the target role: ${role}.

TARGET JOB DESCRIPTION:
${jobDesc}

CANDIDATE RESUME:
${resumeText}

PREVIOUS ATS ANALYSIS:
Strengths: ${userAnalysis?.strengths?.join(", ") || ""}
Weaknesses: ${userAnalysis?.weaknesses?.join(", ") || ""}
Missing Keywords: ${userAnalysis?.missingKeywords?.join(", ") || ""}

The question MUST be conversational, direct, and under 2 sentences maximum. Do not output any introductory or concluding text, just output the question itself.
`;
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText
                                }
                            ]
                        }
                    ]
                })
            }
        );

        console.log("STATUS:", response.status);

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
        }

        console.log(data);

        const question =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No question generated";

        res.json({ question });

    } catch (error) {

        console.log("FULL ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/analyze-answer", async (req, res) => {
    try {
        const { question, answer } = req.body;

        const userId = getOptionalUserId(req);
        let resumeText = "";
        let jobDesc = "";
        let userAnalysis = null;

        if (userId) {
            const user = await User.findById(userId);
            if (user && user.resumeText) {
                resumeText = user.resumeText;
                jobDesc = user.targetJobDescription;
                userAnalysis = user.resumeAnalysis;
            }
        }

        let promptText = `
Interview Question:
${question}

User Answer:
${answer}

You are a senior technical interviewer. Analyze the answer professionally but concisely.

Give:
1. Technical Accuracy score out of 100
2. Communication score out of 100
3. Confidence score out of 100
4. Short improvement tips (1 sentence max)

Then decide:
- If the answer is weak or incomplete, generate ONE follow-up interview question (under 2 sentences).
- If the answer is strong, write: "FOLLOW_UP: NONE"

Format response exactly like this:

TECHNICAL: 78
COMMUNICATION: 82
CONFIDENCE: 75

FEEDBACK:
Your explanation was decent but lacked depth...

FOLLOW_UP:
Can you explain dependency arrays in more detail?
`;

        if (resumeText) {
            promptText = `
Candidate Resume Context:
${resumeText}

Target Job Description:
${jobDesc}

Candidate's Strengths: ${userAnalysis?.strengths?.join(", ") || ""}
Candidate's Weaknesses: ${userAnalysis?.weaknesses?.join(", ") || ""}

Interview Question:
${question}

User Answer:
${answer}

You are a senior technical interviewer. Analyze the candidate's answer professionally but concisely, keeping in mind their resume and target job description context. If they are speaking about their projects or experiences, verify how it aligns with their resume and the target role requirements.

Give:
1. Technical Accuracy score out of 100 (evaluate how technically correct they are, especially relative to the role and their claimed resume expertise)
2. Communication score out of 100
3. Confidence score out of 100
4. Short improvement tips (1 sentence max, tailored to how they can better highlight their relevant experience or address missing keywords/weaknesses)

Then decide:
- If the answer is weak or incomplete, generate ONE follow-up interview question (under 2 sentences) probing deeper into their technical knowledge or resume experience.
- If the answer is strong, write: "FOLLOW_UP: NONE"

Format response exactly like this:

TECHNICAL: 78
COMMUNICATION: 82
CONFIDENCE: 75

FEEDBACK:
Your explanation was decent but lacked depth...

FOLLOW_UP:
Can you explain dependency arrays in more detail?
`;
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
        }

        const feedback =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No feedback generated";

        res.json({ feedback });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: error.message,
        });
    }
});
app.get("/generate-coding-question", async (req, res) => {
    try {
        const role = req.query.role || "Frontend React Developer";
        const language = req.query.language || "javascript";

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
Generate one random coding interview question designed for a ${role} role.
The programming language required is: ${language}.

Return ONLY a valid JSON object in this format:
{
  "title": "Question title",
  "question": "Problem statement and description",
  "starterCode": "starter code template suited exactly for ${language}",
  "expectedKeywords": ["list", "of", "keywords", "required", "in", "the", "user", "code", "solution"]
}

Do not use markdown.
Do not use triple backticks.
`
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
        }
        console.log(data);

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            data.candidates?.[0]?.output ||
            "";

        const defaultQuestions = {
            javascript: {
                title: "Reverse a String",
                question: "Write a function to reverse a string in JavaScript.",
                starterCode: "function reverseString(str) {\n  return str;\n}",
                expectedKeywords: ["split", "reverse", "join"]
            },
            python: {
                title: "Reverse a String",
                question: "Write a function to reverse a string in Python.",
                starterCode: "def reverse_string(s):\n    return s",
                expectedKeywords: ["def", "return"]
            },
            java: {
                title: "Reverse a String",
                question: "Write a class method to reverse a string in Java.",
                starterCode: "public class Solution {\n    public static String reverseString(String s) {\n        return s;\n    }\n}",
                expectedKeywords: ["class", "String", "return"]
            }
        };

        if (!text || text.trim() === "") {
            return res.json(defaultQuestions[language.toLowerCase()] || defaultQuestions.javascript);
        }

        const parsed = extractJSON(text);
        res.json(parsed);

    } catch (error) {
        console.log(error);
        const language = req.query.language || "javascript";
        const defaultQuestions = {
            javascript: {
                title: "Reverse a String",
                question: "Write a function to reverse a string in JavaScript.",
                starterCode: "function reverseString(str) {\n  return str;\n}",
                expectedKeywords: ["split", "reverse", "join"]
            },
            python: {
                title: "Reverse a String",
                question: "Write a function to reverse a string in Python.",
                starterCode: "def reverse_string(s):\n    return s",
                expectedKeywords: ["def", "return"]
            },
            java: {
                title: "Reverse a String",
                question: "Write a class method to reverse a string in Java.",
                starterCode: "public class Solution {\n    public static String reverseString(String s) {\n        return s;\n    }\n}",
                expectedKeywords: ["class", "String", "return"]
            }
        };
        res.json(defaultQuestions[language.toLowerCase()] || defaultQuestions.javascript);
    }
});

app.post("/api/optimize-linkedin", authMiddleware, async (req, res) => {
    try {
        const { profileText } = req.body;
        if (!profileText) return res.status(400).json({ error: "Profile text is required" });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
You are a career coaching expert specializing in LinkedIn optimization.
Analyze the following LinkedIn profile text (Summary or Headline) and provide professional improvements.

PROFILE TEXT:
${profileText}

Return ONLY a valid JSON object with the following fields:
{
  "suggestedHeadline": "A catchy, keyword-rich headline",
  "optimizedAbout": "A compelling, first-person narrative summary",
  "seoKeywords": ["List", "of", "relevant", "industry", "keywords"],
  "feedback": "2-3 sentences of strategic advice"
}
`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Gemini API returned status ${response.status}`);
        }
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const result = extractJSON(textResponse);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Job Tracker Routes ---
app.post("/api/jobs", authMiddleware, async (req, res) => {
    try {
        const { company, role, status, notes, salary } = req.body;
        const newJob = new Job({ userId: req.userId, company, role, status, notes, salary });
        await newJob.save();
        res.json(newJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/jobs", authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/jobs/:id", authMiddleware, async (req, res) => {
    try {
        const { status, notes, salary } = req.body;
        const updatedJob = await Job.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { status, notes, salary },
            { new: true }
        );
        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/jobs/:id", authMiddleware, async (req, res) => {
    try {
        await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Interview History Routes ---
app.post("/api/interviews", authMiddleware, async (req, res) => {
    try {
        const { role, averagePerformance, history } = req.body;
        const newInterview = new Interview({
            userId: req.userId,
            role,
            averagePerformance,
            history
        });
        await newInterview.save();
        res.json(newInterview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/interviews", authMiddleware, async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export app for serverless deployment
export default app;

// Start local server only if not in a serverless environment
if (process.env.VERCEL !== "1" && !process.env.NOW_REGION) {
    app.listen(8000, () => {
        console.log("Server running on port 8000");
    });
}