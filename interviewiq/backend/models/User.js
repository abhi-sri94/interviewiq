import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        resumeText: {
            type: String,
            default: ""
        },
        targetJobDescription: {
            type: String,
            default: ""
        },
        resumeAnalysis: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
