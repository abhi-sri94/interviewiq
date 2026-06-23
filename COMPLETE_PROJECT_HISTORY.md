# 🚀 InterviewIQ: Complete Project History (Day 1 - Present)

This document contains a comprehensive log of the entire design, development, and deployment history of the **InterviewIQ AI-Powered Mock Interview Simulator** from the initial setup (Day 1) to the present day.

---

## 📅 Day 1: Project Setup & Core AI Engine
*   **Monolithic Base Setup**: Developed the initial project directory structure, separating the Express/Node backend and React/Vite frontend.
*   **AI Integration**: Connected the backend to the Google Gemini API using dynamic system instructions to serve technical questions.
*   **API & CORS Configurations**: Resolved initial cross-origin sharing (CORS) bugs to allow safe local development communication, and centralized API base configurations.

---

## 📅 Day 2: Code Sandbox & Pressure Analytics
*   **Monaco Editor Sandbox**: Integrated the professional Monaco Code Editor (used by VS Code) into the interview workspace, enabling live in-browser coding.
*   **Secure Code Execution**: Connected the workspace to the Piston API to securely run user-written scripts directly in the sandbox.
*   **Pressure Timer & Reports**: Added a 10-minute countdown pressure timer. Built a custom, printable post-interview report card dashboard highlighting technical accuracy, confidence, and communication scores.
*   **AI Follow-Ups**: Built interactive query inputs allowing candidates to generate and answer follow-up questions from the AI interviewer.

---

## 📅 Day 3: Job Tracker & Mobile Scaling Overhaul
*   **Job Application Tracker**: Built a Kanban-like list to track jobs, add notes, specify salaries, and edit/delete application statuses.
*   **Global Mobile Responsiveness**: Redesigned layouts to adapt to mobile screens, including:
    *   Responsive scaling of the dashboard sidebar and header layouts.
    *   Replaced crowded grid layouts on small displays with single-column vertical stacks.
    *   Restructured the verbal mock workspace to stack microphone controls and text fields comfortably.

---

## 📅 Day 4: MongoDB History & Speech Recognition
*   **MongoDB Interview Logs**: Configured schema persistence to save past interviews to MongoDB Atlas, populating a user profile history dashboard with dynamic progress analytics.
*   **Multi-Language Sandbox**: Expanded Monaco code execution capabilities to support **JavaScript, Python, and Java**.
*   **Web Speech Recognition**: Implemented microphone voice-to-text functionality to allow candidates to speak their answers. Handled advanced web audio gotchas, including:
    *   Declared persistent references to eliminate speech initialization ReferenceErrors.
    *   Disabled speech continuous mode and implemented state filters to resolve mobile word duplication.
*   **Premium Glassmorphism Styling**: Overhauled the UI layout with deep navy mesh backgrounds, glowing gradients, glassmorphism cards, feed timelines, and custom input focus styling.

---

## 📅 Day 5: PWAs, SEO, & Audio Voiceovers
*   **Landing Page Scroll-Snap**: Redesigned landing pages with horizontal CSS carousels (`snap-x`) for Features and Steps sections, and centered CTA overlays for tablets and mobile devices.
*   **Open Graph SEO previews**: Configured social sharing headers (`og:image`, `twitter:card`) in `index.html` referencing a custom-generated high-fidelity application mockup dashboard (`public/og-image.png`). Added canonical tags for crawl efficiency.
*   **Progressive Web App (PWA)**: Added W3C compliant standalone `manifest.json` mapping out mobile splash displays, app icons, and standalone navigation shells for iOS and Android.
*   **Speech Synthesis Voiceover**: Added native voice synthesis to read interviewer questions aloud. Added volume controls (speaker toggle) with `localStorage` state persistence, replay actions, and a 5-bar bouncing SVG mic waveform equalizer.
*   **Monaco Customizer**: Added sidebar selectors allowing users to toggle between dark/light code editor themes and change font sizes from 12px to 20px.

---

## 📅 Day 6: Robust API Handlers & Vercel Serverless Migration
*   **Gemini Validation Safeguards**: Wrote helper routines to robustly extract and parse json fields from LLM outputs, preventing JSON parse failures and React blank-screen crashes during server hiccups.
*   **Resume-Tailored Interviews**: Connected user profile upload buffers to the backend pipeline. The system now parses resume text and prompts Gemini to ask questions tailored to identified resume keywords, weaknesses, and target roles.
*   **Serverless Express Migration**: Responded to Render's free tier suspension by migrating the Express backend to **Vercel Serverless Functions**, eliminating the need for keep-alive cron jobs.
*   **Serverless MongoDB Connect Middleware**: Resolved Lambda database connection timeouts (due to asynchronous connection pooling handshakes) by writing a cached database connection middleware (`connectDB`) that awaits connection readiness before resolving queries.
*   **Descriptive Error Handling**: Modified frontend pages to display exact backend API response statuses (such as Google's 503 free-tier rate limits) directly on screen for clear user feedback.
