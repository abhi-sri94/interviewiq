import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            login(data.token, data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background glowing mesh circles */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8000ms]"></div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10000ms]"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md bg-slate-900/40 border border-white/10 rounded-[32px] p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-cyan-950/10 relative z-10 hover:border-white/15 transition-all duration-500"
            >
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 mb-3">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 mb-8 font-medium">
                        Log in to resume your technical prep.
                    </p>
                </div>

                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.12)] font-medium placeholder-slate-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.12)] font-medium placeholder-slate-600"
                            />
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 py-4 rounded-2xl text-lg font-bold text-white disabled:opacity-50 cursor-pointer mt-2"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>

                <p className="text-slate-400 text-center mt-8 font-medium">
                    Don’t have an account?
                    <Link to="/register">
                        <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer ml-1 transition-colors">
                            Register
                        </span>
                    </Link>
                </p>

            </motion.div>
        </div>
    );
}

export default LoginPage;