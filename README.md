# 🟩 Matrix Website

A Matrix-inspired immersive React web application that combines **interactive UI**, **3D visuals**, and **dynamic document generation**.

This project was built as a hands-on frontend showcase to explore modern React patterns, advanced frame-motion animations, creative user interfaces, and the robust integration of 3D elements.

### 🌍 **[Live Demo: Enter the Matrix](https://ofirpeer07.github.io/matrix-website)**

---

## 🚀 Project Overview

The Matrix Website is a frontend-focused React application featuring a strong, meticulously crafted visual identity inspired by *The Matrix*.
The project emphasizes **component-based architecture**, **motion & effects**, and **user-facing features**, transporting users into a hacker-style terminal environment.
It includes interactive hubs like **Neo's Pathway** (featuring a powerful Resume Builder, video hubs, and guides) and the **Agent Smith Department** (featuring tech news and troubleshooting).

---

## ✨ Key Features

- 🎬 **Matrix-Themed Visuals & Assets**: Authentic falling digital rain, terminal-style UI, and glowing green typography.
- 🧩 **Modular React Architecture**: Highly organized, scalable component structure separating UI elements and layouts.
- 🎥 **Fluid Animations**: Smooth page transitions and micro-interactions powered by **Framer Motion**.
- 🌐 **Dynamic 3D Elements**: Interactive 3D objects and environments using **Three.js** (`@react-three/fiber`, `@react-three/drei`).
- 📄 **Hacker-Grade Resume Builder**: A robust, interactive tool with specific layouts lockable to A4 proportions for both screen preview and print.
- 🖨️ **High-Quality PDF Export**: Client-side document generation using **html2canvas** and **jsPDF**.
- 🌍 **Bilingual Support (EN/HE)**: Seamlessly toggle between English and meticulously translated Hebrew (RTL supported where appropriate).
- 📱 **Responsive & Adaptive Layout**: Tailored stylesheets (`.mobile.css`) ensuring an optimal experience across desktop and mobile devices.

---

## 🛠️ Technologies & Stack

- **Framework**: React (Create React App)
- **Styling**: CSS Modules, Tailwind CSS base, and structured global stylesheets
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Effects**: `@react-three/postprocessing`
- **Routing**: React Router DOM (`HashRouter`)
- **PDF Generation**: HTML2Canvas & jsPDF
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

---

## 📁 Project Structure

```text
matrix-website/
├── public/                # Static assets & build output
├── src/
│   ├── assets/            # Global images, icons, and media files
│   ├── components/        # Reusable UI & major feature components
│   │   ├── AgentSmith/    # Agent Smith Hub (Tech News, Troubleshooting)
│   │   ├── App/           # Root Application Component & Routing
│   │   ├── MainPage/      # Hero Landing Page & Red/Blue Pill selection
│   │   └── Neo/           # Neo Hub (Resume Builder, Articles, Videos)
│   ├── context/           # React Contexts (e.g., LocaleContext for i18n)
│   ├── styles/            # Organized feature-specific CSS and print styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global Tailwind and Matrix utility styles
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

---

## ▶️ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Run Locally
Start the development server:
```bash
npm start
```
The app will be available at: [http://localhost:3000](http://localhost:3000)

### Building & Deployment
To build the application for production:
```bash
npm run build
```
To deploy to GitHub Pages:
```bash
npm run deploy
```

---

## 🎯 Purpose & Motivation

This project was built to:

- Practice advanced React frontend techniques and state management.
- Experiment with smooth animations, immersive 3D visuals, and post-processing effects.
- Explore creative UI concepts beyond standard corporate web layouts.
- Build a polished, portfolio-level interactive application with real utility (like the Resume Builder).

---

## 🔮 Possible Future Improvements

- Improve accessibility (ARIA roles, enhanced keyboard navigation).
- Add more interactive 3D scenes and deeper WebGL integrations.
- Optimize performance and asset loading for low-end devices.
- Expand the bilingual support to more immersive areas of the terminal.
- Implement automated testing (Jest, React Testing Library) for core features.

---

## 👤 Author

**Ofir Peer**  
Frontend Developer  

GitHub: [https://github.com/OfirPeer07](https://github.com/OfirPeer07)
