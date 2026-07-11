# AGENTS.md

This is the single governance document for this repo — the one file to read in
full before adding components, editing tokens, touching CI/tooling config, or
reviewing a PR here. `CLAUDE.md` is a stub that points here; don't add content
there.

Governance in this repo is enforced structurally — typed contracts, CI gates,
and adversarial probes (`verify-governance`) that inject a real violation and
assert the gate catches it — not by prose convention, because this repo is read
and modified by coding agents as much as humans. If this file and the actual
enforcement mechanism ever disagree, the mechanism wins; treat the disagreement
as a bug in this file and fix the file.

## Scope (locked)

- **Design system only.** No Astro/Next.js app lives here — Storybook is the
  whole deliverable. Consuming apps (e.g. the Astro landing site) are separate
  repos that install `@teamstep/design-system` as a versioned package
  dependency, never by copy-pasting files. Don't add a consumer app or a
  separate docs site "for convenience."
- **pnpm + Turborepo, not Yarn.** `pnpm-workspace.yaml` at repo root,
  `packages/*` only — no `apps/*`.
- **`brand-assets/`** (raw logo files, brand guide)
  is a sibling directory, not part of the pnpm workspace.
- Source of truth for the visual language itself (not enforcement mechanics):
  `teamstep-landing-spec.md` and `teamstep-react-design-system-proposal.md`
  (original design decisions).

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
| `pnpm run check-api` | api-extractor diffs `.d.ts` against committed [`etc/design-system.api.md`](packages/design-system/etc/design-system.api.md:1); accept changes via `pnpm run update-api`, never hand-edit |
| `pnpm run check-contrast` | DOM-independent WCAG ratio check (catches what axe misses behind gradients/overlays) — see Testing gotchas |
| `pnpm run test-visual` | Playwright against **built** Storybook (not dev server). Stories auto-discovered from `storybook-static/index.json` |
| `pnpm run test-visual:update` | Regenerate visual baselines. Review diffs like code changes — never a reflex. |
| `pnpm run storybook` | Dev server at `:6006`. Builds tokens first. |
| `pnpm --filter @teamstep/design-system run verify-governance` | Adversarial probe: injects a real violation into a real component file, asserts the gate catches it, restores the file |

### Running a single Playwright test

```bash
cd packages/design-system && pnpm run build-storybook && pnpm exec playwright test --grep "Badge"
```

## Code style (non-obvious only)

### Imports
- ESM with **explicit `.js` extensions** on relative imports, even for `.tsx` files: [`import { Hero } from "./Hero.js"`](packages/design-system/src/index.ts:33).
- Story files use `.js` extension for their own component import: [`import { Hero } from "./Hero.js"`](packages/design-system/src/hero/Hero.stories.tsx:2).

### Components
- **Closed APIs** — no `className`/`style` on exported prop types, no free-form color/spacing strings; variants are constrained string-literal unions. Enforced by [`packages/eslint-plugin-teamstep/rules/no-style-passthrough.js`](packages/eslint-plugin-teamstep/rules/no-style-passthrough.js:1), which traces through `extends`/`&` but intentionally skips aliases, unions, and generic instantiations. If a prop shape would let a caller introduce an off-brand value, redesign the prop — don't rely on the lint rule to catch it after the fact.
- **Need a look a component doesn't support? Add a typed variant, don't fork.** Extend the component's variant set in this repo with a Changesets entry — never inline styles or a downstream copy-pasted override.
- **`@public` TSDoc required** on every exported type/function — enforced by `ae-missing-release-tag` (`error`) in [`api-extractor.json`](packages/design-system/api-extractor.json:22). Add the tag in the same commit that adds the export; stripping or omitting it fails CI via the `verify-governance` probe.
- **Responsiveness lives inside the component**, not the consumer — container queries (`container-type: inline-size` + `@container`), not media queries, not a written note telling a consumer to test it. Every component ships correct behavior at 390/768/1280px by construction, verified by Storybook viewport presets and the Playwright visual-regression suite.
- **BEM naming**: all classes must match `^ds-[a-z0-9]+…(__…)?(--…)?$` — enforced by stylelint in [`stylelint.config.mjs`](packages/design-system/stylelint.config.mjs:8).

### CSS / Tokens
- **No raw literals in component CSS** (except `src/effects/**`) for any property with a token tier — color, spacing, and radius today. Enforced by `scale-unlimited/declaration-strict-value` in [`@teamstep/stylelint-config`](packages/stylelint-config-teamstep/index.mjs:1) — check that file's rule list for the current property scope, since it's extended independently of this doc as new token tiers ship. An unbacked rule is unenforceable, not stricter: adding a new primitive/semantic tier (e.g. shadow, typography scale) means extending that rule's property list in the same commit.
- **Token layering is one-way**: `tokens/primitive.json` → `semantic.json` → `component.json`. Edit DTCG JSON, run `build:tokens` — never hand-edit generated `src/tokens/tokens.css` or `tokens.ts`, and never bypass a semantic token to patch one component's color directly from a primitive.
- **Asymmetric border-radius only** — top-left + bottom-right, scaled by component size. Never uniform corners. Use semantic radius tokens like `--radius-card-sm`, `--radius-chip-md`.

## Brand rules (enforced via tokens/components, not memory)

- Background is always `--color-void` or darker. Never a light background.
- Corner radius: top-left + bottom-right only (`2px 12px 2px 12px` pattern, scaled by size). Never all four corners.
- Game-world accent colors (green/blood) are scoped to their respective game-card context only — never used as general-purpose accents.

## Architecture (non-obvious)

- **`packages/design-system/src/tokens/` is GENERATED.** Source of truth is `tokens/*.json` (DTCG). Style Dictionary merges in explicit order — not glob — because `component.json` would sort first alphabetically and break the merge.
- **`etc/design-system.api.md` is a committed contract.** Updated via `pnpm run update-api`, never hand-edited.
- **`verify-governance` injects real violations** into real component files (`Badge.css`, `Badge.tsx`) to prove enforcement gates still fire. If those files' patterns change, the script fails loudly rather than silently no-opping.
- **Storybook a11y addon is `test: "off"`** — Playwright's AxeBuilder is the real gate. Having both causes "Axe is already running" race conditions.
- **`motion` (Framer Motion fork) is a peer dependency** — not bundled. Consumers must install it.
- **Versioned, not floating, consumption.** Once published, consuming repos pin exact/minor versions — never `workspace:*` or `latest` outside this monorepo. Public API changes require a Changesets bump.
- **Token/style lint travels with the package.** `eslint-plugin-teamstep`/`@teamstep/stylelint-config` ship alongside the design system so the same rules apply in consuming repos, not just here.

## Component tiers and lifecycle

- **Three tiers, dependency order: tokens → primitives → feature components.** Primitives (`src/primitives/`: `Cta`, `IconButton`, `Card`) are brand-agnostic in prop shape and have no knowledge of any specific feature context, even though they resolve this package's own tokens. Feature components (`quest-log/`, `services/`, `manifesto/`, `bbs/`, `hero/`, `footer/`, `nav/`) compose primitives and own domain-specific content/layout. Primitives are what would carry over to a future project-specific design system as a governance/scaffold pattern — feature components are not designed for cross-project reuse; don't generalize one into a primitive "for future flexibility" without a duplication trigger (below).
- **Promotion rule**: a style ruleset or interaction pattern duplicated across three or more feature components is a primitive candidate and must not ship as a fourth copy-paste — propose a new file under `src/primitives/` instead.
- **Lifecycle**: propose (name the duplication or need) → review (sign-off owned by @hoonsubin — no committee; agents should flag primitive-candidate work for explicit sign-off rather than proceeding on inference) → build (closed API, BEM, token-only CSS, `@public` TSDoc, container-query responsiveness — same rules as any component here) → document (Storybook story covering every variant, including any escape hatch) → release (Changesets entry, `update-api`, `test-visual:update` reviewed not reflex-accepted, extend `verify-governance` to probe the new file) → deprecate (`@deprecated` TSDoc tag + replacement noted, removed in a subsequent version — never deleted silently).
- **Escape hatches**: a primitive may expose *at most one* explicit override point instead of being fully closed — a closed string-literal-union prop resolving to specific semantic tokens internally (same pattern as `Cta`'s `variant`), never `className`/`style`/free-form values. Mark it in TSDoc with `@hatch` so every hatch in the package is grep-able — `@hatch` is a custom tag, already registered in [`tsdoc.json`](packages/design-system/tsdoc.json:1); if a future primitive needs a second custom tag, register it there in the same commit or `check-api`/api-extractor's TSDoc parser will reject it. Name hatch values for whatever dimension actually varies between consumers, not just color — `Card`'s `accent` union is `game-border` / `game-top`, not `game-green`/`status-pending`, because the real difference between `PlatformAccess` and `GameCardFeatured` is border *geometry* (side border vs. top-only accent), not just which token it points to; a color-only name would have been wrong the moment two consumers needed different shapes. A hatch value used disproportionately often is a signal to add a real variant, not to widen the hatch. Ship no hatch at all unless there's a genuine override need — don't add one speculatively.
- **Primitives composing primitives via feature nesting**: a feature component may render another feature component that itself renders a primitive (e.g. `GameCardFeatured` renders `PlatformAccess`, which wraps its own `Card`) — this is feature-level composition, not a tier violation, and results in a primitive nested inside a primitive at runtime. That's acceptable today (predates the primitive tier and hasn't caused a visual or governance problem), but isn't yet a reasoned position — if nested `Card`s ever produce a visual issue (double borders, compounding padding), decide then whether to special-case it, and update this entry with the resolution rather than leaving it implicit.

