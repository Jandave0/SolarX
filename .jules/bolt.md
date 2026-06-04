## 2026-06-01 - Duplicate Timers & Static Children Re-renders
**Learning:** Using a custom hook containing a `setInterval` (like `useEnergySimulation`) inside both a parent component and its child causes duplicate background timers. Furthermore, the parent component updating state every second will force re-renders on all its children, even those that only fetch static data on mount (like `AssessmentHistory`).
**Action:** When a parent needs live simulation data, hoist the state/hook call to the parent and pass the data down as props. For static child components in a rapidly updating parent, wrap them in `React.memo()` to prevent unnecessary re-rendering.

## 2026-06-04 - Native Bridge Spam and Memory Leaks with Sensor Event Listeners
**Learning:** Using React state (e.g., `useState`) to store subscription objects for Expo sensors (like `Accelerometer` and `Magnetometer`) inside a `useEffect` with an empty dependency array causes a memory leak. The cleanup function closes over the initial state (`null`), meaning the listeners are never actually removed. In the case of high-frequency sensors, this leads to severe native bridge spam and updates to unmounted components.
**Action:** Always store event listener subscriptions as local variables inside the `useEffect` closure so the cleanup function has direct access to them for removal. Do not store them in React state.
