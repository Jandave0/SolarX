## 2026-06-01 - Duplicate Timers & Static Children Re-renders
**Learning:** Using a custom hook containing a `setInterval` (like `useEnergySimulation`) inside both a parent component and its child causes duplicate background timers. Furthermore, the parent component updating state every second will force re-renders on all its children, even those that only fetch static data on mount (like `AssessmentHistory`).
**Action:** When a parent needs live simulation data, hoist the state/hook call to the parent and pass the data down as props. For static child components in a rapidly updating parent, wrap them in `React.memo()` to prevent unnecessary re-rendering.

## 2026-06-02 - Unnecessary UI Component Re-renders
**Learning:** Highly reusable UI components like `EnergyChip` and `CircularGauge` were experiencing unnecessary re-renders because their parent components (like the main dashboard) update state frequently (e.g., every second via `setInterval` hooks). This triggers a re-render cascade for all children, even those with identical props.
**Action:** Always wrap purely functional, presentation-only UI components in `React.memo()` if they are likely to be used within rapidly updating parent contexts to prevent wasteful React reconciliations and layout passes.
