<<<<<<< HEAD
# SolarX Mobile Application

SolarX is an advanced React Native (Expo) application providing solar decision support and AI-driven insights using the Groq API and Supabase pgvector.

## Requirements
*   Node.js >= 18.x
*   Expo CLI (`npm i -g expo-cli`)
*   iOS Simulator / Android Emulator for Development Builds

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd solarx-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
# AI Integration
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

## Running the App
You can run the app using Expo Go during development:

```bash
npx expo start
```

## Development Tasks & Delegation

During the development lifecycle, the **Gemini CLI** is assigned to handle the smaller, autonomous implementation tasks within Phase 2 and Phase 3:

* **Phase 2 (Fundamental UI & Navigation):** 
  Gemini CLI is tasked with scaffolding the remaining shell pages (Live Dashboard, Hardware Health, Weather & Harvest, Smart Tilt Optimizer), building `app/(tabs)/_layout.tsx`, and verifying UI component fidelity.
  
* **Phase 3 (Hardware/API Integration & Data Operations):** 
  Gemini CLI is tasked with handling discrete integrations such as wiring up the `expo-sensors` (accelerometer/magnetometer), building `victory-native` mock charts, scaffolding the Supabase CRUD operations, and generating Zustand store primitives (`useHardwareStore`, `useAssessmentStore`) for reactive state management.

* **Phase 5 (Polish & Deployment):** 
  Gemini CLI is assigned to perform automated UI performance audits, implement `react-native-reanimated` micro-interactions (e.g., the "Solar Pulse" gauge), and execute End-to-End (E2E) testing for offline/online synchronization behavior.
=======

