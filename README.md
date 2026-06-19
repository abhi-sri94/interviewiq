# 🚀 InterviewIQ: AI-Powered Interview Simulator


**Live Demo:** https://interviewiq-frontend.vercel.app

InterviewIQ is an advanced mock interview simulator designed to help developers, students, and professionals prepare for technical and HR interviews. It leverages the Google Gemini AI to generate dynamic questions, evaluate spoken or written answers, and provide real-time, constructive feedback.

## ✨ Features 

- **🗣️ AI Voice Interviews**: Practice realistic mock interviews using live speech-to-text recognition.
- **💻 Integrated Coding Environment**: Built-in **Monaco Editor** (VS Code's core editor) for live coding rounds.
- **🛡️ Secure Code Execution**: User-submitted code is executed securely via the **Piston API** in an isolated Docker container, avoiding dangerous `eval()` calls.
- **📊 Instant Feedback & Analytics**: Get immediate scoring on Technical Accuracy, Communication, and Confidence, along with AI-generated follow-up questions.
- **🎨 Premium UI/UX**: Fully responsive, glassmorphic design built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling & Responsiveness)
- **Framer Motion** (Animations)
- **Monaco Editor** (`@monaco-editor/react`)
- **React Router DOM** (Client-side routing)
- **Vercel** (Hosting)

### Backend
- **Node.js / Express.js**
- **Google Gemini AI API** (LLM for question generation and feedback)
- **Piston API** (Secure remote code execution)
- **Render** (Hosting)

## 🚀 Getting Started


## 🔐 Security Note
Unlike typical frontend IDE clones that evaluate code insecurely in the browser, InterviewIQ utilizes the external **Piston API** to run JavaScript code inside a sandboxed environment, preventing Cross-Site Scripting (XSS) vulnerabilities.
