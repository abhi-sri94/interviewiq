import { motion } from "framer-motion";

function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex">

            {/* Sidebar */}
            <div className="w-[260px] bg-slate-900 border-r border-slate-800 p-8">

                <h1 className="text-3xl font-black text-cyan-400 mb-14">
                    InterviewIQ
                </h1>

                <div className="space-y-5">

                    <button className="w-full bg-cyan-500 text-white py-4 rounded-2xl font-semibold">
                        Dashboard
                    </button>

                    <button className="w-full bg-slate-800 hover:bg-slate-700 transition py-4 rounded-2xl font-semibold">
                        Start Interview
                    </button>

                    <button className="w-full bg-slate-800 hover:bg-slate-700 transition py-4 rounded-2xl font-semibold">
                        Interview History
                    </button>

                    <button className="w-full bg-slate-800 hover:bg-slate-700 transition py-4 rounded-2xl font-semibold">
                        Analytics
                    </button>

                </div>

            </div>

            {/* Main Content */}
            <div className="flex-1 p-12">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >

                    <h1 className="text-5xl font-black mb-4">
                        Welcome Back 👋
                    </h1>

                    <p className="text-slate-400 text-lg mb-12">
                        Ready for your next AI interview session?
                    </p>

                    {/* Cards */}
                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                            <h2 className="text-4xl font-black text-cyan-400">
                                12
                            </h2>

                            <p className="text-slate-400 mt-3">
                                Interviews Completed
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                            <h2 className="text-4xl font-black text-cyan-400">
                                87%
                            </h2>

                            <p className="text-slate-400 mt-3">
                                Average Performance
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                            <h2 className="text-4xl font-black text-cyan-400">
                                5
                            </h2>

                            <p className="text-slate-400 mt-3">
                                Roles Practiced
                            </p>
                        </div>

                    </div>

                    {/* Recent Interviews */}
                    <div className="mt-16">

                        <h2 className="text-3xl font-bold mb-8">
                            Recent Interviews
                        </h2>

                        <div className="space-y-5">

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Frontend Developer
                                    </h3>

                                    <p className="text-slate-400 mt-1">
                                        React + JavaScript Round
                                    </p>
                                </div>

                                <span className="text-cyan-400 font-bold">
                                    92%
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        HR Interview
                                    </h3>

                                    <p className="text-slate-400 mt-1">
                                        Behavioral Questions
                                    </p>
                                </div>

                                <span className="text-cyan-400 font-bold">
                                    84%
                                </span>
                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}

export default DashboardPage;