## CI/CD and review gates

- **`design-system-ci.yml`** runs lint, check-contrast, test, check-types, check-api, build, build-storybook, and test-visual as separate `continue-on-error` steps — deliberately not one combined `turbo run ...` invocation — so a PR summary can report per-gate pass/fail from native step outcomes; a final step fails the job if any step failed. On PRs it also runs `changeset status --since` and `verify-governance`.
- **`changeset status` fails on *any* diff inside a changeset-tracked package** (`@teamstep/design-system`, `@teamstep/eslint-plugin`, `@teamstep/stylelint-config` — see `.changeset/config.json`'s `ignore` list for what's excluded), not just public-API changes — it can't tell a comment/test/tooling-only edit from a real one, and this repo doesn't try to make it smarter than upstream Changesets. If your PR touches files under one of those `packages/*` dirs but doesn't need a version bump, run `pnpm changeset add --empty` (or hand-write a `.changeset/*.md` with empty `---\n---` frontmatter) rather than treating the failure as a bug to route around — this is the standard Changesets workflow, and `changeset status` only requires *some* changeset to exist, not one per changed package.
- **`design-system-publish.yml`** runs on push to `main`: a `release` job hands versioning/publish to `changesets/action`, and independent `pages-build`/`pages-deploy` jobs rebuild and redeploy Storybook to GitHub Pages (no dependency between them — a Pages redeploy shouldn't block on whether there was a changeset to publish). Pages deploy requires the repo's Settings → Pages source to be set to "GitHub Actions" — a one-time manual step the workflow can't set for itself.
- **`.github/CODEOWNERS`** auto-requests review on `/packages/`, workspace-root config files, and `/AGENTS.md`, but doesn't block merges by itself — branch protection on `main` (requiring the CI check + CODEOWNERS review) is what would make it mandatory, and is not yet enabled.
- **Supply chain**: `pnpm-workspace.yaml` sets `minimumReleaseAge: 1440`, `trustPolicy: no-downgrade`, `engineStrict`. `trustPolicyExclude` entries are per exact version, never bare package name — a `minimumReleaseAge` block is never excluded, loosen your own version range instead. `pnpm audit` runs in CI with `continue-on-error: true`; results are aggregated and evaluated at the end, not fail-fast.

## Testing gotchas

- Visual baselines are **OS/font-rendering sensitive**. Regenerate on CI via `workflow_dispatch` (see [`design-system-ci.yml`](.github/workflows/design-system-ci.yml:9)), download the `visual-snapshots` artifact.
- `maxDiffPixelRatio: 0.02` absorbs font-hinting drift (∼1%) on genuine unchanged stories without hiding real regressions.
- axe reports `color-contrast` as `incomplete` (not `violations`) for text behind CSS gradients/overlays — treating `incomplete` as passing previously let two components (Hero, Footer) ship at sub-AA contrast undetected. The Playwright suite now fails on `incomplete` too; `pnpm run check-contrast` is a second, DOM-independent gate for the same bug class, computing WCAG ratios directly from resolved token hex values. Both text and background tokens are auto-discovered, not hand-maintained — a genuine large-text exception goes in that script's `ALLOWLIST` with a written reason, never a global threshold change.
- Third-party iframe content (Discord widget in BBSPanelIframe) is masked from visual comparison and excluded from axe scans.
