import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";
import { FiCheckSquare, FiAward, FiBriefcase, FiCalendar, FiClock, FiActivity, FiArrowRight } from "react-icons/fi";

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
        <div className="p-4 md:p-12 relative overflow-hidden min-h-screen">
            {/* Soft decorative background glows */}
            <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <div className="mb-6 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 mb-2 md:mb-4">
                        Welcome Back, {user?.name?.split(' ')[0] || "Developer"} 👋
                    </h1>
                    <p className="text-slate-400 text-sm md:text-lg font-medium">
                        Ready for your next AI practice session? Choose a role and benchmark your technical skills.
                    </p>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-3xl p-6 relative overflow-hidden group hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:scale-[1.01] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-400 font-semibold tracking-wide text-sm">Interviews Completed</span>
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <FiCheckSquare className="w-5 h-5" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">
                            {loading ? "..." : totalInterviews}
                        </h2>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <FiActivity className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Practice rounds completed</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:scale-[1.01] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-400 font-semibold tracking-wide text-sm">Average Performance</span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <FiAward className="w-5 h-5" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">
                            {loading ? "..." : `${averagePerformance}%`}
                        </h2>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span className={`w-2 h-2 rounded-full ${averagePerformance >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span>Overall assessment average</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:scale-[1.01] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-400 font-semibold tracking-wide text-sm">Roles Practiced</span>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <FiBriefcase className="w-5 h-5" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">
                            {loading ? "..." : uniqueRoles}
                        </h2>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span>Unique technical sectors</span>
                        </div>
                    </div>
                </div>

                {/* Recent Interviews Panel */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                            Practice Timeline
                        </h2>
                        <Link to="/dashboard/interview" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
                            <span>New Session</span>
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="flex items-center gap-3 text-slate-400 font-medium">
                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            Loading your history...
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className="bg-slate-900/30 border border-dashed border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
                            <p className="text-slate-400 mb-6 font-medium">You haven't completed any AI mock interviews yet.</p>
                            <Link to="/dashboard/interview" className="inline-flex bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white px-8 py-3.5 rounded-2xl font-bold transition-all duration-300">
                                Start Your First Interview
                            </Link>
                        </div>
                    ) : (
                        <div className="relative pl-6 md:pl-8 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-[2px] before:bg-slate-800/80">
                            <div className="space-y-8">
                                {interviews.slice(0, 5).map((session) => (
                                    <div key={session._id} className="relative group">
                                        {/* Timeline Dot Indicator */}
                                        <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 z-10"></div>
                                        
                                        <div className="bg-slate-900/30 hover:bg-slate-900/50 border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
                                            <div>
                                                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                                                    {session.role}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold mt-2">
                                                    <span className="flex items-center gap-1.5">
                                                        <FiCalendar className="w-3.5 h-3.5 text-slate-600" />
                                                        {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <FiClock className="w-3.5 h-3.5 text-slate-600" />
                                                        {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center self-start sm:self-center">
                                                <span className={`text-base font-extrabold px-4 py-1.5 rounded-xl border ${
                                                    session.averagePerformance >= 75 
                                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                                                        : session.averagePerformance >= 50 
                                                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
                                                            : 'text-red-400 bg-red-500/10 border-red-500/20'
                                                }`}>
                                                    Score: {session.averagePerformance}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default DashboardHome;
