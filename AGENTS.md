# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack

- **pnpm 11 + Turborepo** — [`pnpm-workspace.yaml`](pnpm-workspace.yaml:1) at repo root, `packages/*` only. Corepack-pinned version in [`package.json`](package.json:4).
- **React 19 + Storybook 10 (Vite)** — component docs/deliverable in [`packages/design-system/`](packages/design-system/package.json:2).
- **ESM** (`"type": "module"`) — all packages. tsup build with `.js` extension in relative imports.
- **GitHub Packages** — `@teamstep` scope publishes to `npm.pkg.github.com` ([`.npmrc`](.npmrc:2)).

## Commands (all from repo root)

| Command | Notes |
|---|---|
| `pnpm install --frozen-lockfile` | Required in CI; `pnpm-workspace.yaml` enforces `minimumReleaseAge: 1440` + `trustPolicy: no-downgrade` |
| `pnpm run lint` | ESLint + stylelint via turbo |
| `pnpm run check-types` | `tsc --noEmit` on both `tsconfig.json` and [`tsconfig.tests.json`](packages/design-system/tsconfig.tests.json:1) |
| `pnpm run check-api` | api-extractor diffs `.d.ts` against committed [`etc/design-system.api.md`](packages/design-system/etc/design-system.api.md:1) |
| `pnpm run check-contrast` | DOM-independent WCAG ratio check (catches what axe misses behind gradients/overlays) |
| `pnpm run test-visual` | Playwright against **built** Storybook (not dev server). Stories auto-discovered from `storybook-static/index.json` |
| `pnpm run test-visual:update` | Regenerate visual baselines. Review diffs like code changes — never a reflex. |
| `pnpm run storybook` | Dev server at `:6006`. Builds tokens first. |

### Running a single Playwright test

```bash
cd packages/design-system && pnpm run build-storybook && pnpm exec playwright test --grep "Badge"
```

## Code style (non-obvious only)

### Imports
- ESM with **explicit `.js` extensions** on relative imports, even for `.tsx` files: [`import { Hero } from "./Hero.js"`](packages/design-system/src/index.ts:33).
- Story files use `.js` extension for their own component import: [`import { Hero } from "./Hero.js"`](packages/design-system/src/hero/Hero.stories.tsx:2).

### Components
- **Closed APIs** — no `className`/`style` on exported prop types. Enforced by [`packages/eslint-plugin-teamstep/rules/no-style-passthrough.js`](packages/eslint-plugin-teamstep/rules/no-style-passthrough.js:1). The rule traces through `extends`/`&` but intentionally skips aliases, unions, and generic instantiations.
- **`@public` TSDoc required** on every exported type/function — enforced by `ae-missing-release-tag` in [`api-extractor.json`](packages/design-system/api-extractor.json:22). Stripping it fails CI (`verify-governance` probe).
- **Responsiveness via container queries** (`container-type: inline-size` + `@container`), not media queries. Components ship correct behavior at 390/768/1280px by construction.
- **BEM naming**: all classes must match `^ds-[a-z0-9]+…(__…)?(--…)?$` — enforced by stylelint in [`stylelint.config.mjs`](packages/design-system/stylelint.config.mjs:8).

### CSS / Tokens
- **No raw hex/rgb in component CSS** (except `src/effects/**`). Every color must be `var(--color-*)`. Enforced by `scale-unlimited/declaration-strict-value`.
- **Token layering is one-way**: `tokens/primitive.json` → `semantic.json` → `component.json`. Edit DTCG JSON, run `build:tokens` — never hand-edit generated `src/tokens/tokens.css` or `tokens.ts`.
- **Asymmetric border-radius only** — no uniform corners. Use semantic radius tokens like `--radius-card-sm`, `--radius-chip-md`.

## Architecture (non-obvious)

- **`packages/design-system/src/tokens/` is GENERATED.** Source of truth is `tokens/*.json` (DTCG). Style Dictionary merges in explicit order — not glob — because `component.json` would sort first alphabetically and break the merge.
- **`etc/design-system.api.md` is a committed contract.** Updated via `pnpm run update-api`, never hand-edited.
- **`verify-governance` injects real violations** into real component files (`Badge.css`, `Badge.tsx`) to prove enforcement gates still fire. If those files' patterns change, the script fails loudly rather than silently no-opping.
- **Storybook a11y addon is `test: "off"`** — Playwright's AxeBuilder is the real gate. Having both causes "Axe is already running" race conditions.
- **`brand-assets/` is not part of the pnpm workspace** — raw logo files and guidelines PDF only.
- **`motion` (Framer Motion fork) is a peer dependency** — not bundled. Consumers must install it.

## Testing gotchas

- Visual baselines are **OS/font-rendering sensitive**. Regenerate on CI via `workflow_dispatch` (see [`design-system-ci.yml`](.github/workflows/design-system-ci.yml:9)), download the `visual-snapshots` artifact.
- `maxDiffPixelRatio: 0.02` absorbs font-hinting drift (∼1%) on genuine unchanged stories without hiding real regressions.
- axe reports `color-contrast` as `incomplete` (not `violations`) for text behind CSS gradients/overlays. The test filters these structurally by `messageKey: "bgGradient"` — the DOM-independent `check-contrast` script is the real gate for those cases.
- Third-party iframe content (Discord widget in BBSPanelIframe) is masked from visual comparison and excluded from axe scans.

## Supply chain

- `pnpm-workspace.yaml` [`trustPolicyExclude`](pnpm-workspace.yaml:17) entries are per exact version, never bare package name. `minimumReleaseAge` blocks are never excluded — loosen version ranges instead.
- `pnpm audit` runs in CI with `continue-on-error: true` — gate results are aggregated and evaluated at the end, not fail-fast.
