## 2026-06-01 - Interactive Element Accessibility (React Native)
**Learning:** Found an accessibility issue pattern across this app's components regarding interactive elements (specifically `TouchableOpacity` and `Button`). Generic buttons were lacking explicit `accessibilityRole="button"` and `accessibilityState`, meaning screen readers couldn't identify them properly or indicate disabled state. Additionally, icon-only touchable elements were missing `accessibilityLabel`s.
**Action:** When creating new icon-only buttons or custom interactive components using `TouchableOpacity`, ensure they include `accessibilityRole`, `accessibilityLabel` (if icon-only), and `accessibilityState` (especially for disabled/loading indicators).

## 2026-06-02 - Form Inputs and Custom Buttons
**Learning:** Screen readers need context for inputs without visible labels. Also, `accessibilityState` requires `busy: true` when an action is loading, not just `disabled`.
**Action:** Always add `accessibilityLabel` to `TextInput`s. For loading components (like the custom `Button` UI), pass `busy: !!loading` into `accessibilityState` so screen readers announce it.
