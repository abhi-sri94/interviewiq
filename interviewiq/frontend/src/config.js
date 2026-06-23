export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "production" 
    ? "https://interviewiq-backend-new.vercel.app" 
    : "http://localhost:8000");
