import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiEdit2, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const COLUMNS = [
    { id: "Applied", title: "Applied", icon: <FiClock className="text-blue-400" />, bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: "Interviewing", title: "Interviewing", icon: <FiTrendingUp className="text-yellow-400" />, bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { id: "Offer", title: "Offer", icon: <FiCheckCircle className="text-green-400" />, bg: "bg-green-500/10", border: "border-green-500/20" },
    { id: "Rejected", title: "Rejected", icon: <FiXCircle className="text-red-400" />, bg: "bg-red-500/10", border: "border-red-500/20" },
];

function JobTrackerPage() {
    const { token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newJob, setNewJob] = useState({ company: "", role: "", status: "Applied", notes: "", salary: "" });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/jobs", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(newJob)
            });
            const data = await res.json();
            setJobs([data, ...jobs]);
            setShowModal(false);
            setNewJob({ company: "", role: "", status: "Applied", notes: "", salary: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:8000/api/jobs/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            setJobs(jobs.map(j => j._id === id ? data : j));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await fetch(`http://localhost:8000/api/jobs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(jobs.filter(j => j._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Application Tracker</h1>
                    <p className="text-gray-400 text-sm">Organize your job search and track your progress in one place.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                    <FiPlus className="text-xl" /> Add Application
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[60vh]">
                {COLUMNS.map(col => (
                    <div key={col.id} className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} backdrop-blur-sm p-4`}>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            {col.icon}
                            <h2 className="font-semibold text-white tracking-wide">{col.title}</h2>
                            <span className="ml-auto bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                                {jobs.filter(j => j.status === col.id).length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 h-full">
                            {jobs.filter(j => j.status === col.id).map(job => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={job._id}
                                    className="bg-gray-900/50 border border-white/5 rounded-xl p-4 group hover:border-cyan-500/50 transition-all cursor-default"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{job.company}</h3>
                                        <button 
                                            onClick={() => deleteJob(job._id)}
                                            className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">{job.role}</p>
                                    
                                    {job.notes && (
                                        <p className="text-[11px] text-gray-500 mb-4 line-clamp-2 italic bg-black/20 p-2 rounded-lg border border-white/5">
                                            "{job.notes}"
                                        </p>
                                    )}
                                    
                                    <div className="flex gap-2 items-center">
                                        <select 
                                            value={job.status}
                                            onChange={(e) => updateStatus(job._id, e.target.value)}
                                            className="bg-black/40 text-[10px] text-gray-300 border border-white/10 rounded-lg px-2 py-1 outline-none hover:border-cyan-500/30 transition-all cursor-pointer"
                                        >
                                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                        <span className="text-[10px] text-gray-600 ml-auto italic">
                                            {new Date(job.dateApplied).toLocaleDateString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Job Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.form 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onSubmit={handleAddJob}
                            className="relative bg-gray-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">New Application</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Company Name</label>
                                    <input 
                                        required
                                        value={newJob.company}
                                        onChange={e => setNewJob({...newJob, company: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all"
                                        placeholder="Google, Meta, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Job Role</label>
                                    <input 
                                        required
                                        value={newJob.role}
                                        onChange={e => setNewJob({...newJob, role: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all"
                                        placeholder="Frontend Developer"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
                                        <select 
                                            value={newJob.status}
                                            onChange={e => setNewJob({...newJob, status: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all"
                                        >
                                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Salary (Optional)</label>
                                        <input 
                                            value={newJob.salary}
                                            onChange={e => setNewJob({...newJob, salary: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all"
                                            placeholder="e.g. 15 LPA"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Notes</label>
                                    <textarea 
                                        rows="3"
                                        value={newJob.notes}
                                        onChange={e => setNewJob({...newJob, notes: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all resize-none"
                                        placeholder="Add any interview dates or links..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-xl transition-all"
                                >
                                    Add Job
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default JobTrackerPage;
