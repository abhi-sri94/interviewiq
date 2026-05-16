import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ResumeAnalyzerPage from "./pages/ResumeAnalyzerPage";
import InterviewPage from "./pages/InterviewPage";
import JobTrackerPage from "./pages/JobTrackerPage";
import LinkedInOptimizerPage from "./pages/LinkedInOptimizerPage";
import './App.css'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="resume" element={<ResumeAnalyzerPage />} />
          <Route path="tracker" element={<JobTrackerPage />} />
          <Route path="linkedin" element={<LinkedInOptimizerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;