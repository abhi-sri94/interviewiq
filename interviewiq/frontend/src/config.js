export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "production" 
    ? "https://interviewiq-5jz1.onrender.com" 
    : "http://localhost:8000");
