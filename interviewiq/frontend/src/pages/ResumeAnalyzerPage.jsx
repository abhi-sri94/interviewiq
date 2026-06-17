import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";


function ResumeAnalyzerPage() {
    const { token } = useAuth();
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const handleAnalyze = async () => {
        if (!file || !jobDescription) {
            setError("Please upload a resume and paste a job description.");
            return;
        }

        setError("");
        setLoading(true);

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription);

        try {
            const res = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-12 text-white">
            <h1 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
                Resume Analyzer
            </h1>
            <p className="text-slate-400 text-sm md:text-lg mb-6 md:mb-8">
                Upload your resume and compare it against any job description to get an ATS score and AI feedback.
            </p>

            {!result ? (
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {/* Upload Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">1. Upload Resume</h2>
                        <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 transition-colors rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center text-center cursor-pointer relative">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <p className="text-cyan-400 font-semibold">{file.name}</p>
                            ) : (
                                <>
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 md:mb-4">
                                        <svg className="w-6 h-6 md:w-8 md:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </div>
                                    <p className="text-slate-300 text-sm md:text-base font-medium">Click or drag PDF here</p>
                                    <p className="text-slate-500 text-xs mt-1">Maximum file size 5MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">2. Job Description</h2>
                        <textarea
                            className="w-full flex-1 min-h-[160px] md:min-h-[250px] bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-5 text-white outline-none focus:border-cyan-400 resize-none text-sm"
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2">
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <button 
                            onClick={handleAnalyze}
                            disabled={loading || !file || !jobDescription}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3.5 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl font-bold text-white shadow-lg shadow-cyan-500/20 cursor-pointer"
                        >
                            {loading ? "Analyzing with AI..." : "Analyze Resume"}
                        </button>
                    </div>
                </div>
            ) : (
                /* Results Section */
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <button 
                        onClick={() => setResult(null)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 cursor-pointer text-sm"
                    >
                        ← Analyze Another
                    </button>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {/* Score Ring */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">ATS Match Score</h3>
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke={result.atsScore > 75 ? "#06b6d4" : result.atsScore > 50 ? "#eab308" : "#ef4444"} strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * result.atsScore) / 100} className="transition-all duration-1000 ease-out" />
                                </svg>
                                <div className="absolute text-4xl md:text-5xl font-black">{result.atsScore}%</div>
                            </div>
                            <p className="text-slate-400 mt-4 md:mt-6 text-xs md:text-sm">
                                {result.atsScore > 75 ? "Excellent Match! You have a high chance of passing the ATS." : "Needs Improvement. Try adding more missing keywords."}
                            </p>
                        </div>

                        {/* Keywords */}
                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col gap-5 md:gap-6">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Matched Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matchedKeywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs md:text-sm font-medium">{kw}</span>
                                    ))}
                                    {result.matchedKeywords.length === 0 && <span className="text-slate-500 text-sm">No keywords matched.</span>}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Missing Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs md:text-sm font-medium">{kw}</span>
                                    ))}
                                    {result.missingKeywords.length === 0 && <span className="text-slate-500 text-sm">All key requirements met!</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8">
                            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-emerald-400">Strengths</h3>
                            <ul className="space-y-2 md:space-y-3">
                                {result.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-2.5 text-slate-300 text-xs md:text-sm">
                                        <span className="text-emerald-500 font-bold">✓</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8">
                            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-red-400">Weaknesses</h3>
                            <ul className="space-y-2 md:space-y-3">
                                {result.weaknesses.map((w, i) => (
                                    <li key={i} className="flex gap-2.5 text-slate-300 text-xs md:text-sm">
                                        <span className="text-red-500 font-bold">✗</span> {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl md:rounded-3xl p-5 md:p-8">
                        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-cyan-400">Actionable Improvement Tips</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {result.improvementTips.map((tip, i) => (
                                <li key={i} className="flex gap-2.5 text-slate-200 text-xs md:text-sm">
                                    <span className="text-cyan-500 font-bold">→</span> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                </motion.div>
            )}
        </div>
    );
}

export default ResumeAnalyzerPage;
