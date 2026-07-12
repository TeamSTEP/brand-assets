# Primitive Tier Restructuring — Implementation Plan

**Status:** Ready for implementation
**Owner / sign-off:** @hoonsubin
**Governs against:** [`AGENTS.md`](../AGENTS.md) — "Component tiers and lifecycle" section (added ahead of this plan; read it before starting, it is the enforceable contract, this document is the sequenced execution of it)
**Package touched:** `packages/design-system`

## Purpose

This plan is a test of `AGENTS.md`'s new governance section as much as it is a refactor. It introduces the design system's first middle tier (`src/primitives/`), and the two things that matter most here are: (1) the primitive tier ends up correctly scoped and reusable, and (2) the process itself — promotion rule, lifecycle, escape-hatch discipline — proves it can be followed by a coding agent from written instructions alone, without live clarification. Treat any point where you had to guess at intent, rather than find the answer in `AGENTS.md` or this plan, as a defect to report back — not something to silently resolve.

## Current state (baseline, verified against the repo)

- `src/ui/Cta.tsx` — the only existing primitive-shaped component. Closed `variant: "primary" | "secondary" | "ghost"` API, token-driven, already follows the rules this plan formalizes.
- No `src/primitives/` directory exists yet.
- Card-surface CSS (`background: var(--color-surface)`, `border`, `border-radius: var(--radius-card-*)`) is independently duplicated in six places: `services/ServiceCard.css`, `quest-log/GameCardArchive.css`, `quest-log/GameCardFeatured.css` (border-top accent variant), `manifesto/DialogueBox.css`, `quest-log/PlatformAccess.css` (border-color override), and the `.ds-service-inspect-panel__sheet` rule inside `services/ServiceInspectPanel.css`.
- Three raw `<button>` elements exist outside `Cta`: the close control in `services/ServiceInspectPanel.tsx`, the play control in `quest-log/VideoFacade.tsx`, and the tab controls in `bbs/BBSTerminal.tsx`. The first two are icon-only, transparent-background, single-glyph controls — functionally the same component today, just copy-pasted. The third (`BBSTerminal`) carries `role="tab"`, `aria-selected`, and a desktop/mobile label swap — a genuinely different interaction pattern, not a IconButton candidate.
- `tokens/semantic.json` already defines `radius.card-sm/md/lg`, but their `$description` fields name specific current consumers ("archive cards, service cards" / "dialogue boxes" / "featured game card") rather than describing size intent generically.

## Target structure

```
src/
  primitives/          # new tier — brand-agnostic prop shape, closed APIs
    Cta.tsx             (relocated from src/ui/, no API change)
    Cta.css
    Cta.stories.tsx
    IconButton.tsx       (new)
    IconButton.css
    IconButton.stories.tsx
    Card.tsx              (new)
    Card.css
    Card.stories.tsx
  quest-log/ services/ manifesto/ bbs/ hero/ footer/ nav/ effects/
    # unchanged directories — feature components, now consuming primitives
  ui/                    # deleted once Cta relocation lands
```

`src/index.ts` barrel exports are unchanged in name and shape — only the import paths update (`./primitives/Cta.js` instead of `./ui/Cta.js`). This keeps the `check-api` diff to path metadata only, not a public surface change.

## Primitive API sketches (for the implementer to build against — not literal code)

### `IconButton`

