import { Link, Outlet, useLocation } from "react-router-dom";

function DashboardLayout() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700";
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-[260px] bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 md:p-8 shrink-0">
                <Link to="/dashboard">
                    <h1 className="text-3xl font-black text-cyan-400 mb-8 md:mb-14 cursor-pointer">
                        InterviewIQ
                    </h1>
                </Link>

                <div className="flex flex-col gap-3 md:gap-4">
                    <Link to="/dashboard">
                        <button className={`w-full py-4 rounded-2xl font-semibold transition ${isActive("/dashboard")}`}>
                            Dashboard
                        </button>
                    </Link>

                    <Link to="/dashboard/interview">
                        <button className={`w-full py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/interview")}`}>
                            Start Interview
                        </button>
                    </Link>

                    <Link to="/dashboard/resume">
                        <button className={`w-full py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/resume")}`}>
                            Resume Analyzer
                        </button>
                    </Link>

                    <Link to="/dashboard/tracker">
                        <button className={`w-full py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/tracker")}`}>
                            Job Tracker
                        </button>
                    </Link>

                    <Link to="/dashboard/linkedin">
                        <button className={`w-full py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/linkedin")}`}>
                            LinkedIn Optimizer
                        </button>
                    </Link>

                    <div className="pt-10 mt-10 border-t border-slate-800">
                        <Link to="/" className="text-slate-500 hover:text-cyan-400 text-sm flex items-center gap-2 px-4 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
