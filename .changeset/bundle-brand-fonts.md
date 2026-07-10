---
"@teamstep/design-system": patch
---

Self-host the brand fonts (Rajdhani, Nunito, Barlow Condensed) via `@fontsource` instead of
only referencing their names in `tokens.css`. Previously nothing ever loaded these fonts, so
every consumer silently fell back to whatever generic sans-serif the host OS/browser happened
to substitute — invisible in casual review, but non-deterministic across environments, which is
what was breaking the Playwright visual-regression baselines in CI. Text-bearing components now
render with the actual brand typeface everywhere, including in this repo's own Storybook/tests.
