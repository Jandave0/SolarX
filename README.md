# ☀️ SolarX
**Intelligence-Driven Solar Energy Monitoring**

SolarX is a premium mobile application that bridges the gap between complex solar hardware data and actionable user insights. Built with a custom **Solar Neo-Material** design system, it provides AI-powered site assessments, hardware diagnostics, smart panel alignment, and weather-based yield forecasting — all in a high-performance, offline-capable package.

![Design](https://img.shields.io/badge/Design-Neo--Material%20%2F%20Glassmorphism-FFB703?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-React%20Native%20%2F%20Expo-00E5FF?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203.3-FF4D6D?style=for-the-badge)
![DB](https://img.shields.io/badge/DB-SQLite%20%2B%20Supabase-3ECF8E?style=for-the-badge)

---

## ✨ Features

### 📊 Live Energy Dashboard
Real-time energy flow visualization with animated `CircularGauge`, energy chip indicators, and a `Victory Native` line chart showing 24-hour production curves. Surfaces your latest AI assessment recommendation and links directly to the assessment wizard.

### 🤖 AI Site Assessment (RAG)
A guided 2-step wizard (Location → Energy Profile) that uses **Retrieval-Augmented Generation** via the **Groq API (Llama 3.3)** to generate a tailored solar system recommendation — including panel capacity, inverter type, and battery storage sizing. Results are persisted locally to SQLite and surfaced on the Dashboard.

### 🔧 Hardware Inventory & Diagnostics
Full CRUD for your solar hardware inventory, synced between local SQLite and **Supabase Postgres**. Includes a real-time Supabase subscription for multi-device sync. An integrated AI diagnostic tool analyses your current hardware mix and flags efficiency bottlenecks.

### 📐 Smart Tilt Optimizer
Uses native **Accelerometer** and **Magnetometer** sensors to provide real-time panel alignment guidance. A physics-based animated bubble level (React Native Reanimated) gives instant visual feedback. Calibration settings are saved to SQLite for reference on future sessions.

### 🌤️ Weather & Harvest Forecasting
Current irradiance conditions, peak harvest window, and a 5-day solar forecast with per-day irradiance ratings. Includes pull-to-refresh.

### 💾 Offline-First Persistence
All assessment history and hardware inventory is stored in a local **SQLite** database via `expo-sqlite`, using the `SQLiteProvider` context pattern for safe, zero-race-condition initialization. Data is available with no network connection.

---

## 🎨 Design System: Solar Neo-Material

| Token | Value | Usage |
|-------|-------|-------|
| `Solar Gold` | `#FFB703` | Production, primary actions, active states |
| `Electric Blue` | `#00E5FF` | Grid consumption, info states |
| `Neon Rose` | `#FF4D6D` | Alerts, critical hardware status |
| `Deep Matte Night` | `#131317` | Background, tab bar |
| `Surface Container` | `#1E1E26` | Cards, glass panels |

**Typography:** `Plus Jakarta Sans` (body) + `Outfit` (display/headings) via `expo-font`.

**Motion:** All transitions and sensor-driven animations use `react-native-reanimated` worklets running on the UI thread at 60fps.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native / Expo (Managed Workflow) |
| Language | TypeScript |
| Navigation | Expo Router v3 (file-based) |
| Styling | NativeWind v5 / Tailwind CSS v4 |
| State Management | Zustand |
| Local Database | expo-sqlite (SQLiteProvider pattern) |
| Cloud Backend | Supabase (Postgres + Realtime) |
| AI Engine | Groq API — Llama 3.3 70B |
| Charts | Victory Native |
| Animations | React Native Reanimated |
| Sensors | expo-sensors (Accelerometer, Magnetometer) |
| Icons | @expo/vector-icons (MaterialCommunityIcons) |
| Fonts | expo-google-fonts (Outfit, Plus Jakarta Sans) |

---

## 📁 Project Structure

```
SolarX/
├── app/
│   ├── _layout.tsx          # Root layout — SQLiteProvider, font loading, Stack navigator
│   ├── assessment.tsx       # AI Assessment wizard (modal screen)
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator
│       ├── index.tsx        # Live Dashboard
│       ├── hardware.tsx     # Hardware inventory & AI diagnostics
│       ├── weather.tsx      # Weather & harvest forecast
│       └── optimizer.tsx    # Smart Tilt Optimizer
├── src/
│   ├── components/          # UI Components & Feature Modules
│   │   ├── charts/
│   │   │   └── EnergyFlowChart.tsx
│   │   └── ui/              # Atom-level UI (Button, Card, etc.)
│   ├── hooks/               # Core sensors & simulation logic
│   ├── lib/
│   │   ├── groq.ts          # Groq API client (RAG prompt builder)
│   │   └── supabase.ts      # Supabase client (SecureStore-first auth)
│   ├── services/
│   │   ├── database.ts      # SQLite schema, migrations, data helpers
│   │   ├── hardwareService.ts  # Hardware CRUD (SQLite + Supabase sync)
│   │   └── weatherService.ts   # Weather data fetching
│   └── store/
│       └── assessmentStore.ts  # Zustand store for assessment wizard state
└── global.css               # NativeWind / Tailwind base styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Expo Go on a physical device **or** an Android/iOS emulator
- A [Groq API key](https://console.groq.com/) (free tier available)
- A [Supabase project](https://supabase.com/) (free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/SolarX.git
cd SolarX

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in your keys (see below)

# 4. Start the development server
npx expo start
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Security Note:** The Groq API Key is not included in environment variables to prevent it from being bundled with the application. Instead, it should be configured securely via the in-app Settings screen (stored in device SecureStore). For production, it is recommended to proxy all Groq requests through a Supabase Edge Function.

### Supabase Schema

Run this SQL in your Supabase SQL Editor to provision required tables:

```sql
CREATE TABLE IF NOT EXISTS hardware (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  health INTEGER NOT NULL,
  specs TEXT,
  price REAL
);
```

The `assessments` and `panel_configs` tables are created automatically by the SQLite migration in `database.ts` on first app launch.

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Solar Neo-Material design system (colors, typography, glassmorphism components)
- [x] Expo Router navigation (tabs + modal stack)
- [x] AI Site Assessment wizard with Groq RAG integration
- [x] SQLite offline persistence (`SQLiteProvider` pattern)
- [x] Hardware inventory CRUD with Supabase realtime sync
- [x] Smart Tilt Optimizer with live sensor feedback
- [x] Weather & irradiance forecast screen
- [x] Assessment history persistence and dashboard surfacing
- [x] Security audit (API key handling, `.gitignore`, SecureStore pattern)

### 🔜 Next Sprint
- [ ] **Appliance-Aware AI Assessment** — Step 3 appliance picker (AC, fridge, etc.) feeds real load profile into the RAG prompt for accurate system sizing
- [ ] **Export Data** — Export assessment history to JSON/CSV; shareable PDF report for installers via `expo-sharing`
- [ ] **Import Data** — Restore backup JSON or import monthly kWh from a CSV
- [ ] **Settings Screen** — Wire up the dead `/settings` route with Export/Import controls
- [ ] **Real Irradiance API** — Replace mock weather data with Open-Meteo solar radiation endpoint (free)

### 🔮 Future Backlog
- [ ] Supabase Auth — Email/Google login for cross-device sync
- [ ] ROI Calculator — Payback period with live Meralco ₱/kWh rates
- [ ] Push Notifications — Peak yield alerts, low battery warnings
- [ ] Real Inverter Integration — SolarEdge / Fronius / Modbus polling
- [ ] Bill Analyzer — Camera scan of Meralco bill → auto-populate energy fields
- [ ] Seasonal Tilt Calendar — Monthly optimal tilt guide for Philippine latitude
- [ ] Installer Marketplace — Connect with accredited PH solar installers
- [ ] Home Screen Widget — Live kW output widget (iOS/Android)

---

## 📄 License

MIT License — see `LICENSE` for details.