import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    averagePerformance: {
        type: Number,
        required: true,
    },
    history: [
        {
            type: {
                type: String,
                enum: ["verbal", "coding"],
                required: true,
            },
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
            },
            code: {
                type: String,
            },
            passed: {
                type: Boolean,
            },
            scores: {
                technical: { type: Number },
                communication: { type: Number },
                confidence: { type: Number },
            },
            feedback: {
                type: String,
            },
            output: {
                type: String,
            }
        }
    ]
}, { timestamps: true });

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
