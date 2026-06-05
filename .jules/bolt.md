## 2026-06-01 - Duplicate Timers & Static Children Re-renders
**Learning:** Using a custom hook containing a `setInterval` (like `useEnergySimulation`) inside both a parent component and its child causes duplicate background timers. Furthermore, the parent component updating state every second will force re-renders on all its children, even those that only fetch static data on mount (like `AssessmentHistory`).
**Action:** When a parent needs live simulation data, hoist the state/hook call to the parent and pass the data down as props. For static child components in a rapidly updating parent, wrap them in `React.memo()` to prevent unnecessary re-rendering.

## 2026-06-05 - Event Listener Subscriptions in React State
**Learning:** Storing event listener subscriptions (such as Expo sensors) in a React `useState` variable inside a custom hook can lead to a memory leak and React Native bridge spam. Because `useEffect`'s cleanup function closes over the initial state value (`null`), the `.remove()` calls on those subscriptions are never actually executed when the component unmounts.
**Action:** When subscribing to events or sensors inside `useEffect`, store the subscription references directly as local variables within the `useEffect` scope to ensure the cleanup function can properly access and clear them.
