## 2026-06-01 - Prevent Sensitive Data Leakage in Error Logs (Updated)
**Vulnerability:** Raw error objects from external API calls (like fetch or axios) and storage operations could be leaked to the client if thrown directly or improperly logged in user-facing contexts.
**Learning:** While swallowing all error details by completely removing the `error` object from `console.error` destroys application observability, throwing raw errors to the client can accidentally leak sensitive internal information such as bearer tokens (e.g., GROQ API keys) or stack traces.
**Prevention:** Follow defense-in-depth for error handling: Log the raw error internally for observability (`console.error('Operation failed:', error);`), but return or throw a sanitized, generic message to the user/client (`throw new Error('An unexpected error occurred.');`) to prevent exposing internal infrastructure details.
## 2025-02-14 - Predictable Math.random for Hardware ID Generation
**Vulnerability:** Predictable identifier generation using `Math.random().toString(36).substring(2, 9) + Date.now().toString(36)` in `src/services/hardwareService.ts`.
**Learning:** `Math.random()` is not cryptographically secure and can lead to predictable IDs, which can be vulnerable to guessing or collision attacks, particularly if IDs are exposed.
**Prevention:** Use `expo-crypto`'s `Crypto.randomUUID()` for generating secure, non-predictable, collision-resistant UUIDs instead of relying on `Math.random()`.
