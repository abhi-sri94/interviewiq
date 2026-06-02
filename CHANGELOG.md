# InterviewIQ - Mobile, SEO, & Audio Updates Changelog

This document outlines the visual enhancements, SEO integrations, audio playback controllers, and workspace customization features added to InterviewIQ.

---

## 📱 1. Mobile & Tablet Responsiveness Fixes
* **Grid and Card Restructuring**: Sized down margins, borders, typography, and card paddings on mobile screens across all pages:
  * [LoginPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/LoginPage.jsx) & [RegisterPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/RegisterPage.jsx) (compact forms).
  * [ResumeAnalyzerPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/ResumeAnalyzerPage.jsx) (smaller drag/drop uploader).
  * [LinkedInOptimizerPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/LinkedInOptimizerPage.jsx) (compact textarea fields).
  * [DashboardHome.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/DashboardHome.jsx) (timeline item padding and smaller header fonts).
* **Scroll-Snap Carousels**: Replaced vertical card walls in Features & Steps sections with touch-friendly CSS horizontal carousels (`snap-x snap-mandatory flex`) in [HomePage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/HomePage.jsx).
* **Grid Breakpoint Adjustments**: Deferred the 3-column grid transitions from `md` (768px) to `lg` (1024px). On tablet/iPad viewports, cards now render as a 2-card scroll-snap carousel rather than squeezed vertical columns.
* **Hero CTA Alignment**: Redesigned hero buttons on the landing page into a side-by-side flex layout with automatic padding reductions on mobile.

---

## 🔗 2. Navigation Routing Adjustments
* **Homepage Logo Redirects**: Changed all main logo redirects from conditional `/dashboard` paths to direct home links (`/`) in:
  * [Navbar.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/components/Navbar.jsx) (Public header).
  * [DashboardLayout.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/layouts/DashboardLayout.jsx) (Mobile header & desktop sidebar).

---

## ✏️ 3. Global Typography Scaling
* **Root Font Sizing**: Adjusted global relative scaling ratios inside [index.css](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/index.css):
  * Mobile viewports: Reduced base font size from `100%` to `95%`.
  * Tablet/Desktop viewports: Reduced base font size from `115%` to `105%`.
  * Proportional layout sizing fits perfectly inside cards and reduces overall vertical scrolling.

---

## 🏷️ 4. SEO & Social Preview Integration (Open Graph)
* **Metadata Insertion**: Configured comprehensive sharing previews inside [index.html](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/index.html):
  * Professional browser tab `<title>` details.
  * Meta page description tags.
  * Open Graph and Twitter Card tags to enable rich-media banner cards on social shares (LinkedIn, X, WhatsApp, Slack).
* **Rich Preview Thumbnail**: Generated a custom high-end dashboard mockup preview image, saved as [/public/og-image.png](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/public/og-image.png), which is automatically referenced as the OG share thumbnail.
* **Canonical URL**: Added `<link rel="canonical">` referencing the deployment domain (`https://interviewiq-frontend-ten.vercel.app`) to optimize crawler index indexing.

---

## ⚙️ 5. PWA (Progressive Web App) manifest
* **Standalone Support**: Added W3C compliant [manifest.json](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/public/manifest.json) into the `public` directory, enabling standalone application shells.
* **Mobile Customization**: Configured address bar color overrides (`#020617` theme matching) and iOS apple-mobile-web-app configuration flags.

---

## 🔊 6. AI Question Voiceover & Audio Controls
* **Speech Synthesis Integration**: Created a reactive voice generator hook in [InterviewPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/InterviewPage.jsx) that automatically speaks verbal mock questions aloud using the Web Speech Synthesis API.
* **Persistent Mute Switch**: Added a speaker toggle button next to the question header, persisting preferences in `localStorage` so they remain across different question slides and browser reloads.
* **Replay Command**: Embedded a reload icon button next to the mute state to allow users to re-listen to the question at any time.

---

## 📊 7. Mic Equalizer & Workspace Customizers
* **Mic Waveform Visualizer**: Configured bouncing equalizer keyframes in [index.css](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/index.css). When recording is active (`isListening === true`), the Question Card displays a pulsing equalizer visualizer with 5 bouncing red bars.
* **Monaco custom controls**: Added state dropdown controls next to the editor language selector in [InterviewPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/InterviewPage.jsx):
  * **Theme**: Choose between `Dark` (vs-dark) and `Light` editor themes.
  * **Font**: Sizing ranges from `12px` to `20px`.
