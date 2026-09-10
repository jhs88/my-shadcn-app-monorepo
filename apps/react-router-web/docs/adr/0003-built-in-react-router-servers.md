---
status: accepted
---

# Use React Router's built-in servers

The React Router example uses `react-router dev` during development and `react-router-serve` for its built production bundle. The former custom Express adapter was an undeployed learning experiment; removing it keeps the example focused on framework-mode routing and avoids maintaining security, observability, and request-context behavior on a second runtime that production does not exercise.

This amends the Express-adapter detail in system ADR-0005 while preserving that ADR's dual-frontend strategy. CSP nonces and response security headers remain in the framework's `entry.server.tsx`, where both canonical server paths exercise them.
