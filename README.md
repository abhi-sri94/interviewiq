# 🚀 InterviewIQ: AI-Powered Interview Simulator

![InterviewIQ Demo](https://interviewiq-frontend.vercel.app/favicon.svg)

**Live Demo:** [interviewiq-frontend.vercel.app](https://interviewiq-frontend.vercel.app)

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

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhi-sri94/interviewiq-backend.git
   cd interviewiq-backend
   ```

2. **Setup the Backend:**
   ```bash
   cd interviewiq/backend
   npm install
   ```
   Create a `.env` file in the backend directory and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app running locally!

## 🔐 Security Note
Unlike typical frontend IDE clones that evaluate code insecurely in the browser, InterviewIQ utilizes the external **Piston API** to run JavaScript code inside a sandboxed environment, preventing Cross-Site Scripting (XSS) vulnerabilities.

## 📄 License
This project is open-source and available under the MIT License.
