import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";


function ResumeAnalyzerPage() {
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
        <div className="p-6 md:p-12 text-white">
            <h1 className="text-3xl md:text-5xl font-black mb-4">
                Resume Analyzer
            </h1>
            <p className="text-slate-400 text-lg mb-8">
                Upload your resume and compare it against any job description to get an ATS score and AI feedback.
            </p>

            {!result ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">1. Upload Resume</h2>
                        <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 transition-colors rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer relative">
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
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </div>
                                    <p className="text-slate-300 font-medium">Click or drag PDF here</p>
                                    <p className="text-slate-500 text-sm mt-2">Maximum file size 5MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col">
                        <h2 className="text-2xl font-bold mb-4">2. Job Description</h2>
                        <textarea
                            className="w-full flex-1 min-h-[200px] md:min-h-[250px] bg-slate-800 border border-slate-700 rounded-2xl p-5 text-white outline-none focus:border-cyan-400 resize-none"
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
                            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-5 rounded-2xl text-xl font-bold text-white shadow-lg shadow-cyan-500/20"
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
                    className="space-y-8"
                >
                    <button 
                        onClick={() => setResult(null)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
                    >
                        ← Analyze Another
                    </button>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Score Ring */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                            <h3 className="text-xl font-bold mb-6">ATS Match Score</h3>
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke={result.atsScore > 75 ? "#06b6d4" : result.atsScore > 50 ? "#eab308" : "#ef4444"} strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * result.atsScore) / 100} className="transition-all duration-1000 ease-out" />
                                </svg>
                                <div className="absolute text-5xl font-black">{result.atsScore}%</div>
                            </div>
                            <p className="text-slate-400 mt-6 text-sm">
                                {result.atsScore > 75 ? "Excellent Match! You have a high chance of passing the ATS." : "Needs Improvement. Try adding more missing keywords."}
                            </p>
                        </div>

                        {/* Keywords */}
                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Matched Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matchedKeywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium">{kw}</span>
                                    ))}
                                    {result.matchedKeywords.length === 0 && <span className="text-slate-500">No keywords matched.</span>}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span> Missing Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-medium">{kw}</span>
                                    ))}
                                    {result.missingKeywords.length === 0 && <span className="text-slate-500">All key requirements met!</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                            <h3 className="text-xl font-bold mb-4 text-emerald-400">Strengths</h3>
                            <ul className="space-y-3">
                                {result.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-3 text-slate-300">
                                        <span className="text-emerald-500">✓</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                            <h3 className="text-xl font-bold mb-4 text-red-400">Weaknesses</h3>
                            <ul className="space-y-3">
                                {result.weaknesses.map((w, i) => (
                                    <li key={i} className="flex gap-3 text-slate-300">
                                        <span className="text-red-500">✗</span> {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">Actionable Improvement Tips</h3>
                        <ul className="space-y-3">
                            {result.improvementTips.map((tip, i) => (
                                <li key={i} className="flex gap-3 text-slate-200">
                                    <span className="text-cyan-500">→</span> {tip}
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
