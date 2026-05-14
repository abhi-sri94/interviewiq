import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

function InterviewPage() {

    const [code, setCode] = useState("");

    const runCode = () => {
        try {

            eval(code);

            const keywords =
                currentCodingQuestion.expectedKeywords || [];

            const passed = keywords.every((word) =>
                code.includes(word)
            );

            if (passed) {
                alert("✅ Correct Solution!");
            } else {
                alert("❌ Logic seems incomplete");
            }

        } catch (error) {

            alert("❌ Error:\n" + error.message);
        }
    };

    // baaki functions...
    const recognitionRef = useRef(null);
    useEffect(() => {
        fetchQuestion();
    }, []);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [technicalScore, setTechnicalScore] = useState(0);
    const [communicationScore, setCommunicationScore] = useState(0);
    const [confidenceScore, setConfidenceScore] = useState(0);
    const [followUpQuestion, setFollowUpQuestion] = useState("");

    const [codingMode, setCodingMode] = useState(false);

    const [currentCodingQuestion, setCurrentCodingQuestion] =
        useState(null);
    // const [code, setCode] = useState("");


    const fetchQuestion = async () => {
        try {
            const response = await fetch("https://interviewiq-backend-6iev.onrender.com/generate-question");

            const data = await response.json();

            setQuestion(
                data.question ||
                data.candidates?.[0]?.content?.parts?.[0]?.text
            );
        } catch (error) {
            console.log("FETCH ERROR:", error);
        }
    };

    const nextQuestion = async () => {
        console.log("BUTTON CLICKED");
        await fetchQuestion();
    };

    const startCodingRound = async () => {
        try {

            setCodingMode(true);

            const res = await fetch(
                "https://interviewiq-backend-6iev.onrender.com/generate-coding-question"
            );

            const data = await res.json();
            console.log(data);
            setCurrentCodingQuestion(data);

            setCode(data.starterCode || "");

        } catch (error) {
            console.log(error);
        }
    };
    const startListening = () => {
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();

        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.start();

        recognitionRef.current = recognition;

        setIsListening(true);

        recognition.onresult = (event) => {
            let transcript = "";

            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript + " ";
            }

            setAnswer(transcript);
        };

        recognition.onerror = (event) => {
            console.log(event.error);
        };

        recognition.onend = () => {
            if (recognitionRef.current) {
                recognition.start();
            }
        };
    };
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        setIsListening(false);
    };

    if (codingMode && currentCodingQuestion) {
        return (
            <div className="min-h-screen bg-[#020617] text-white p-10">

                <h1 className="text-4xl font-bold mb-6">
                    {currentCodingQuestion.title}
                </h1>

                <p className="text-slate-300 mb-6">
                    {currentCodingQuestion.question}
                </p>

                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[400px] bg-slate-900 border border-slate-700 rounded-2xl p-4 font-mono"
                />

                <div className="flex gap-4 mt-6">

                    <button
                        onClick={runCode}
                        className="bg-green-500 px-6 py-3 rounded-2xl"
                    >
                        Run Code
                    </button>

                    <button
                        onClick={startCodingRound}
                        className="bg-yellow-500 px-6 py-3 rounded-2xl"
                    >
                        Next Coding Question
                    </button>

                </div>

            </div>
        );
    }
    return (
        <div className="min-h-screen bg-[#020617] text-white flex">

            {/* Left Panel */}
            <div className="w-[320px] bg-slate-900 border-r border-slate-800 p-8">

                <h1 className="text-3xl font-black text-cyan-400 mb-12">
                    InterviewIQ
                </h1>

                {/* AI Interviewer */}
                <div className="bg-slate-800 rounded-3xl p-8 text-center">

                    <div className="w-28 h-28 rounded-full bg-cyan-500 mx-auto flex items-center justify-center text-5xl">
                        🤖
                    </div>

                    <h2 className="text-2xl font-bold mt-6">
                        AI Interviewer
                    </h2>

                    <p className="text-slate-400 mt-3">
                        Frontend React Interview
                    </p>

                </div>

                {/* Progress */}
                <div className="mt-10">

                    <div className="flex justify-between mb-3">
                        <span className="text-slate-400">
                            Interview Progress
                        </span>

                        <span className="text-cyan-400">
                            65%
                        </span>
                    </div>

                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[65%] h-full bg-cyan-500"></div>
                    </div>

                </div>

            </div>

            {/* Main Interview Area */}
            <div className="flex-1 flex flex-col">

                {/* Top */}
                <div className="border-b border-slate-800 p-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-4xl font-black">
                            Live Interview
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Answer naturally and confidently.
                        </p>
                        {followUpQuestion && (
                            <div className="mt-4 p-4 bg-purple-900/30 border border-purple-500 rounded-2xl">
                                <p className="text-purple-300 text-sm font-semibold mb-2">
                                    AI Follow-up Question
                                </p>

                                <p className="text-white text-lg">
                                    {followUpQuestion}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">

                        <button className="bg-slate-800 px-6 py-3 rounded-2xl">
                            🎤 Mic On
                        </button>

                        <button className="bg-slate-800 px-6 py-3 rounded-2xl">
                            📹 Camera On
                        </button>

                    </div>

                </div>

                {/* Question Area */}
                <div className="flex-1 p-12">

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-slate-900 border border-slate-800 rounded-[40px] p-12"
                    >

                        <div className="text-cyan-400 text-sm font-semibold mb-4">
                            CURRENT QUESTION
                        </div>

                        <h2 className="text-4xl font-bold leading-relaxed">
                            <TypeAnimation
                                key={question}
                                sequence={[question]}
                                wrapper="span"
                                speed={50}
                                repeat={0}
                            />
                        </h2>

                        {/* Live Transcript */}
                        <div className="mt-12 grid md:grid-cols-2 gap-8">

                            {/* User Response */}
                            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 max-h-[500px] overflow-y-auto">

                                <div className="flex items-center gap-4 mb-6">

                                    <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center text-2xl">
                                        👨‍💻
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Your Response
                                        </h3>

                                        <p className="text-slate-400 text-sm">
                                            Live transcript
                                        </p>
                                    </div>

                                </div>

                                <p className="text-slate-300 leading-relaxed text-lg">
                                    <textarea
                                        placeholder="Type your answer here..."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        className="w-full min-h-[400px] bg-transparent outline-none resize-none text-slate-200"
                                    ></textarea>
                                </p>

                            </div>

                            {/* AI Feedback */}
                            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">

                                <div className="flex items-center gap-4 mb-6">

                                    <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-2xl animate-pulse">
                                        🤖
                                    </div> ̰

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            AI Analysis
                                        </h3>

                                        <div className="mt-4 text-slate-300 whitespace-pre-line">
                                            {feedback}
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        {loading ? "Processing response..." : ""}
                                    </p>
                                </div>

                            </div>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between">
                                    <span>Technical Accuracy</span>
                                    <span className="text-cyan-400">{answer.split(" ").length > 15 ? "85%" : "45%"}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span>Communication</span>
                                    <span className="text-cyan-400">{answer.includes(".") ? "90%" : "55%"}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span>Confidence</span>
                                    <span className="text-cyan-400">{answer.includes(".") && answer.split(" ").length > 12 ? "88%" : "40%"}</span>
                                </div>

                            </div>

                        </div>

                    </motion.div>

                    {/* Controls */}
                    <div className="flex gap-5 mt-10">

                        <button
                            onClick={async () => {
                                try {
                                    setLoading(true);

                                    const res = await fetch("https://interviewiq-backend-6iev.onrender.com/analyze-answer", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            question,
                                            answer,
                                        }),
                                    });

                                    const data = await res.json();

                                    const aiText = data.feedback;

                                    setFeedback(aiText);

                                    const technicalMatch = aiText.match(/TECHNICAL:\s*(\d+)/);
                                    const communicationMatch = aiText.match(/COMMUNICATION:\s*(\d+)/);
                                    const confidenceMatch = aiText.match(/CONFIDENCE:\s*(\d+)/);

                                    if (technicalMatch) {
                                        setTechnicalScore(Number(technicalMatch[1]));
                                    }

                                    if (communicationMatch) {
                                        setCommunicationScore(Number(communicationMatch[1]));
                                    }

                                    if (confidenceMatch) {
                                        setConfidenceScore(Number(confidenceMatch[1]));
                                    }

                                    const followUpMatch = aiText.match(/FOLLOW_UP:\s*([\s\S]*)/);

                                    if (followUpMatch) {
                                        const followUp = followUpMatch[1].trim();

                                        if (followUp !== "NONE") {
                                            setFollowUpQuestion(followUp);
                                        } else {
                                            setFollowUpQuestion("");
                                        }
                                    }

                                } catch (error) {
                                    console.log(error);

                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="bg-cyan-500 hover:bg-cyan-600 transition px-8 py-4 rounded-2xl text-lg font-semibold"
                        >
                            Submit Answer
                        </button>

                        <button
                            onClick={isListening ? stopListening : startListening}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-2xl text-lg font-semibold"
                        >
                            {isListening ? "Stop Mic" : "Start Mic"}
                        </button>

                        <button
                            onClick={() => {
                                console.log("BUTTON CLICKED");
                                nextQuestion();
                            }}
                            className="px-6 py-3 border border-cyan-400 rounded-xl hover:bg-cyan-500/20 transition"
                        >
                            Next Question
                        </button>
                        <button
                            onClick={startCodingRound}
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 transition rounded-2xl text-lg font-semibold"
                        >
                            Start Coding Round
                        </button>
                    </div>
                </div>

            </div>

        </div >

    );
}

export default InterviewPage;