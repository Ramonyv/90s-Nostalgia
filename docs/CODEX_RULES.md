# Codex rules

Before adding any feature, theme, or production content:

1. Read the relevant `/system` rules and `docs/system-audit.md`.
2. Reuse existing design tokens and components.
3. Reuse the scene/theme architecture; do not rename production routes.
4. Register analytics through `src/lib/analytics.ts` without duplicate events.
5. Add explicit mobile behavior and a reduced-motion fallback.
6. Validate required assets and keep immersive media off editorial startup paths.
7. Use authorized media and record provenance; never assume a license.
8. Run `npm run validate`.
9. Run `npm run build` and applicable tests/lint.
10. Do not perform unrelated refactors or expose credentials in docs/UI.
