# ☀️ SolarX
**Intelligence-Driven Energy Ecosystem Monitoring**

SolarX is a premium mobile application designed to bridge the gap between complex solar hardware data and actionable user insights. Built with a high-performance **"Solar Neo-Material"** design system, it provides real-time monitoring, AI diagnostics, and hardware optimization tools for the modern energy-independent home.

![Design Aesthetic: Neo-Material / Glassmorphism](https://img.shields.io/badge/Design-Neo--Material-FFB703?style=for-the-badge)
![Tech: React Native / Expo](https://img.shields.io/badge/Stack-React%20Native%20%2F%20Expo-00E5FF?style=for-the-badge)
![AI: Groq / Llama 3](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203-FF4D6D?style=for-the-badge)

---

## ✨ Key Features

- **🔋 Live Energy Flow:** Dynamic visualization of production, consumption, and battery storage using a high-fidelity glassmorphism dashboard.
- **🤖 AI Diagnostics (RAG):** Leverages the **Groq API (Llama 3)** to analyze hardware logs and provide maintenance recommendations through Retrieval-Augmented Generation.
- **📐 Smart Tilt Optimizer:** Uses native device sensors (**Accelerometer & Magnetometer**) to guide users toward the mathematically optimal panel tilt for their exact GPS location.
- **🌤️ Harvest Forecasting:** Integrated weather intelligence that calculates solar yield potential and suggests appliance scheduling.
- **📊 Real-time Analytics:** Smooth, interactive charts powered by **Victory Native** for granular performance tracking.

## 🎨 Design System: Solar Neo-Material
The application follows a custom-built design system characterized by:
- **Glassmorphism Panels:** Translucent UI elements with real-time blur and frosted borders.
- **Vibrant Semantic Palette:** `Solar Gold` (Production), `Electric Blue` (Grid), and `Neon Rose` (Alerts).
- **High-Performance Motion:** Micro-interactions and fluid transitions powered by `React Native Reanimated`.

## 🛠️ Technology Stack
- **Framework:** React Native / Expo (Managed Workflow)
- **Styling:** Tailwind CSS v4 / NativeWind v5
- **Navigation:** Expo Router (File-based routing)
- **State Management:** Zustand (Reactive primitives)
- **Backend/Vector DB:** Supabase (pgvector for hardware analysis)
- **AI Engine:** Groq (Llama 3.3 model support)
- **Visualization:** Victory Native (High-performance charts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Expo Go (on physical device) or iOS/Android emulator

### Installation
1. Clone the repo
   ```bash
   git clone https://github.com/your-username/SolarX.git


2. Install dependencies
   ```bash
   npm install


   
3. Set up Environment Variables Create a .env file in the root:
   ```env
   EXPO_PUBLIC_GROQ_API_KEY=your_key_here
   EXPO_PUBLIC_SUPABASE_URL=your_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here



4. Launch the application
  ```bash
   npx expo start
