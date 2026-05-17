import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4 md:py-5 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">

            <Link to={user ? "/dashboard" : "/"}>
                <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 cursor-pointer">
                    InterviewIQ
                </h1>
            </Link>

            <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base text-slate-300">
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>

                {user ? (
                    <div className="flex items-center gap-3 md:gap-6">
                        <Link to="/dashboard" className="bg-cyan-500/10 text-cyan-400 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-cyan-500/20 font-medium">Dashboard</Link>
                        <button onClick={logout} className="hover:text-red-400 transition-colors">Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className="bg-slate-800 hover:bg-slate-700 px-4 md:px-6 py-2 rounded-xl transition-all">
                        Login
                    </Link>
                )}
            </div>

        </nav>
    );
}

export default Navbar;