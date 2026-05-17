import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";


function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
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
                className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-[32px] p-6 sm:p-10 backdrop-blur-xl"
            >

                <h1 className="text-4xl font-black text-white mb-3">
                    Create Account
                </h1>

                <p className="text-slate-400 mb-10">
                    Start your AI interview preparation journey.
                </p>

                <div className="space-y-6">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <form onSubmit={handleRegister} className="space-y-6">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-4 rounded-2xl text-lg font-bold text-white disabled:opacity-50">
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                    </form>
                </div>

                <p className="text-slate-400 text-center mt-8">
                    Already have an account?
                    <Link to="/login">
                        <span className="text-cyan-400 cursor-pointer ml-2">
                            Login
                        </span>
                    </Link>
                </p>

            </motion.div>

        </div>
    );
}

export default RegisterPage;