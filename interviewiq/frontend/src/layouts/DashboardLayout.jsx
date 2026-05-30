import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function DashboardLayout() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white";
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
                <Link to="/">
                    <h1 className="text-2xl font-black text-cyan-400">
                        InterviewIQ
                    </h1>
                </Link>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-cyan-400 p-2 focus:outline-none hover:bg-slate-800 rounded-xl transition"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar (Desktop always visible, Mobile collapsible slide-down drawer) */}
            <div className={`
                ${isOpen ? "block" : "hidden"} 
                md:block w-full md:w-[260px] bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 md:p-8 shrink-0 
                fixed md:relative inset-x-0 top-[65px] md:top-0 z-40 h-[calc(100vh-65px)] md:h-screen overflow-y-auto transition-all duration-300
            `}>
                <Link to="/" className="hidden md:block">
                    <h1 className="text-3xl font-black text-cyan-400 mb-8 md:mb-14 cursor-pointer">
                        InterviewIQ
                    </h1>
                </Link>

                <div className="flex flex-col gap-3 md:gap-4">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <button className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition ${isActive("/dashboard")}`}>
                            Dashboard
                        </button>
                    </Link>

                    <Link to="/dashboard/interview" onClick={() => setIsOpen(false)}>
                        <button className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/interview")}`}>
                            Start Interview
                        </button>
                    </Link>

                    <Link to="/dashboard/resume" onClick={() => setIsOpen(false)}>
                        <button className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/resume")}`}>
                            Resume Analyzer
                        </button>
                    </Link>

                    <Link to="/dashboard/tracker" onClick={() => setIsOpen(false)}>
                        <button className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/tracker")}`}>
                            Job Tracker
                        </button>
                    </Link>

                    <Link to="/dashboard/linkedin" onClick={() => setIsOpen(false)}>
                        <button className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition ${isActive("/dashboard/linkedin")}`}>
                            LinkedIn Optimizer
                        </button>
                    </Link>

                    <div className="pt-10 mt-10 border-t border-slate-800">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-cyan-400 text-sm flex items-center gap-2 px-4 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 pt-0 md:h-screen overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
