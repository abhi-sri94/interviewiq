import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between px-10 py-5 border-b border-slate-800">

            <h1 className="text-3xl font-bold text-cyan-400">
                InterviewIQ
            </h1>

            <div className="flex gap-8 text-slate-300">
                <Link to="/">Home</Link>

                <Link to="/login">
                    Login
                </Link>
            </div>

        </nav>
    );
}

export default Navbar;