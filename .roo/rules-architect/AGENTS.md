# Architect Mode Rules (Non-Obvious Only)

- **Monorepo scope is locked**: `packages/*` only, `pnpm-workspace.yaml` — no `apps/*`. Don't propose adding a consumer app to this repo.
- **Design system only** — no Astro/Next.js app. Storybook is the deliverable. Don't propose a separate docs site.
- **Token layering is one-way**: `primitive.json` → `semantic.json` → `component.json`. Style Dictionary merge order is explicit (not glob) because `component.json` would sort first alphabetically. Don't propose circular references or primitive bypasses.
- **Closed component APIs by design** — no `className`/`style` passthrough. If a consumer needs a new look, extend the typed variant set in this repo with a Changesets entry. Never propose downstream overrides or forks.
- **Responsiveness lives inside components** via container queries, not consumer media queries. Every component must be correct at 390/768/1280px by construction — not by documentation telling consumers to handle it.
- **Governance is enforced structurally** — lint rules, CI gates, `verify-governance` probes. Proposals for new rules must include both the enforcement mechanism AND the adversarial probe to prove it fires. A rule without a probe is aspirational and will be rejected.
- **`etc/design-system.api.md` is a committed contract** — any public API change must go through a Changesets bump and deliberate `update-api`. Proposals that bypass this are non-starters.
- **Supply chain hardening is non-negotiable**: `minimumReleaseAge`, `trustPolicy: no-downgrade`, `engineStrict`. Trust-policy exclusions are per exact version, never bare package name. `minimumReleaseAge` blocks are never excluded.
- **`motion` is peer dependency**, not bundled. Don't propose bundling animation libraries — consumers install their own.
- **`brand-assets/` is intentionally outside the workspace** — raw assets only. Don't propose integrating it into the build pipeline.
- **Visual baselines are CI-generated** (ubuntu-latest), not local. Proposals that assume local baseline generation will break in CI.
- **Background is always `--color-void` or darker** — never light backgrounds. This is a brand constraint, not a preference.
- **Asymmetric border-radius only** — top-left + bottom-right. No uniform corners. This is a brand constraint enforced by token design.
- **`@public` TSDoc is required on every export** — new components/types must include it from day one. `ae-missing-release-tag` is set to `error` in api-extractor.
- **Game-world accent colors (green/blood) are scoped** to their game-card context. Don't propose using them as general-purpose accents.
