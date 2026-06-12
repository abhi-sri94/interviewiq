import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import Editor from "@monaco-editor/react";
import { FiMic, FiMicOff, FiVolume2, FiVolumeX, FiRotateCcw } from "react-icons/fi";
import { FaRobot, FaUserCircle } from "react-icons/fa";
import { BiCodeAlt } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";


const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

function InterviewPage() {
    const location = useLocation();
    const role = location.state?.role || "Frontend React Developer";

    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const recognitionRef = useRef(null);
    const accumulatedTranscriptRef = useRef("");
    const currentSessionFinalRef = useRef("");

    const runCode = async () => {
        if (!code.trim()) {
            alert("❌ Please write some code first.");
            return;
        }

        const getPistonConfig = (lang) => {
            switch (lang.toLowerCase()) {
                case "python":
                    return { language: "python", version: "3.10.0" };
                case "java":
                    return { language: "java", version: "15.0.2" };
                default:
                    return { language: "javascript", version: "18.15.0" };
            }
        };

        const config = getPistonConfig(selectedLanguage);

        try {
            setIsRunningCode(true);

            // Secure remote code execution via Piston API
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: config.language,
                    version: config.version,
                    files: [{ content: code }],
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.run) {
                alert("❌ Execution Error: Failed to run code. Please try again.");
                return;
            }

            if (data.run.code !== 0) {
                alert("❌ Execution Error:\n" + data.run.stderr);
                return;
            }

            const output = data.run.stdout;

            // Simple Keyword Validation
            const keywords = currentCodingQuestion.expectedKeywords || [];
            const passed = keywords.every((word) => code.includes(word));

            if (passed) {
                alert(`✅ Correct Solution!\n\nConsole Output:\n${output || "No output"}`);
            } else {
                alert(`❌ Logic seems incomplete.\n\nConsole Output:\n${output || "No output"}`);
            }

            // Save to history
            setInterviewHistory(prev => [...prev, {
                type: "coding",
                title: currentCodingQuestion.title,
                question: currentCodingQuestion.question,
                code: code,
                output: output || "No output",
                passed: passed
            }]);

        } catch (error) {
            alert("❌ API Error:\n" + error.message);
        } finally {
            setIsRunningCode(false);
        }
    };

    // baaki functions...
    const hasFetched = useRef(false);
    useEffect(() => {
        if (!hasFetched.current) {
            fetchQuestion();
            hasFetched.current = true;
        }
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
    const [isFetchingCode, setIsFetchingCode] = useState(false);
    const [isRunningCode, setIsRunningCode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const [editorFontSize, setEditorFontSize] = useState(14);

    const [currentCodingQuestion, setCurrentCodingQuestion] =
        useState(null);

    // Progress Tracking
    const [questionCount, setQuestionCount] = useState(1);
    const TOTAL_QUESTIONS = 5;
    const progressPercentage = Math.min((questionCount / TOTAL_QUESTIONS) * 100, 100);

    // Timer Logic
    useEffect(() => {
        if (showReport || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, showReport]);

    // Handle Time Up
    useEffect(() => {
        if (timeLeft === 0 && !showReport) {
            alert("⏳ Time's up for this question!");
            if (codingMode) {
                startCodingRound();
            } else {
                nextQuestion();
            }
        }
    }, [timeLeft, showReport, codingMode]);

    // Audio States & Voice Settings
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem("voiceMuted") === "true");

    const speakQuestion = (text) => {
        if (!text || isMuted || codingMode || showReport) return;
        window.speechSynthesis?.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Natural conversational speed
        utterance.pitch = 1.0;
        window.speechSynthesis?.speak(utterance);
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem("voiceMuted", String(newMuted));
        if (newMuted) {
            window.speechSynthesis?.cancel();
        } else {
            speakQuestion(question);
        }
    };

    const replayQuestion = () => {
        speakQuestion(question);
    };

    // AI Question Voiceover (Speech Synthesis)
    useEffect(() => {
        speakQuestion(question);

        return () => {
            window.speechSynthesis?.cancel();
        };
    }, [question, codingMode, showReport, isMuted]);

    // Format Time Function
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/generate-question?role=${encodeURIComponent(role)}`);

            const data = await response.json();

            setQuestion(
                data.question ||
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No question generated"
            );
        } catch (error) {
            console.log("FETCH ERROR:", error);
            setQuestion("No question generated. Please click Next Question to retry.");
        }
    };

    const nextQuestion = async () => {
        setQuestionCount(prev => prev + 1);
        setAnswer("");
        accumulatedTranscriptRef.current = "";
        currentSessionFinalRef.current = "";
        setFeedback("");
        setFollowUpQuestion("");
        setTimeLeft(600);
        await fetchQuestion();
    };

    const startCodingRound = async (lang = selectedLanguage) => {
        try {
            setIsFetchingCode(true);
            setCodingMode(true);
            setTimeLeft(600);

            const res = await fetch(
                `${API_BASE_URL}/generate-coding-question?role=${encodeURIComponent(role)}&language=${lang}`
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to generate coding question");
            }
            console.log(data);
            setCurrentCodingQuestion(data);

            setCode(data.starterCode || "");

        } catch (error) {
            console.log(error);
            alert("❌ Error starting coding round:\n" + error.message);
        } finally {
            setIsFetchingCode(false);
        }
    };
    const startListening = () => {
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();

        recognitionRef.current = recognition;

        recognition.continuous = false; // Disable continuous mode to prevent Android/iOS browser duplication
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // Store the baseline answer that is already in the state
        accumulatedTranscriptRef.current = answer ? (answer.trim() + " ") : "";
        currentSessionFinalRef.current = "";

        recognition.start();

        setIsListening(true);

        recognition.onresult = (event) => {
            let finalSessionTranscript = "";
            let interimSessionTranscript = "";

            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalSessionTranscript += event.results[i][0].transcript + " ";
                } else {
                    interimSessionTranscript += event.results[i][0].transcript;
                }
            }

            setAnswer(accumulatedTranscriptRef.current + finalSessionTranscript + interimSessionTranscript);
        };

        recognition.onerror = (event) => {
            console.log(event.error);
        };

        recognition.onend = () => {
            if (recognitionRef.current) {
                // Safely read the freshest state value using a functional updater to avoid stale closure issues
                setAnswer((prevAnswer) => {
                    accumulatedTranscriptRef.current = prevAnswer ? (prevAnswer.trim() + " ") : "";
                    return prevAnswer;
                });
                try {
                    recognition.start();
                } catch (e) {
                    console.log("Failed to restart recognition:", e);
                }
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

    const saveInterviewSession = async (history) => {
        if (history.length === 0) return;

        let totalScore = 0;
        let scoreCount = 0;

        history.forEach((item) => {
            if (item.type === "verbal" && item.scores) {
                const tech = Number(item.scores.technical) || 0;
                const comm = Number(item.scores.communication) || 0;
                const conf = Number(item.scores.confidence) || 0;
                totalScore += (tech + comm + conf) / 3;
                scoreCount++;
            } else if (item.type === "coding") {
                totalScore += item.passed ? 100 : 0;
                scoreCount++;
            }
        });

        const averagePerformance = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE_URL}/api/interviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    role,
                    averagePerformance,
                    history
                })
            });
        } catch (err) {
            console.error("Failed to save interview session:", err);
        }
    };

    useEffect(() => {
        if (showReport && interviewHistory.length > 0) {
            saveInterviewSession(interviewHistory);
        }
    }, [showReport]);

    if (showReport) {
        return (
            <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900 p-4 md:p-16">
                <div className="max-w-4xl mx-auto">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b-2 border-slate-300 pb-6 print:border-black gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-cyan-600 print:text-black">InterviewIQ Report</h1>
                            <p className="text-lg md:text-xl text-slate-600 mt-1 md:mt-2 font-medium">{role} Profile</p>
                        </div>
                        <div className="flex gap-3 print:hidden w-full sm:w-auto">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 sm:flex-none bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg transition text-sm md:text-base"
                            >
                                🖨️ Save as PDF
                            </button>
                            <Link to="/" className="flex-1 sm:flex-none">
                                <button className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition text-sm md:text-base">
                                    Exit
                                </button>
                            </Link>
                        </div>
                    </div>

                    {interviewHistory.length === 0 ? (
                        <p className="text-center text-slate-500 text-xl">No interview history recorded.</p>
                    ) : (
                        <div className="space-y-12">
                            {interviewHistory.map((item, index) => (
                                <div key={index} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-black print:border-b-4 print:mb-12 page-break-inside-avoid">
                                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                                        <span className="bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full text-sm">
                                            Q{index + 1}
                                        </span>
                                        <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full text-sm uppercase">
                                            {item.type} ROUND
                                        </span>
                                    </div>

                                    {item.type === "verbal" ? (
                                        <>
                                            <h2 className="text-2xl font-bold text-slate-800 mb-4">{item.question}</h2>

                                            <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                                                <h3 className="font-bold text-slate-700 mb-2">Candidate Response:</h3>
                                                <p className="text-slate-600 italic">"{item.answer || "No response provided."}"</p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                                                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Technical</p>
                                                    <p className="text-2xl font-black text-green-700">{item.scores.technical}%</p>
                                                </div>
                                                <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Communication</p>
                                                    <p className="text-2xl font-black text-blue-700">{item.scores.communication}%</p>
                                                </div>
                                                <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                                                    <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Confidence</p>
                                                    <p className="text-2xl font-black text-purple-700">{item.scores.confidence}%</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-slate-700 mb-2">AI Feedback:</h3>
                                                <p className="text-slate-600 whitespace-pre-line text-sm">{item.feedback}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{item.title}</h2>
                                            <p className="text-slate-600 mb-6">{item.question}</p>

                                            <div className="bg-slate-900 rounded-xl overflow-hidden mb-6 print:bg-slate-100 print:text-black">
                                                <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700 print:bg-slate-200">
                                                    <span className="text-slate-400 text-xs font-mono print:text-slate-600">candidate_solution.js</span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${item.passed ? 'bg-green-500/20 text-green-400 print:text-green-700' : 'bg-red-500/20 text-red-400 print:text-red-700'}`}>
                                                        {item.passed ? "PASSED" : "INCOMPLETE"}
                                                    </span>
                                                </div>
                                                <pre className="p-4 text-slate-300 font-mono text-sm overflow-x-auto print:text-slate-800">
                                                    <code>{item.code}</code>
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-slate-700 mb-2">Console Output:</h3>
                                                <pre className="bg-slate-100 p-4 rounded-xl text-slate-700 font-mono text-sm border border-slate-200">
                                                    {item.output}
                                                </pre>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (codingMode && currentCodingQuestion) {
        return (
            <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
                    <h1 className="text-xl md:text-4xl font-bold">
                        {currentCodingQuestion.title}
                    </h1>
                    <div className={`px-3 py-1.5 rounded-full font-mono text-lg md:text-2xl font-bold border w-fit ${timeLeft <= 60 ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse' : 'bg-slate-800 text-cyan-400 border-slate-700'}`}>
                        ⏱ {formatTime(timeLeft)}
                    </div>
                </div>

                <p className="text-slate-300 text-sm md:text-base mb-4 md:mb-6">
                    {currentCodingQuestion.question}
                </p>

                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold text-slate-300">Code Workspace</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Language Select */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 font-medium">Language:</span>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => {
                                    const newLang = e.target.value;
                                    setSelectedLanguage(newLang);
                                    startCodingRound(newLang);
                                }}
                                className="bg-slate-900 border border-slate-700 text-cyan-400 font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer hover:border-cyan-500/50 transition-all text-sm"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                            </select>
                        </div>

                        {/* Theme Select */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 font-medium">Theme:</span>
                            <select
                                value={editorTheme}
                                onChange={(e) => setEditorTheme(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-cyan-400 font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer hover:border-cyan-500/50 transition-all text-sm"
                            >
                                <option value="vs-dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>

                        {/* Font Size Select */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 font-medium">Font:</span>
                            <select
                                value={editorFontSize}
                                onChange={(e) => setEditorFontSize(Number(e.target.value))}
                                className="bg-slate-900 border border-slate-700 text-cyan-400 font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer hover:border-cyan-500/50 transition-all text-sm"
                            >
                                <option value="12">12px</option>
                                <option value="14">14px</option>
                                <option value="16">16px</option>
                                <option value="18">18px</option>
                                <option value="20">20px</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[260px] md:h-[400px] border border-slate-700 rounded-2xl overflow-hidden">
                    <Editor
                        height="100%"
                        language={selectedLanguage}
                        theme={editorTheme}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: editorFontSize,
                            padding: { top: 12 }
                        }}
                    />
                </div>

                <div className="flex flex-wrap md:flex-row gap-3 mt-4 md:mt-6">

                    <button
                        onClick={runCode}
                        disabled={isRunningCode}
                        className="bg-green-500 px-4 py-2.5 rounded-xl md:rounded-2xl w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base font-bold cursor-pointer"
                    >
                        {isRunningCode ? (
                            <><span className="animate-spin text-lg">⏳</span> Running...</>
                        ) : (
                            "Run Code"
                        )}
                    </button>

                    <button
                        onClick={startCodingRound}
                        disabled={isFetchingCode}
                        className="bg-yellow-500 px-4 py-2.5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 text-slate-900 disabled:opacity-50 w-full md:w-auto text-sm md:text-base font-bold cursor-pointer"
                    >
                        {isFetchingCode ? (
                            <>
                                <span className="animate-spin text-lg">⏳</span> Generating...
                            </>
                        ) : (
                            "Next Coding"
                        )}
                    </button>

                    <button
                        onClick={() => { setCodingMode(false); setShowReport(true); }}
                        className="px-4 py-2.5 border border-purple-500 rounded-xl md:rounded-2xl hover:bg-purple-500/20 transition text-purple-400 font-bold w-full md:w-auto text-sm md:text-base cursor-pointer"
                    >
                        End & Report
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col">
            <div className="flex-1 flex flex-col p-3 md:p-8">
                {/* Top Navigation / Header */}
                <div className="border-b border-slate-800 p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
                    <div className="w-full">
                        <div className="flex items-center justify-between md:justify-start gap-4">
                            <h1 className="text-2xl md:text-4xl font-black text-white">Live Interview</h1>
                            <div className={`px-3 py-1 rounded-full font-mono text-lg font-bold border ${timeLeft <= 60 ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse' : 'bg-slate-800 text-cyan-400 border-slate-700'}`}>
                                ⏱ {formatTime(timeLeft)}
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 md:mt-2">Answer naturally and confidently.</p>
                        {followUpQuestion && (
                            <div className="mt-4 p-4 bg-purple-900/30 border border-purple-500 rounded-2xl">
                                <p className="text-purple-300 text-xs font-semibold mb-1">AI Follow-up Question</p>
                                <p className="text-white text-base md:text-lg">{followUpQuestion}</p>
                                <button
                                    onClick={() => {
                                        setQuestion(followUpQuestion);
                                        setFollowUpQuestion("");
                                        setAnswer("");
                                        setFeedback("");
                                        setTimeLeft(600);
                                    }}
                                    className="mt-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition shadow-lg cursor-pointer"
                                >
                                    Answer this Follow-up
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-xl flex items-center gap-2 transition font-bold text-sm md:text-base active:scale-95 cursor-pointer ${
                                isListening
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                                    : "bg-slate-800 hover:bg-slate-700 text-white"
                            }`}
                        >
                            {isListening ? <FiMicOff className="text-lg" /> : <FiMic className="text-lg" />}
                            {isListening ? "Stop Mic" : "Start Mic"}
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 mt-4 md:mt-6">
                    {/* Left Sidebar: AI Interlocutor & Metrics */}
                    <div className="lg:col-span-3 space-y-4 md:space-y-6 order-2 lg:order-1">
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 backdrop-blur-xl text-center">
                            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-cyan-500/20 mx-auto flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 border border-cyan-500/30 transition-all duration-300 ${loading ? "shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse" : ""}`}>
                                <FaRobot className="text-cyan-400" />
                            </div>
                            <h2 className="text-base md:text-lg font-bold text-white">AI Interviewer</h2>
                            <p className="text-[10px] text-gray-500 mt-0.5 md:mt-1 uppercase tracking-widest">{role}</p>
                            <div className="mt-4 md:mt-8 text-left">
                                <div className="flex justify-between text-[9px] text-gray-500 mb-1.5 md:mb-2 font-bold uppercase tracking-tighter">
                                    <span>PROGRESS</span>
                                    <span>{progressPercentage}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 backdrop-blur-xl">
                            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 md:mb-4">LIVE METRICS</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-gray-400">Technical</span>
                                    <span className="text-cyan-400 font-mono font-bold">{technicalScore}%</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-gray-400">Communication</span>
                                    <span className="text-purple-400 font-mono font-bold">{communicationScore}%</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-gray-400">Confidence</span>
                                    <span className="text-blue-400 font-mono font-bold">{confidenceScore}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Question, Response, Feedback */}
                    <div className="lg:col-span-9 space-y-4 md:space-y-6 order-1 lg:order-2">
                        {/* Question Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/80 border border-white/10 rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <div className="flex items-center gap-2.5">
                                    {isListening ? (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                            <div className="flex items-end gap-[3px] h-4 w-7 justify-center pb-0.5">
                                                <span className="w-[3px] bg-red-500 rounded-full animate-equalizer-1"></span>
                                                <span className="w-[3px] bg-red-500 rounded-full animate-equalizer-2"></span>
                                                <span className="w-[3px] bg-red-500 rounded-full animate-equalizer-3"></span>
                                                <span className="w-[3px] bg-red-500 rounded-full animate-equalizer-4"></span>
                                                <span className="w-[3px] bg-red-500 rounded-full animate-equalizer-5"></span>
                                            </div>
                                            <span className="text-[10px] text-red-400 font-black tracking-wider uppercase">Listening</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                            <span className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">CURRENT QUESTION</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Mute/Unmute Audio */}
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition text-slate-300 hover:text-white cursor-pointer active:scale-95"
                                        title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
                                    >
                                        {isMuted ? <FiVolumeX className="text-sm md:text-base" /> : <FiVolume2 className="text-sm md:text-base" />}
                                    </button>
                                    
                                    {/* Replay Audio */}
                                    <button
                                        onClick={replayQuestion}
                                        className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition text-slate-300 hover:text-white cursor-pointer active:scale-95"
                                        title="Replay Question"
                                    >
                                        <FiRotateCcw className="text-sm md:text-base" />
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-3xl font-bold leading-relaxed text-white">
                                <TypeAnimation key={question} sequence={[question]} wrapper="span" speed={70} repeat={0} />
                            </h2>
                        </motion.div>

                        {/* Interactive Area: Transcript & AI Feedback */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            {/* User Transcript Area */}
                            <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700 h-[200px] md:h-[450px] flex flex-col">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-lg">
                                        <FaUserCircle className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold">Your Response</h3>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-widest">Live transcript</p>
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Start speaking or type your answer here..."
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="flex-1 w-full bg-transparent outline-none resize-none text-slate-200 text-sm md:text-lg leading-relaxed font-light placeholder:text-slate-600"
                                />
                            </div>

                            {/* AI Live Feedback Area */}
                            <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700 h-[200px] md:h-[450px] flex flex-col">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <div className={`w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-lg ${loading ? "animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""}`}>
                                        <FaRobot className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold">AI Analysis</h3>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-widest">{loading ? "Processing..." : "Real-time insights"}</p>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto text-slate-300 whitespace-pre-line leading-relaxed text-base italic scrollbar-hide">
                                    {loading ? (
                                        <div className="space-y-4 py-2">
                                            <div className="h-4 bg-slate-700/60 rounded-lg w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-slate-700/60 rounded-lg w-5/6 animate-pulse"></div>
                                            <div className="h-4 bg-slate-700/60 rounded-lg w-2/3 animate-pulse"></div>
                                            <p className="text-cyan-400/60 text-xs font-mono tracking-wider mt-4 not-italic">
                                                AI is evaluating accuracy, confidence, and communication style...
                                            </p>
                                        </div>
                                    ) : (
                                        feedback || "I'm listening... Give your best answer and click 'Submit' for analysis."
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="flex flex-wrap items-center gap-3 mt-4 p-4 bg-slate-900/30 border border-white/5 rounded-2xl md:rounded-[2rem] backdrop-blur-sm">
                            <button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const response = await fetch(`${API_BASE_URL}/analyze-answer`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ question, answer }),
                                        });
                                        const data = await response.json();
                                        if (!response.ok) {
                                            throw new Error(data.error || "Failed to analyze answer");
                                        }
                                        const aiText = data.feedback || "";
                                        setFeedback(aiText);
                                        const technicalMatch = aiText.match(/TECHNICAL:\s*(\d+)/);
                                        const communicationMatch = aiText.match(/COMMUNICATION:\s*(\d+)/);
                                        const confidenceMatch = aiText.match(/CONFIDENCE:\s*(\d+)/);
                                        if (technicalMatch) setTechnicalScore(Number(technicalMatch[1]));
                                        if (communicationMatch) setCommunicationScore(Number(communicationMatch[1]));
                                        if (confidenceMatch) setConfidenceScore(Number(confidenceMatch[1]));
                                        const followUpMatch = aiText.match(/FOLLOW_UP:\s*([\s\S]*)/);
                                        if (followUpMatch) {
                                            const followUp = followUpMatch[1].trim();
                                            if (followUp !== "NONE") setFollowUpQuestion(followUp);
                                            else setFollowUpQuestion("");
                                        }
                                        setInterviewHistory(prev => [...prev, {
                                            type: "verbal",
                                            question: question,
                                            answer: answer,
                                            feedback: aiText,
                                            scores: {
                                                technical: technicalMatch ? technicalMatch[1] : 0,
                                                communication: communicationMatch ? communicationMatch[1] : 0,
                                                confidence: confidenceMatch ? confidenceMatch[1] : 0
                                            }
                                        }]);
                                    } catch (error) {
                                        console.log(error);
                                        alert("❌ Error analyzing answer:\n" + error.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2.5 rounded-xl font-bold transition shadow-lg shadow-cyan-500/20 active:scale-95 flex-1 sm:flex-none text-center text-sm md:px-8 md:py-4 md:text-base cursor-pointer"
                            >
                                Submit Answer
                            </button>

                            <button
                                onClick={isListening ? stopListening : startListening}
                                className={`px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95 flex-1 sm:flex-none text-center text-sm md:px-8 md:py-4 md:text-base cursor-pointer ${isListening
                                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 text-white"
                                    : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 text-white"
                                }`}
                            >
                                {isListening ? <FiMicOff className="text-lg" /> : <FiMic className="text-lg" />}
                                {isListening ? "Stop Mic" : "Start Mic"}
                            </button>

                            <button
                                onClick={nextQuestion}
                                className="px-4 py-2.5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10 rounded-xl transition text-white font-bold active:scale-95 flex-1 sm:flex-none text-center text-sm md:px-8 md:py-4 md:text-base cursor-pointer"
                            >
                                Next Question
                            </button>

                            <button
                                onClick={startCodingRound}
                                disabled={isFetchingCode}
                                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-95 flex-1 sm:flex-none text-center text-sm md:px-8 md:py-4 md:text-base cursor-pointer"
                            >
                                {isFetchingCode ? <span className="animate-spin text-lg">⏳</span> : <BiCodeAlt className="text-lg" />}
                                Coding Round
                            </button>

                            <div className="hidden lg:block flex-1"></div>

                            <button
                                onClick={() => setShowReport(true)}
                                className="px-4 py-2 text-red-400 hover:text-red-300 font-semibold transition w-full lg:w-auto text-center text-xs md:text-sm cursor-pointer"
                            >
                                End Interview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewPage;