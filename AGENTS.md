# AGENTS.md

Single governance doc for this repo. `CLAUDE.md` stubs here — don't add content there.

Enforcement beats prose: typed contracts, CI gates, and `verify-governance` probes. If this file disagrees with a gate, fix this file.

## Scope

- **Design system only** — Storybook is the deliverable. No consumer apps here. Apps install `@teamstep/design-system` as a versioned package.
- **pnpm + Turborepo** — `packages/*` only (no `apps/*`). Corepack-pinned pnpm in root `package.json`.
- **`brand-assets/`** (raw logos/guide) is outside the workspace.
- Visual language source of truth: Team STEP landing wireframe/spec in the consuming site repo (`teamstep.io/plans/`).

## Stack

| Piece | Detail |
|---|---|
| Workspace | pnpm 11 + Turborepo, ESM (`"type": "module"`), `.js` extensions on relative imports |
| UI | React 19 + Storybook 10 (Vite) in `packages/design-system/` |
| Publish | `@teamstep` → GitHub Packages (`npm.pkg.github.com`) |
| Motion | `motion` is a **peer** — consumers install it |

## Commands (repo root)

| Command | Purpose |
|---|---|
| `pnpm install --frozen-lockfile` | CI install |
| `pnpm run lint` | ESLint + stylelint |
| `pnpm run check-types` | `tsc` + tests tsconfig |
| `pnpm run check-api` | api-extractor vs `etc/design-system.api.md` — accept via `update-api`, never hand-edit |
| `pnpm run check-contrast` | Token WCAG ratios (catches gradient/overlay misses) |
| `pnpm run test-visual` | Playwright vs **built** Storybook |
| `pnpm run test-visual:update` | Local regen only for debugging — **ship baselines via CI** (see Testing) |
| `pnpm run storybook` | Dev `:6006` |
| `pnpm --filter @teamstep/design-system run verify-governance` | Inject violation → assert gate fires |

Single Playwright case: `cd packages/design-system && pnpm run build-storybook && pnpm exec playwright test --grep "Badge"`.

## Code style

Self-documenting code; comments only when code cannot express the intent.

### Imports
- Relative imports use explicit `.js` extensions (including stories).

### Components
- **Closed APIs** — no `className`/`style`/free-form color/spacing. Variants are string-literal unions (`no-style-passthrough`).
- New look → typed variant + Changeset in this repo. Never consumer fork or inline override.
- **`@public` TSDoc** on every export (`ae-missing-release-tag`).
- **Responsive inside the component** — container queries; correct at 390/768/1280 by construction.
- **BEM**: `^ds-[a-z0-9]+(__…)?(--…)?$`.

### CSS / tokens
- No raw color/spacing/radius literals in component CSS (except `src/effects/**`). See `@teamstep/stylelint-config`.
- Layering one-way: `tokens/primitive.json` → `semantic.json` → `component.json`. Edit JSON + `build:tokens`; never hand-edit generated `src/tokens/*`.
- Asymmetric radius only (TL + BR). Use `--radius-card-*` / `--radius-chip-*`.

## Brand (via tokens)

- Background: `--color-void` or darker — never light.
- Game accents (green/blood) only inside their game-card/stage scope.
- Portfolio/UI chrome uses teal (`--color-chrome-accent*`), not game greens.

## Architecture

- `src/tokens/` is **generated** from DTCG JSON (Style Dictionary merge order is explicit, not glob).
- `etc/design-system.api.md` is the public contract — `update-api` only.
- `verify-governance` mutates real files (e.g. Badge) to prove gates; pattern drift must update the script.
- Storybook a11y addon `test: "off"` — Playwright AxeBuilder is the a11y gate.
- Consumers pin `@teamstep/design-system` by version (`^x.y`), never `workspace:*` / `latest` outside this monorepo.
- `eslint-plugin-teamstep` + `@teamstep/stylelint-config` ship with the system for consumers.

## Tiers & lifecycle

**Order:** tokens → primitives (`Cta`, `Card`, `IconButton`) → feature (`boot/`, `quest-log/`, `bbs/`, `services/`, …).

- Promote to primitive after the same pattern appears in **≥3** feature components.
- Primitive sign-off: **@hoonsubin** (agents flag; don't invent primitives quietly).
- Lifecycle: propose → review → build (closed API) → Storybook all variants → Changeset + `update-api` + visual CI update → deprecate with `@deprecated` + replacement (never silent delete).
- Escape hatch: **at most one** `@hatch` closed union per primitive (registered in `tsdoc.json`). Name by the dimension that varies (e.g. border geometry), not just color.

Feature folders for the landing: `boot/`, `quest-log/` (incl. FeaturedStage), `bbs/`, `services/` (incl. PortfolioCard), `manifesto/`, `nav/`, `footer/`. Prefer evolving these over consumer workarounds.

## CI / review

- `design-system-ci.yml` — per-gate steps (lint, contrast, types, api, build, Storybook, visual); PR also `changeset status` + `verify-governance`.
- Any tracked-package diff needs a changeset (or empty changeset if no bump).
- `design-system-publish.yml` on `main` — Changesets publish + Storybook Pages (Pages source = GitHub Actions, one-time).
- Supply chain: `minimumReleaseAge: 1440`, `trustPolicy: no-downgrade`, `engineStrict`.

## Testing

- **Visual baselines:** regenerate only via  
  `gh workflow run design-system-ci.yml --ref <branch> -f update-snapshots=true`  
  Never local / `act` (font stack drift). Pull after the job commits. Review PNG diffs before merge.
- `maxDiffPixelRatio: 0.02` is for same-runner hinting — not cross-environment mismatch.
- Fail axe `incomplete` as well as `violations`; `check-contrast` is the token-level second gate. Allowlist entries need a written reason.
- Mask third-party iframes (Discord) from visual + axe.
