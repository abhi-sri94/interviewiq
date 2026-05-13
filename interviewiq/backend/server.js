import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
console.log("KEY =", process.env.GEMINI_API_KEY);

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend running...");
});

app.get("/generate-question", async (req, res) => {
    try {

        console.log("API KEY:", process.env.GEMINI_API_KEY);

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
                                    text: "Generate one React interview question only."
                                }
                            ]
                        }
                    ]
                })
            }
        );

        console.log("STATUS:", response.status);

        const data = await response.json();

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
Interview Question:
${question}

User Answer:
${answer}

Interview Question:
${question}

User Answer:
${answer}

You are a senior technical interviewer.

Analyze the answer professionally.

Give:
1. Technical Accuracy score out of 100
2. Communication score out of 100
3. Confidence score out of 100
4. Short improvement tips

Then decide:

- If the answer is weak or incomplete, generate ONE follow-up interview question.
- If the answer is strong, write: "FOLLOW_UP: NONE"

Format response exactly like this:

TECHNICAL: 78
COMMUNICATION: 82
CONFIDENCE: 75

FEEDBACK:
Your explanation was decent but lacked depth...

FOLLOW_UP:
Can you explain dependency arrays in more detail?
`,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

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
Generate one random frontend coding interview question.

Return ONLY valid JSON in this format:

{
  "title": "Question title",
  "question": "Problem statement",
  "starterCode": "function solve() {}"
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

        console.log(data);

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            data.candidates?.[0]?.output ||
            "";

        const cleanJson = text
            .replace(/```json/g, "")
            .replace(/```/g, "");

        if (!cleanJson || cleanJson.trim() === "") {
            return res.json({
                title,
                question,
                starterCode,
                expectedKeywords: [
                    "addEventListener",
                    "includes",
                    "style.display"
                ]
            });
        }

        const parsed = JSON.parse(cleanJson);

        res.json(parsed);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            title: "Error",
            question: error.message,
            starterCode: ""
        });

    }
});
app.listen(8000, () => {
    console.log("Server running on port 8000");
});