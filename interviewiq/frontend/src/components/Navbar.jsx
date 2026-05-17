import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4 md:py-5 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"}>
                <h1 className="text-2xl md:text-3xl font-black text-cyan-400 cursor-pointer tracking-tight">
                    InterviewIQ
                </h1>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                            Dashboard
                        </Link>
                        <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/10">
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile Navigation CTA (Simplified to prevent any squishing) */}
            <div className="md:hidden flex items-center gap-2">
                {user ? (
                    <>
                        <Link to="/dashboard" className="bg-cyan-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20">
                            Dashboard
                        </Link>
                        <button onClick={logout} className="text-slate-400 text-xs hover:text-red-400 px-2 py-1.5 transition-colors">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="bg-cyan-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;