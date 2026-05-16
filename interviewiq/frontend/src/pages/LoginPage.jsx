import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
            const res = await fetch("http://localhost:8000/api/auth/login", {
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
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-[32px] p-10 backdrop-blur-xl"
            >

                <h1 className="text-4xl font-black text-white mb-3">
                    Welcome Back
                </h1>

                <p className="text-slate-400 mb-10">
                    Login to continue your interview preparation.
                </p>

                <div className="space-y-6">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <form onSubmit={handleLogin} className="space-y-6">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-4 rounded-2xl text-lg font-bold text-white disabled:opacity-50">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    </form>
                </div>

                <p className="text-slate-400 text-center mt-8">
                    Don’t have an account?
                    <Link to="/register">
                        <span className="text-cyan-400 cursor-pointer ml-2">
                            Register
                        </span>
                    </Link>
                </p>

            </motion.div>

        </div>
    );
}

export default LoginPage;