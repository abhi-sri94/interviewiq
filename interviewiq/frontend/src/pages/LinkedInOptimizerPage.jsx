import { useState } from "react";
import { motion } from "framer-motion";
import { FiLinkedin, FiSend, FiCopy, FiCheck, FiInfo } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function LinkedInOptimizerPage() {
    const { token } = useAuth();
    const [profileText, setProfileText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleOptimize = async () => {
        if (!profileText.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/optimize-linkedin", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ profileText })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
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
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-4 border border-blue-500/20">
                    <FiLinkedin className="text-3xl text-blue-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">LinkedIn Profile Optimizer</h1>
                <p className="text-gray-400 max-w-xl mx-auto">Paste your current headline or summary and let our AI boost your visibility and professional brand.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                        <label className="block text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                            <FiInfo className="text-blue-400" /> Current Profile Text
                        </label>
                        <textarea 
                            value={profileText}
                            onChange={(e) => setProfileText(e.target.value)}
                            rows="12"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-gray-200 outline-none focus:border-blue-500/50 transition-all resize-none text-sm leading-relaxed"
                            placeholder="Paste your current LinkedIn 'About' section or Headline here..."
                        />
                        <button 
                            onClick={handleOptimize}
                            disabled={loading || !profileText.trim()}
                            className={`w-full mt-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
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
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Suggested Headline */}
                            <div className="bg-slate-900/50 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest">Suggested Headline</h3>
                                    <button onClick={() => copyToClipboard(result.suggestedHeadline)} className="text-gray-400 hover:text-white transition-colors">
                                        {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                                    </button>
                                </div>
                                <p className="text-white text-lg font-medium leading-snug">{result.suggestedHeadline}</p>
                            </div>

                            {/* SEO Keywords */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">Strategic Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.seoKeywords.map((kw, i) => (
                                        <span key={i} className="bg-blue-500/10 text-blue-300 text-[10px] px-3 py-1 rounded-full border border-blue-500/20 font-medium">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Optimized About */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Optimized Summary</h3>
                                    <button onClick={() => copyToClipboard(result.optimizedAbout)} className="text-gray-400 hover:text-white transition-colors">
                                        <FiCopy />
                                    </button>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.optimizedAbout}</p>
                            </div>

                            {/* Strategic Feedback */}
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-6">
                                <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2">Pro Tip</h3>
                                <p className="text-cyan-100/80 text-sm italic">"{result.feedback}"</p>
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
