import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function HomePage() {
    const { user } = useAuth();
    const [selectedRole, setSelectedRole] = useState("Frontend React Developer");


    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

            <Navbar />

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28">

                {/* Glow Effects */}
                <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full"></div>

                {/* Badge */}
                <div className="mb-6 border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 px-5 py-2 rounded-full text-sm backdrop-blur-md">
                    AI Powered Mock Interviews
                </div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight max-w-5xl"
                >
                    Crack Your Next
                    <span className="text-cyan-400"> Tech Interview </span>
                    With AI
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-slate-400 text-base md:text-xl mt-6 md:mt-8 max-w-2xl leading-relaxed"
                >
                    Practice real technical interviews with AI, receive instant
                    feedback, improve confidence, and track your performance.
                </motion.p>
                {/* Buttons */}
                {/* Role Selector & Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col items-center gap-4 mt-8 relative z-50 w-full md:w-auto"
                >
                    <div className="w-full md:w-auto bg-slate-900/80 border border-slate-700 rounded-2xl px-6 py-3 flex items-center justify-between backdrop-blur-md">
                        <span className="text-slate-400 mr-4 font-semibold">Select Role:</span>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-transparent text-cyan-400 outline-none font-bold cursor-pointer text-lg"
                        >
                            <option className="bg-slate-900 text-white" value="Frontend React Developer">Frontend React</option>
                            <option className="bg-slate-900 text-white" value="Backend Node.js Developer">Backend Node.js</option>
                            <option className="bg-slate-900 text-white" value="Full Stack Developer">Full Stack</option>
                            <option className="bg-slate-900 text-white" value="Human Resources (HR)">HR / Behavioral</option>
                            <option className="bg-slate-900 text-white" value="Data Structures & Algorithms">DSA / Problem Solving</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full md:w-auto mt-2">
                        <Link to={user ? "/dashboard/interview" : "/login"} state={{ role: selectedRole }} className="w-full md:w-auto">
                            <button className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 transition px-10 py-4 rounded-2xl text-lg font-semibold cursor-pointer">
                                Start Interview
                            </button>
                        </Link>

                        <button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full md:w-auto border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 px-8 py-4 rounded-2xl text-lg"
                        >
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24 w-full max-w-4xl relative z-40">

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md"
                    >                        <h2 className="text-2xl font-bold text-cyan-400">AI Powered</h2>
                        <p className="text-slate-400 mt-2">Smart Interview Engine</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md"
                    >                    <h2 className="text-2xl font-bold text-cyan-400">Instant</h2>
                        <p className="text-slate-400 mt-2">Performance Feedback</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md"
                    >                    <h2 className="text-2xl font-bold text-cyan-400">Multi Role</h2>
                        <p className="text-slate-400 mt-2">Frontend, Backend & HR</p>
                    </motion.div>

                </div>

            </section >
            {/* Features Section */}
            < section className="px-6 md:px-8 py-20 md:py-28 max-w-7xl mx-auto" >

                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Everything You Need To
                        <br className="md:hidden" />
                        <span className="text-cyan-400"> Ace Interviews</span>
                    </h2>

                    <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">
                        Built for students, developers, and professionals preparing for
                        technical interviews.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Card 1 */}
                    <motion.div
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500 transition-all duration-300"
                    >
                        <div className="text-5xl mb-6">🎤</div>

                        <h3 className="text-2xl font-bold mb-4">
                            AI Voice Interviews
                        </h3>

                        <p className="text-slate-400 leading-relaxed">
                            Practice realistic mock interviews with AI-generated voice
                            conversations and dynamic questioning.
                        </p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500 transition-all duration-300"
                    >
                        <div className="text-5xl mb-6">📊</div>

                        <h3 className="text-2xl font-bold mb-4">
                            Instant Feedback
                        </h3>

                        <p className="text-slate-400 leading-relaxed">
                            Get performance analysis, communication scoring,
                            confidence tracking, and improvement suggestions instantly.
                        </p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500 transition-all duration-300"
                    >
                        <div className="text-5xl mb-6">💼</div>

                        <h3 className="text-2xl font-bold mb-4">
                            Multiple Roles
                        </h3>

                        <p className="text-slate-400 leading-relaxed">
                            Prepare for Frontend, Backend, Full Stack,
                            HR, System Design, and DSA interview rounds.
                        </p>
                    </motion.div>

                </div>

            </section >
            {/* How It Works */}
            < section id="how-it-works" className="px-6 md:px-8 py-20 md:py-28 bg-slate-950/40" >

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            How
                            <span className="text-cyan-400"> InterviewIQ </span>
                            Works
                        </h2>

                        <p className="text-slate-400 mt-6 text-lg">
                            Start practicing interviews in just a few simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        {/* Step 1 */}
                        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-10">

                            <div className="absolute -top-5 left-8 bg-cyan-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                1
                            </div>

                            <h3 className="text-3xl font-bold mt-8 mb-6">
                                Choose Role
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Select your interview category such as Frontend,
                                Backend, Full Stack, HR, or DSA rounds.
                            </p>

                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-10">

                            <div className="absolute -top-5 left-8 bg-cyan-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                2
                            </div>

                            <h3 className="text-3xl font-bold mt-8 mb-6">
                                Start Interview
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Answer AI-generated interview questions using
                                voice, webcam, or typing interactions.
                            </p>

                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-10">

                            <div className="absolute -top-5 left-8 bg-cyan-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                3
                            </div>

                            <h3 className="text-3xl font-bold mt-8 mb-6">
                                Get Feedback
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                Receive instant AI feedback with scores,
                                strengths, weaknesses, and improvement tips.
                            </p>

                        </div>

                    </div>

                </div>

            </section >
            {/* CTA Section */}
            < section className="px-6 md:px-8 py-20 md:py-32" >

                <div className="max-w-5xl mx-auto">

                    <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 rounded-3xl md:rounded-[40px] p-8 md:p-16 text-center backdrop-blur-xl">

                        {/* Glow */}
                        <div className="absolute inset-0 bg-cyan-500/10 blur-3xl"></div>

                        <div className="relative z-10">

                            <h2 className="text-4xl md:text-6xl font-black leading-tight">
                                Ready To Crack Your
                                <br className="md:hidden" />
                                <span className="text-cyan-400"> Dream Job?</span>
                            </h2>

                            <p className="text-slate-300 text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
                                Practice smarter with AI-powered mock interviews,
                                instant feedback, and role-specific preparation.
                            </p>

                            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-10 md:mt-12">

                                <Link to={user ? "/dashboard/interview" : "/login"} state={{ role: selectedRole }} className="w-full md:w-auto">
                                    <button className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-10 py-4 md:py-5 rounded-2xl text-lg font-bold shadow-lg shadow-cyan-500/30">
                                        Start Free
                                    </button>
                                </Link>

                                <button
                                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full md:w-auto border border-slate-500 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 px-10 py-4 md:py-5 rounded-2xl text-lg font-bold"
                                >
                                    Learn More
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section >

            {/* Footer */}
            <footer className="border-t border-slate-800 py-10 flex flex-col items-center justify-center gap-6 mt-10">
                <a href="https://www.producthunt.com/products/interviewiq-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-interviewiq-2" target="_blank" rel="noopener noreferrer">
                    <img
                        alt="InterviewIQ - Practice real interviews with AI and get instant feedback. | Product Hunt"
                        width="250"
                        height="54"
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1147877&theme=dark&t=1778869689948"
                    />
                </a>
                <p className="text-slate-500 text-sm">© 2026 InterviewIQ. Built by Abhishek Srivastava.</p>
            </footer>

        </div >
    );
}

export default HomePage;