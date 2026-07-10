# @teamstep/design-system

## 0.2.0

### Minor Changes

- c86ec05: Initial publishable release: 22 components (effects, quest-log, services, manifesto, hero,
  footer, nav, bbs, ui), full primitive/semantic token tiers, closed-API governance (stylelint
  `declaration-strict-value`, `teamstep/no-style-passthrough`, `check-api` release tagging), and
  the companion `@teamstep/eslint-plugin` / `@teamstep/stylelint-config` packages for consuming
  repos.

### Patch Changes

- c86ec05: Self-host the brand fonts (Rajdhani, Nunito, Barlow Condensed) via `@fontsource` instead of
  only referencing their names in `tokens.css`. Previously nothing ever loaded these fonts, so
  every consumer silently fell back to whatever generic sans-serif the host OS/browser happened
  to substitute — invisible in casual review, but non-deterministic across environments, which is
  what was breaking the Playwright visual-regression baselines in CI. Text-bearing components now
  render with the actual brand typeface everywhere, including in this repo's own Storybook/tests.

## 0.1.0

### Minor Changes

- 3808d73: Initial public release: design system package plus companion ESLint and Stylelint presets for consuming repos.
