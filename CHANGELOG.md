# InterviewIQ - Mobile, SEO, & Audio Updates Changelog

This document outlines the modifications, optimizations, and new features implemented in today's active development session.

---

## 📱 1. Landing Page Responsiveness (Mobile & Tablet)
* **Side-by-Side Elements**: Aligned hero CTA buttons (*Start Interview* & *Watch Demo*) horizontally on mobile with auto-scaling padding.
* **Compact Stats**: Switched stats cards to a fixed 3-column horizontal grid (`grid-cols-3`) with optimized paddings and text sizes.
* **Scroll-Snap Carousels**: Replaced vertical card stacks for Features & Steps sections with touch-friendly CSS horizontal carousels (`snap-x snap-mandatory flex`) in [HomePage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/HomePage.jsx).
* **Tablet Scaling**: Deferred the 3-column desktop grid transition from `md` (768px) to `lg` (1024px) in [HomePage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/HomePage.jsx). On tablets, cards scale to `sm:w-[48%]` and display as a spacious horizontal carousel.

---

## 🔗 2. Navigation Routing Adjustments
* **Homepage Logo Redirects**: Changed all logo click paths from the conditional `/dashboard` paths to direct home links (`/`) in:
  * [Navbar.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/components/Navbar.jsx) (Public header logo).
  * [DashboardLayout.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/layouts/DashboardLayout.jsx) (Mobile header logo & desktop sidebar logo).

---

## ✏️ 3. Global Typography Sizing
* **Root Font Scale**: Adjusted global relative text scaling inside [index.css](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/index.css):
  * Mobile viewports: Reduced base font size from `100%` to `95%`.
  * Tablet/Desktop viewports: Reduced base font size from `115%` to `105%`.
  * Proportional layout sizing fits text better and decreases overall vertical scrolling.

---

## 🏷️ 4. SEO & Social Preview Integration (Open Graph)
* **Metadata Insertion**: Configured sharing previews in [index.html](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/index.html):
  * Set a professional browser tab title: `InterviewIQ | AI-Powered Mock Interviews & Tech Interview Prep`.
  * Added description metadata.
  * Added Open Graph (`og:*`) and Twitter Card (`twitter:*`) tag blocks for rich sharing previews.
* **Rich Preview Thumbnail**: Generated a custom high-end dashboard mockup preview image, saved as [/public/og-image.png](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/public/og-image.png), which is automatically referenced as the OG share thumbnail.
* **Canonical URL**: Added `<link rel="canonical">` referencing the deployment domain (`https://interviewiq-frontend-ten.vercel.app`) to optimize crawler indexing.

---

## ⚙️ 5. PWA (Progressive Web App) manifest
* **Standalone Support**: Added W3C compliant [manifest.json](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/public/manifest.json) in the `public` directory, enabling standalone application shells.
* **Mobile Customization**: Configured address bar color overrides (`#020617` theme matching) and iOS apple-mobile-web-app configuration flags.

---

## 🔊 6. AI Question Voiceover & Audio Controls
* **Speech Synthesis**: Created a reactive voice generator hook in [InterviewPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/InterviewPage.jsx) that automatically speaks verbal mock questions aloud using the Web Speech Synthesis API.
* **Mute Switch**: Added a speaker toggle button next to the question header, persisting preferences in `localStorage` so they remain across different question slides and browser reloads.
* **Replay Command**: Embedded a reload icon button next to the mute state to allow users to re-listen to the question at any time.

---

## 📊 7. Mic Equalizer & Workspace Customizers
* **Mic Waveform Visualizer**: Configured bouncing equalizer keyframes in [index.css](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/index.css). When recording is active (`isListening === true`), the Question Card displays a pulsing equalizer visualizer with 5 bouncing red bars.
* **Monaco Custom Controls**: Added state dropdown controls next to the editor language selector in [InterviewPage.jsx](file:///Users/user/Desktop/interview-simulator/interviewiq/frontend/src/pages/InterviewPage.jsx):
  * **Theme**: Choose between `Dark` (vs-dark) and `Light` editor themes.
  * **Font**: Sizing ranges from `12px` to `20px`.
