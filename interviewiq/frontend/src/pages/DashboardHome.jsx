import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";

function DashboardHome() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/api/interviews`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setInterviews(data);
                }
            } catch (err) {
                console.error("Error fetching interviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    // Dynamic metrics calculation
    const totalInterviews = interviews.length;
    
    const averagePerformance = totalInterviews > 0
        ? Math.round(interviews.reduce((acc, curr) => acc + curr.averagePerformance, 0) / totalInterviews)
        : 0;

    const uniqueRoles = new Set(interviews.map(i => i.role)).size;

    return (
        <div className="p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h1 className="text-3xl md:text-5xl font-black mb-4">
                    Welcome Back, {user?.name?.split(' ')[0] || "User"} 👋
                </h1>

                <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-12">
                    Ready for your next AI interview session?
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                        <h2 className="text-4xl font-black text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                            {loading ? "..." : totalInterviews}
                        </h2>
                        <p className="text-slate-400 mt-3 font-medium">Interviews Completed</p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                        <h2 className="text-4xl font-black text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                            {loading ? "..." : `${averagePerformance}%`}
                        </h2>
                        <p className="text-slate-400 mt-3 font-medium">Average Performance</p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                        <h2 className="text-4xl font-black text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                            {loading ? "..." : uniqueRoles}
                        </h2>
                        <p className="text-slate-400 mt-3 font-medium">Roles Practiced</p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                    </div>
                </div>

                {/* Recent Interviews */}
                <div className="mt-12 md:mt-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
                        Recent Interviews
                    </h2>
                    
                    {loading ? (
                        <div className="flex items-center gap-2 text-slate-400">
                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            Loading your history...
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-2xl p-10 text-center">
                            <p className="text-slate-500 mb-4">You haven't completed any AI mock interviews yet.</p>
                            <Link to="/dashboard/interview" className="inline-flex bg-cyan-500 hover:bg-cyan-600 px-6 py-2.5 rounded-xl font-bold transition-all">
                                Practice Now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {interviews.slice(0, 5).map((session) => (
                                <div key={session._id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 md:p-6 flex items-center justify-between hover:border-white/10 transition-all">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{session.role}</h3>
                                        <p className="text-slate-400 mt-1 text-sm">
                                            {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xl font-bold px-3 py-1 rounded-xl ${
                                            session.averagePerformance >= 75 ? 'text-emerald-400 bg-emerald-500/10' :
                                            session.averagePerformance >= 50 ? 'text-amber-400 bg-amber-500/10' :
                                            'text-red-400 bg-red-500/10'
                                        }`}>
                                            {session.averagePerformance}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default DashboardHome;