- Props: an icon/glyph slot (constrained — reuse whatever icon-rendering convention `VideoFacade`/`ServiceInspectPanel` already use, don't invent a new icon system for this), a required `aria-label`, `onClick`, and a size variant if the close (×) and play (▶) controls turn out to need different touch-target sizes once compared side by side — collapse to no size prop if they match.
- No `href` variant — these are always actions, never navigation. If a future consumer needs an icon-shaped link, that's a signal to revisit, not to add `href` here speculatively.
- CSS: shared unstyled-button reset (no border, transparent background, cursor pointer, minimum 44px hit target) as its own declared block, written so `BBSTerminal`'s tab buttons can visually reference the same reset values without depending on the `IconButton` component itself.
- No escape hatch planned for v1 — two known consumers, both fully covered by the closed API above. Don't add one speculatively (per `AGENTS.md`).

### `Card`

- Props: `size: "sm" | "md" | "lg"` mapping to `--radius-card-sm/md/lg`, plus one escape hatch — an `accent` prop as a closed string-literal union (e.g. `"none" | "game-active" | "status-pending"`) resolving internally to semantic tokens, covering `GameCardFeatured`'s top-border accent and `PlatformAccess`'s border-color override. Mark it `@hatch` in TSDoc per `AGENTS.md`.
- Renders a single `div`. No `as` prop in v1 — every current consumer uses `div`. Note this explicitly as a deferred decision in the component's TSDoc so it isn't mistaken for an oversight later.
- Children are unconstrained content (this is a layout primitive, not a content-shape primitive) — the closed-API rule applies to *styling* props, not to `children`.

## Migration sequence

Each numbered item is its own PR (or its own reviewable commit if working solo) with its own Changesets entry. Do not batch multiple items into one PR — the point of sequencing is that a failure in item 3 shouldn't block or entangle item 1.

1. **Add `IconButton`.** Build per the sketch above. Migrate `ServiceInspectPanel`'s close button and `VideoFacade`'s play button onto it. Leave `BBSTerminal` untouched except for sharing reset values at the CSS level.
2. **Relocate `Cta`** from `src/ui/` to `src/primitives/`. Path-only change — update `index.ts` imports, delete `src/ui/`, no API diff expected in `etc/design-system.api.md` beyond source-location metadata if api-extractor surfaces it.
3. **Add `Card`.** Build per the sketch above, with Storybook stories covering `size` × `accent` combinations, including the `accent="none"` default.
4. **Migrate `ServiceCard`** onto `Card`.
5. **Migrate `DialogueBox`** onto `Card`.
6. **Migrate `GameCardArchive`** onto `Card`.
7. **Migrate `PlatformAccess`** onto `Card` (first real use of the `accent` hatch).
8. **Migrate `GameCardFeatured`** onto `Card` (second use of the `accent` hatch; also the first case with the two-column `@container` body layout — confirm the layout still resolves correctly once the surface styling moves into `Card` and the grid stays in the feature component).
9. **Migrate the `ServiceInspectPanel` sheet** onto `Card` (most layout-coupled — dialog positioning, transform, backdrop — do this last, after the pattern is proven five times over).
10. **Docs pass**: update `tokens/semantic.json`'s `radius.card-*` `$description` fields to describe size intent generically rather than by original consumer, now that `Card` is the actual reason those tokens exist.
11. **Extend `verify-governance`** to inject a probe violation into `Card.tsx`/`Card.css` (and `IconButton.tsx`/`IconButton.css`), matching its existing `Badge` probes, so the new primitives are proven enforceable, not just compliant by construction.

## Per-item acceptance checklist

Run for every item above before marking it done:

- [ ] `pnpm run lint` — ESLint (`no-style-passthrough` in particular) and stylelint (BEM pattern, token-only CSS) pass.
- [ ] `pnpm run check-types` passes on both tsconfigs.
- [ ] `pnpm run check-api` — diff reviewed and accepted via `pnpm run update-api` (never hand-edited).
- [ ] `pnpm run check-contrast` passes for any new/changed color combination.
- [ ] `pnpm run test-visual` — new baselines generated via `test-visual:update` and the diff images manually reviewed, not reflex-accepted.
- [ ] Storybook story added/updated for every new variant, viewable at all three viewport presets (390/768/1280).
- [ ] `@public` TSDoc present on every new exported type/function; `@hatch` marker present if the component ships an escape hatch.
- [ ] Changesets entry added (`pnpm changeset add`), scoped to what actually changed.
- [ ] `pnpm --filter @teamstep/design-system run verify-governance` passes.

## What this plan is specifically testing in `AGENTS.md`

Report back on these explicitly once the migration is done — they're the actual purpose of this exercise:

1. **Promotion rule clarity** — did "three or more" as a trigger read as unambiguous, or did any component (e.g., `BBSTerminal`'s tabs) sit in a gray zone where the rule didn't obviously resolve the call?
2. **Lifecycle sign-off friction** — did routing primitive-candidate decisions through explicit owner sign-off (vs. inferring approval) meaningfully slow work, or was it a natural checkpoint?
3. **Escape-hatch discipline** — was one hatch per primitive (`Card`'s `accent`) enough, or did migrating `GameCardFeatured`/`PlatformAccess` reveal a need the closed union didn't anticipate? If so, that's a real signal about whether "at most one hatch" is the right constraint going forward, not just for this primitive.
4. **Tier boundary** — did anything in the feature-component directories end up needing to import from another feature directory (a sign the tier boundary is leaking), or did primitives cleanly absorb all the cross-component duplication?
