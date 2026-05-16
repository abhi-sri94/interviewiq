import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Applied", "Interviewing", "Offer", "Rejected"],
        default: "Applied",
    },
    dateApplied: {
        type: Date,
        default: Date.now,
    },
    salary: {
        type: String,
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
