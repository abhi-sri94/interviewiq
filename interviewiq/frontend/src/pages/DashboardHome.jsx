import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function DashboardHome() {
    const { user } = useAuth();

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
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-4xl font-black text-cyan-400">12</h2>
                        <p className="text-slate-400 mt-3">Interviews Completed</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-4xl font-black text-cyan-400">87%</h2>
                        <p className="text-slate-400 mt-3">Average Performance</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-4xl font-black text-cyan-400">5</h2>
                        <p className="text-slate-400 mt-3">Roles Practiced</p>
                    </div>
                </div>

                {/* Recent Interviews */}
                <div className="mt-12 md:mt-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
                        Recent Interviews
                    </h2>
                    <div className="space-y-4 md:space-y-5">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">Frontend Developer</h3>
                                <p className="text-slate-400 mt-1">React + JavaScript Round</p>
                            </div>
                            <span className="text-cyan-400 font-bold">92%</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">HR Interview</h3>
                                <p className="text-slate-400 mt-1">Behavioral Questions</p>
                            </div>
                            <span className="text-cyan-400 font-bold">84%</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default DashboardHome;
