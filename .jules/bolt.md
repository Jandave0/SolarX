## 2026-06-01 - Duplicate Timers & Static Children Re-renders
**Learning:** Using a custom hook containing a `setInterval` (like `useEnergySimulation`) inside both a parent component and its child causes duplicate background timers. Furthermore, the parent component updating state every second will force re-renders on all its children, even those that only fetch static data on mount (like `AssessmentHistory`).
**Action:** When a parent needs live simulation data, hoist the state/hook call to the parent and pass the data down as props. For static child components in a rapidly updating parent, wrap them in `React.memo()` to prevent unnecessary re-rendering.

## 2024-05-18 - Unremovable Event Listeners via React State
**Learning:** Storing event listener subscription references (like those from `expo-sensors`) in React state inside a `useEffect` hook with an empty dependency array (`[]`) causes a critical memory leak. The cleanup function closes over the initial state value (e.g., `null`), meaning the `.remove()` method is never called on unmount. This results in continuous background processing and unnecessary traffic over the React Native bridge.
**Action:** Always store event listener subscriptions in local variables within the `useEffect` closure, ensuring the cleanup function has direct access to the active references for proper disposal.
