# Team STEP Brand Assets / Design System

This repo is the home of `@teamstep/design-system` — a versioned, Storybook-documented
component + token library for the Team STEP brand — plus the raw brand assets in `brand/`.
It is consumed by other projects (e.g. the Astro landing site) as a package dependency,
not by copy-pasting files. Those consuming projects live in separate repos.

Read this file in full before adding components, editing tokens, touching CI/tooling config,
or reviewing a PR here.

## Locked scope decisions

- **Design system only.** No Astro/Next.js app lives in this repo. `packages/design-system`
  + Storybook is the whole deliverable. Do not add a consumer app "for convenience."
- **pnpm + Turborepo.** Not Yarn. `pnpm-workspace.yaml` at root, `packages/*` only (no `apps/*`).
- **Storybook is the docs site.** There is no separate docs app — don't reintroduce one.
- Source of truth for the visual language: `teamstep-landing-spec.md` and
  `teamstep-react-design-system-proposal.md` (original design decisions) — treat these as the
  spec, not this file, for actual token values/component behavior.

## Repo shape

```
brand-assets/
├── .github/
│   ├── workflows/design-system-ci.yml
│   └── CODEOWNERS
├── brand/                    raw logo assets, guidelines PDF — not part of the package
└── design-system/            pnpm + Turborepo workspace root
    ├── pnpm-workspace.yaml   supply-chain settings live here — see below
    ├── turbo.json
    └── packages/
        ├── design-system/    @teamstep/design-system
        │   ├── tsup.config.ts
        │   ├── playwright.config.ts
        │   ├── api-extractor.json
        │   ├── style-dictionary.config.mjs
        │   ├── stylelint.config.mjs
        │   ├── .storybook/
        │   ├── tokens/           DTCG JSON source of truth (primitive → semantic → component)
        │   ├── tests/             Playwright: a11y + visual regression, one story per viewport
        │   ├── etc/design-system.api.md   committed API contract — see check-api below
        │   └── src/
        │       ├── tokens/       tokens.css + tokens.ts, GENERATED — do not hand-edit
        │       ├── effects/      PixelGrid, ScanlineOverlay, VignetteOverlay
        │       └── index.ts      barrel export — this is the only public surface
        ├── eslint-config/
        └── typescript-config/
```

## How the gates work (read before touching config, not just code)

- **`pnpm run lint`** — ESLint + stylelint. Stylelint's `scale-unlimited/declaration-strict-value`
  rule bans raw hex/rgb/color literals outside generated token files — any color must be
  `var(--token)`. Currently scoped to color properties only; extend to spacing/radius once those
  token tiers exist in `tokens/primitive.json` (an unbacked rule is unenforceable, not stricter).
- **`pnpm run check-api`** — `api-extractor` diffs the built `.d.ts` against `etc/design-system.api.md`.
  Any public export/prop-shape change must be accepted deliberately via `pnpm run update-api`
  (writes the new baseline) — never hand-edit `etc/design-system.api.md`.
- **`pnpm run test-visual`** — Playwright, run against the *built* Storybook. One suite covers
  both a11y (`@axe-core/playwright`) and visual regression (`toHaveScreenshot()`) per story per
  viewport (390/768/1280px). Reads story IDs from `storybook-static/index.json` dynamically —
  new stories are covered automatically, no test-file edits needed. Baseline screenshots
  (`tests/*-snapshots/*.png`) are committed and are the visual contract; update them deliberately
  via `pnpm run test-visual:update` and review the diff like a code change, never as a reflex to
  clear a red check.
- **`pnpm audit` + `pnpm-workspace.yaml`** — supply-chain gates: `minimumReleaseAge: 1440`
  (blocks installing anything published <1 day ago), `trustPolicy: no-downgrade` (blocks a
  package whose provenance evidence weakened between versions), `engineStrict`, `overrides` for
  known CVEs. When one of these blocks a real, legitimate package (uneven provenance rollout
  across the npm ecosystem causes real false positives — see the exclusions already in
  `trustPolicyExclude` for examples), investigate before excluding: check who maintains it and
  whether the flagged version is an older/maintenance-branch release. Exclude by **exact version**,
  never by bare package name, so a different future version is still checked. Never exclude a
  `minimumReleaseAge` block — that one's doing its job; loosen your own version range instead so
  pnpm can resolve to an already-mature version.
- **CI** (`.github/workflows/design-system-ci.yml`) runs all the above via
  `turbo run lint check-types check-api build build-storybook test-visual`, plus `pnpm audit`,
  with `--frozen-lockfile` and a Corepack-pinned pnpm version. `.github/CODEOWNERS` auto-requests
  review on `/design-system/` and `/CLAUDE.md` but does not block merges by itself — branch
  protection on `main` (repo Settings → Branches, requiring the CI check + CODEOWNERS review) is
  what makes it mandatory, and is not yet enabled.

## Standing rules — apply to every change

These exist because this design system will be read and modified by coding agents (in this repo
and in consuming projects), not just humans. Prose conventions don't reliably constrain an agent —
typed contracts and failing CI do. Prioritize enforcement mechanisms over documentation whenever
they conflict.

- **Closed component APIs.** Public props are constrained unions (`variant: 'primary' | 'secondary' | 'ghost'`),
  never `className`/`style` passthrough or free-form color/spacing strings. If a prop shape would
  let a caller introduce an off-brand value, redesign the prop — don't rely on a lint rule to
  catch it after the fact.
- **Responsiveness lives inside the component**, not the consumer. Use `clamp()`/container queries
  in the component's own CSS so a new consuming project can't "forget" a breakpoint. Every
  component ships correct behavior at 390/768/1280px by construction, verified by the Storybook
  viewport presets and the Playwright visual-regression suite — not by a written note telling the
  consumer to test it themselves.
- **Token layering is one-way.** `primitive.json` → `semantic.json` → `component.json`. Never
  hand-edit the generated `tokens.css`/`tokens.ts` — edit the DTCG JSON and rerun
  `pnpm run build:tokens`. Never bypass a semantic token to patch one component's color directly
  from a primitive.
- **Token/style lint travels with the package.** When this package is published, also ship a
  companion `eslint-plugin-teamstep`/stylelint preset for consuming repos so the same rule applies
  wherever the design system is used — governance that only lives in this repo doesn't stop drift
  elsewhere.
- **Versioned, not floating, consumption.** Once published, consuming repos pin exact/minor
  versions — never `workspace:*` or `latest` outside this monorepo. Public API changes require a
  Changesets bump; the `check-api` gate exists to catch an agent "helpfully" widening a type to
  unblock itself.
- **When something seems missing, add a variant — don't fork or override.** If a consuming project
  needs a look the component doesn't support, extend the component's typed variant set in this
  repo (with a Changesets entry), not inline styles or a copy-pasted fork downstream.
- **Re-enable `ae-missing-release-tag` in `api-extractor.json` once the first real component
  ships.** It's currently silenced because requiring `@public`/`@internal` TSDoc tags on an empty
  barrel export is meaningless. `check-api` only catches *changes* to the API surface; release
  tags catch *accidental* exposure at the moment an export is first added — a stronger guardrail
  than the diff alone, and cheap once there's real API surface to tag.

## Brand rules (enforce via tokens/components, not memory)

- Background is always `--color-void` or darker. Never light backgrounds.
- Corner radius: top-left + bottom-right only (`2px 12px 2px 12px` pattern, scaled by component
  size). Never all four corners.
- Game-world accent colors (green/blood) are scoped to their respective game-card context only.
