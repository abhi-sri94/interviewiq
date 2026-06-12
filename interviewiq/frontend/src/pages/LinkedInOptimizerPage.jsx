import { useState } from "react";
import { motion } from "framer-motion";
import { FiLinkedin, FiSend, FiCopy, FiCheck, FiInfo } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";


function LinkedInOptimizerPage() {
    const { token } = useAuth();
    const [profileText, setProfileText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleOptimize = async () => {
        if (!profileText.trim()) return;
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/optimize-linkedin`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ profileText })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Optimization failed");
            }
            setResult(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to optimize profile");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <header className="mb-6 md:mb-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-600/20 rounded-2xl mb-3 md:mb-4 border border-blue-500/20">
                    <FiLinkedin className="text-2xl md:text-3xl text-blue-400" />
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">LinkedIn Profile Optimizer</h1>
                <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">Paste your current headline or summary and let our AI boost your visibility and professional brand.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-sm">
                        <label className="block text-sm font-semibold text-gray-300 mb-3 md:mb-4 flex items-center gap-2">
                            <FiInfo className="text-blue-400" /> Current Profile Text
                        </label>
                        <textarea 
                            value={profileText}
                            onChange={(e) => setProfileText(e.target.value)}
                            rows="8"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 md:p-5 text-gray-200 outline-none focus:border-blue-500/50 transition-all resize-none text-sm leading-relaxed"
                            placeholder="Paste your current LinkedIn 'About' section or Headline here..."
                        />
                        <button 
                            onClick={handleOptimize}
                            disabled={loading || !profileText.trim()}
                            className={`w-full mt-4 md:mt-6 py-3.5 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                            }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiSend /> Optimize with AI
                                </>
                            )}
                        </button>
                        {error && (
                            <p className="mt-4 text-red-500 text-xs md:text-sm text-center font-semibold">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result && result.suggestedHeadline ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Suggested Headline */}
                            <div className="bg-slate-900/50 border border-blue-500/20 rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest">Suggested Headline</h3>
                                    <button onClick={() => copyToClipboard(result.suggestedHeadline)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                        {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                                    </button>
                                </div>
                                <p className="text-white text-base md:text-lg font-medium leading-snug">{result.suggestedHeadline}</p>
                            </div>

                            {/* SEO Keywords */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-sm">
                                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Strategic Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.seoKeywords.map((kw, i) => (
                                        <span key={i} className="bg-blue-500/10 text-blue-300 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/20 font-medium">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Optimized About */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Optimized Summary</h3>
                                    <button onClick={() => copyToClipboard(result.optimizedAbout)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                        <FiCopy />
                                    </button>
                                </div>
                                <p className="text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{result.optimizedAbout}</p>
                            </div>

                            {/* Strategic Feedback */}
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl md:rounded-3xl p-5 md:p-6">
                                <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2">Pro Tip</h3>
                                <p className="text-cyan-100/80 text-xs md:text-sm italic">"{result.feedback}"</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-slate-900/30 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                            <FiLinkedin className="text-5xl text-white/5 mb-4" />
                            <p className="text-gray-500 text-sm italic">Enter your profile text and click optimize to see AI-powered suggestions here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LinkedInOptimizerPage;
