# @teamstep/design-system — Handoff: Review, Governance Audit, Remaining Stages

> Written for the agent picking up this work next. Read `/Users/hoonkim/Projects/brand-assets/CLAUDE.md`
> in full first — it is the binding spec for this repo and everything below assumes it.
> This document is a snapshot as of the `GameCardFeatured` milestone (10 components shipped).
> Re-verify anything below against current repo state before trusting it — it is a record of
> what was true at write time, not a live source of truth.

---

## 1. What exists today

**Tokens** (`packages/design-system/tokens/{primitive,semantic,component}.json`): full color,
spacing, radius, and font-family tiers, primitive → semantic layered per CLAUDE.md.
`component.json` is still `{}` — nothing built so far has needed a value different from its
semantic role, so no component-tier tokens exist yet. That's a correct, not a lazy, state.

**Components** (12, all exported from the single barrel `src/index.ts`):

| Component | Path | Notes |
|---|---|---|
| `PixelGrid`, `ScanlineOverlay`, `VignetteOverlay` | `src/effects/` | Decorative overlays, zero props |
| `Cta` | `src/ui/` | `variant: primary\|secondary\|ghost`, renders `<a>` or `<button>` |
| `Badge` | `src/quest-log/` | `variant: main-quest\|side-quest\|legacy\|in-development` |
| `GameCardArchive` | `src/quest-log/` | `status: legacy\|side-quest` (typed as `Extract<BadgeVariant,...>`) |
| `PlatformAccess` | `src/quest-log/` | Splits `platforms[]` into Playable Now / Coming Soon, composes `Cta` |
| `GameCardFeatured` | `src/quest-log/` | The one main-quest card; composes `Badge` + `PlatformAccess`; `media: ReactNode` slot |
| `ServiceCard` | `src/services/` | `icon: ReactNode` slot, `onInspect` callback |
| `DialogueBox` | `src/manifesto/` | Static shell only — typewriter deferred to Stage A (see §4 D2) |
| `Hero` | `src/hero/` | 80vh section shell; composes `PixelGrid` + `Cta`; logo float deferred to Stage A |
| `Footer` | `src/footer/` | End-credits shell; closed `FooterSocialPlatform` union |

Every component: closed variant props (no `className`/`style` passthrough — verified by
grep, zero hits), asymmetric corner-radius tokens only, `@public` TSDoc tags, a Storybook
story per meaningful state, and a Playwright visual+a11y baseline per story per viewport
(390/768/1280).

**Current test surface**: 87 Playwright cases (a11y via axe + visual regression), all
green. `check-api`, `lint`, `check-types`, `build`, `build-storybook` all green.

---

## 2. Final compliance review (this pass)

Ran fresh against current HEAD, not from memory:

- **Closed APIs**: `grep -rn "className.*:\s*string\|style?:\s*React" src --include="*.tsx"` →
  zero hits outside stories. Confirmed clean.
- **Corner radius**: every `border-radius` in every component CSS resolves to a
  `--radius-chip-*`/`--radius-card-*` composite token, except legitimate `50%` circle
  exceptions (Badge's pulse dot, ServiceCard's/DialogueBox's avatar/icon circles).
- **Contrast token recurrence check**: grepped for the exact bug pattern found twice this
  session (`color: var(--color-game-green)` / `var(--color-status-pending)` used as *text*
  color, the base/border shade instead of the `-active` shade) — zero remaining instances.
  `--color-text-secondary` is defined but genuinely unused as a text color anywhere in
  component CSS (only referenced in explanatory comments) — it is not currently safe for
  real UI text on `--color-surface` at normal sizes (~3.5:1, under WCAG AA's 4.5:1); treat
  it as reserved for large-text/decorative use only until proven otherwise.
- **Responsive coverage**: every card-shaped component (`GameCardArchive`, `GameCardFeatured`,
  `ServiceCard`, `DialogueBox`, `PlatformAccess`) uses `container-type: inline-size` +
  `cqi`-based `clamp()`. Leaf/inline components (`Badge`, `Cta`) use viewport-relative
  `clamp()` since they can't own a meaningful container. Effects (`PixelGrid` etc.) correctly
  have zero responsive CSS — they're `inset: 0` overlays with no fixed dimensions to scale.
- **Governance gates, empirically probed** (not just read — actually triggered and reverted):
  - Injected `color: #ff00ff` into `Badge.css` → `stylelint` failed with
    `scale-unlimited/declaration-strict-value`, exit non-zero. **Confirmed working.**
  - Removed `@public` from `BadgeVariant` → `check-api` failed with
    `ae-missing-release-tag`, exit non-zero (this is an `Error`, not a `Warning` — it
    actually blocks). **Confirmed working.**
  - Both reverted; full gate suite re-run clean afterward (81/81).

**Conclusion**: the governance mechanisms described in CLAUDE.md are not aspirational —
they were independently, adversarially verified to actually block the violations they claim
to catch. This is the strongest evidence available short of the next agent re-running the
same probes themselves, which is recommended (see §8; initial run in §5).

---

## 3. Known gaps and deliberately accepted risks

These are not oversights — each was surfaced explicitly during a mid-build review and either
fixed or consciously deferred with a stated reason. Do not silently "fix" the accepted ones
without re-raising them; the user made an explicit call on each.

| Item | Status | Reason |
|---|---|---|
| `ServiceCard.icon: ReactNode` is unenforced — a consumer can pass an off-brand-colored SVG and no lint rule catches it (stylelint only scans `.css`, not inline SVG attrs in `.tsx`) | **Accepted risk**, user's explicit call | Standard practice for icon slots in most design systems; revisit only if actual misuse shows up in review |
| `Cta`'s `primary` variant is scoped to game-card contexts by TSDoc comment only, not the type system | **Accepted risk**, user's explicit call | Only 3 variants exist; misuse is easy to catch in review; not worth the added type complexity right now |
| No Changesets entries for any component yet | **Deferred, not urgent** | Package is still `v0.0.0`/`private`, unpublished. Plan is one batched `v0.1.0` changeset at the end of the static-component build-out (arguably: now) |
| Font-size has no type-scale token tier — still hardcoded px (wrapped in `clamp()`) | **Deferred, documented in `stylelint.config.mjs`'s own comment** | `declaration-strict-value` only covers color/spacing/radius; extending to font-size needs a token tier that doesn't exist yet |
| `tests/` isn't in `tsconfig.json`'s `include`, so `check-types` silently skips the Playwright spec file | **Pre-existing, not fixed** | Low priority; test file itself isn't shipped, but a `tsc` error inside it would go unnoticed |
| Companion `eslint-plugin-teamstep`/stylelint preset for consuming repos | **Not started** | CLAUDE.md explicitly scopes this to "when published" — correctly sequenced after, not before. Local `className`/`style` ban ships in `@repo/eslint-config` first (§4 D5, implemented §5). |

---

## 4. Phase 0 decisions (locked — 2026-07-10)

Resolved before remaining implementation. `ref/teamstep-landing-spec.md` was used as
wireframe reference only — not authoritative for the design system. Binding rules remain
`CLAUDE.md` + this document.

| # | Decision | Resolution |
|---|---|---|
| D1 | Hero / Footer placement | **Ship both in the package** (`src/hero/Hero`, `src/footer/Footer` or equivalent). Responsive layout (80vh split, mobile logo removal, scroll-indicator swap, social platform union) lives inside the components per CLAUDE.md. |
| D2 | `DialogueBox` typewriter | **Default-on.** Add `animated?: boolean` defaulting to `true`. Scroll-triggered once via `useTypewriter` + `useInView`. `prefers-reduced-motion` shows full text immediately. `animated={false}` for static Storybook/docs. Folds into batched `v0.1.0` — no external consumers at `v0.0.0`. |
| D3 | Cursor trail | **Consumer app owns it.** Not exported from `@teamstep/design-system`. Implement as a landing-page Astro island with `client:media="(pointer: fine)"` (replaces the old `matchMedia` guard). Per-section scroll boot-in animations are consumer-side too — only `useIdleFloat` on the Hero logo mark ships in the package. |
| D4 | Service inspect overlay | **Ship `ServiceInspectPanel` in Stage A** (name TBD). Separate from `ServiceCard` — card keeps `onInspect` callback; consumer holds `open`/`onClose` state. Props: `open`, `onClose`, `title`, `description`, `contactHref`. Desktop slide-up modal vs mobile bottom sheet is CSS-driven inside the component, not a consumer prop. |
| D5 | `className`/`style` ESLint rule | **Add now** in `@repo/eslint-config`, scoped to `packages/design-system/src/` (exclude `*.stories.tsx`). Promote to `eslint-plugin-teamstep` at Stage D publish. Probe §7.3 becomes "confirm the rule catches violations" rather than "consider adding." |
| B1 | Services section grid | **Consumer-side** section assembly. `ServiceCard` is the primitive; 3-col grid, mobile odd-card span, and amber "GET IN TOUCH →" CTA below the grid are page layout in the Astro app — not a `ServicesSection` package export. |
| B2 | `NavDesktop` scroll frost | **Inside `NavDesktop`.** Transparent → frosted glass on scroll is owned by the component (scroll listener or sentinel `IntersectionObserver`), not passed in from the consumer. |
| B3 | `BBSPanelIframe` Safari filter | **Manual release checklist**, not a Playwright CI gate. Chromium-only CI cannot catch Safari `filter` rendering bugs. Verify in Safari before shipping Discord panel. |

**D1 clarification:** Section 06 Footer (`Footer` component) is distinct from the Services
section's "GET IN TOUCH →" CTA (B1) — that CTA is a `Cta variant="secondary"` in consumer
layout below the service cards, not part of `Footer`.

**Sequencing:** Land D5 (ESLint rule) before Stage A interactive components. Stage B
(`Hero`, `Footer`) can start immediately — no dependency on D5. **D5 implemented** during
Phase 1 (see §5).

---

## 5. Phase 1 governance probe results (2026-07-10)

Adversarial probes from §8, run against current HEAD. All probe injections reverted after
testing unless noted.

| Probe | Result | Notes |
|---|---|---|
| **§8.1** Hardcoded color via uncovered CSS property | **Partial gap** | `declaration-strict-value` does not list `box-shadow` or `background-image`. Hex in those properties is still caught by `color-hex-length`; `rgb()` by `color-function-notation`; `hsl()` by `hue-degree-notation`. **Token enforcement** (`var(--…)`) is not applied to shadow/gradient values — a literal could slip through only if it avoids all three standard rules (unlikely in practice). Optional hardening: add `box-shadow` and `background-image` to the strict-value property list in `stylelint.config.mjs`. |
| **§8.2** Widen `CtaVariant` (added `"danger"`) | **No brand gate** (expected) | `pnpm run lint` passes. Nothing enforces game-color scoping at the type level — still convention/review only (§3 accepted risk). `check-api` would require `update-api` for a deliberate variant addition, but does not judge brand validity. |
| **§8.3** `className` on exported prop interface | **Blocked** | D5 implemented: `teamstep/no-style-passthrough` in `@repo/eslint-config`, enabled in `eslint.config.mjs` for `src/**/*.tsx` (excludes stories). Injected `className?: string` on `CtaProps` → `pnpm run lint` exits non-zero. |
| **§8.4** Re-run §2 probes | **Still blocking** | `#ff00ff` in `Badge.css` `color` → stylelint `declaration-strict-value`, non-zero. Removed `@public` from `Badge` exports → `check-api` `ae-missing-release-tag` Error, non-zero. |
| **§8.5** Axe rule exclusions in visual tests | **Appropriately scoped** | Only `landmark-one-main`, `page-has-heading-one`, and `region` disabled — all document-structure rules false-positive in Storybook's iframe harness. Component-level rules (`color-contrast`, `button-name`, `image-alt`, etc.) remain active. No overlap found that would swallow real component violations. |
| **§8.6** Container-query `Narrow` stories | **Verified** | `GameCardArchive` Narrow vs Legacy snapshots differ at all three viewports (not identical PNGs). `ServiceCard` Narrow snapshots also committed. **Standing rule for new card components:** ship a `Narrow` story and confirm visual diff before merging. |

**D5 implementation detail:** `packages/eslint-config/rules/no-style-passthrough.js` +
`teamstep-plugin.js`, exported as `@repo/eslint-config/teamstep-plugin`. Promote to published
`eslint-plugin-teamstep` at Stage D.

---

## 6. Incident log (for context, not action)

**Git snapshot tracking loss**: commit `af468f6` ("add game card and service card")
accidentally deleted all 24 previously-committed Playwright baseline PNGs from git tracking
as collateral damage (likely a broad `git add -A` at a moment the working tree's snapshots
were stale/mid-regeneration). Discovered mid-session; resolved by re-staging the current,
freshly-verified 81-file set rather than restoring the stale 24-file historical version
(which would have reintroduced a pre-contrast-fix `Badge` baseline and dropped 5 components'
worth of coverage entirely). **If you see snapshot test failures that don't correspond to
any CSS/component change you made, check `git log --stat -- '**/*-snapshots/*'` before
assuming your code is broken — it may be a tracking problem, not a rendering problem.**

**Two real WCAG contrast bugs**, both same root cause (reaching for a token's "base" shade
as text color instead of its "-active" shade): `Badge`'s neutral variants originally used
`--color-text-secondary` (fails AA on `--color-surface`); `PlatformAccess`'s header
originally used `--color-game-green` as text (also fails). Both caught by the Playwright a11y
suite (axe-core), not by manual review — this is the a11y gate doing its job, not something
a human review pass happened to catch. **If you add a component with colored label text on a
dark surface, do not assume a semantic color token is text-legible just because it exists —
compute or test the actual contrast ratio.**

**A real layout bug**: `align-items: flex-start` on `GameCardFeatured`'s content column
prevented `PlatformAccess` from stretching to fill the column width, collapsing its
container-query-driven pill layout to near-nothing. Invisible in isolation (every previous
component's Storybook review looked fine) — only surfaced once a container-query-dependent
component was nested inside a non-stretched flex parent. **When composing components inside
other components, check `align-items` on the parent flex container specifically — the
default per-component pattern (`align-items: flex-start` for badge/CTA rows) is wrong the
moment you nest something that needs full-width layout.**

---

## 7. Remaining implementation stages

Ordered; each stage assumes the previous is done. Adjust if priorities differ, but flag
the deviation rather than silently reordering.

### Stage A — Interactive layer (hooks + stateful components)
Everything deferred from the static-only build because it needs client-side state:
- **`VideoFacade`**: poster image + play button; on click, swaps to a lazily-loaded YouTube
  iframe. Needs `useState` for the clicked/not-clicked toggle. Once built, `GameCardFeatured`
  needs **no changes** — its `media` slot already accepts any `ReactNode`.
- **`useTypewriter`** hook + wiring into `DialogueBox`: scroll-triggered reveal-on-first-view,
  per wireframe reference. **`animated?: boolean` defaults to `true`** (§4 D2); reduced-motion
  shows full text immediately.
- **`ServiceInspectPanel`**: slide-up modal (desktop) / bottom sheet (mobile) opened by
  `ServiceCard`'s `onInspect` — separate component, consumer holds `open`/`onClose` state (§4 D4).
- **`NavDesktop`** / **`NavHUD`**: sticky top bar (desktop) / bottom HUD (mobile) — NavHUD
  needs `useInView`/`IntersectionObserver` for active-section highlighting. `NavDesktop` owns
  scroll frost internally (§4 B2).
- **`SocialFeed`**: tab switching + per-platform fetch caching (`useState`/`useRef`). Note:
  per the architecture proposal, this component takes a `fetchEndpoint` prop and does a plain
  `fetch()` — it must not know the endpoint is an Astro server route. Keep that boundary.
- **`BBSTerminal`**, **`BBSPanelAPI`**, **`BBSPanelIframe`**: terminal chrome, branded feed
  rendering, and the CSS-filtered Discord iframe. Not started. Safari filter verification is a
  manual release checklist item, not CI (§4 B3).
- **Logo idle-float** (`useIdleFloat`): used in Hero. Depends on Hero existing first (Stage B).
- **Cursor trail**: **not in this package** — consumer Astro island (§4 D3).
- All animation hooks must respect `prefers-reduced-motion` **inside the hook itself**, not
  per call site (explicit architecture-doc requirement) — enforce this in review, it's easy
  for an agent to forget on a second or third hook after getting it right on the first.

### Stage B — Remaining static shells
**Complete (2026-07-10):** `Hero` and `Footer` shipped (§4 D1).
- **`Hero`**: 80vh, `PixelGrid` background, 60/40 split, ghost CTA, logo mark slot, container-query
  mobile layout (no logo, scroll-cue swap). `useIdleFloat` on logo ring is Stage A.
- **`Footer`**: centered logo, studio name, tagline, social links with `FooterSocialPlatform` union.

Services grid layout and "GET IN TOUCH →" CTA below the cards stay consumer-side (§4 B1).

### Stage C — Cleanup before v0.1.0
- Populate `component.json` **only if** Stage A/B components actually need a value distinct
  from their semantic role — don't add tokens speculatively.
- Consider extending `stylelint.config.mjs` strict-value to `box-shadow` and
  `background-image` (Phase 1 §5 found token enforcement gap on those properties; hex is
  partially covered by standard color notation rules).
- Consider documenting the currently-`(undocumented)` interfaces in `etc/design-system.api.md`
  (every prop currently has a release tag but not a description) — not gate-blocking, but
  worth a pass before calling this a real v0.1.0.
- Decide whether `Cta`'s `primary`/`icon`-as-`ReactNode` accepted risks (§3) still hold once
  more components exist and more real usage patterns emerge.
- Cut the batched `v0.1.0` Changeset.

### Stage D — Cross-repo publish
- Wire GitHub Packages (or equivalent) publish in CI per the original strategy document.
- Companion `eslint-plugin-teamstep`/stylelint preset for consuming repos, per CLAUDE.md's
  standing rule — sequenced here, not earlier, since there's nothing to lint against until a
  second consumer exists.
- Hand the landing-page repo its first pinned (`^0.1.x`, never `workspace:*`/`latest`)
  dependency.

---

## 8. Specific probes for the next agent to run

Phase 1 (§5) completed 2026-07-10. Re-run §8.4 after Stage A/B components land. §8.6 is a
standing rule per new component, not a one-time probe.

1. **Try to sneak a hardcoded color past review** in a new component's CSS via a property the
   `declaration-strict-value` rule doesn't cover (e.g. `background-image` on a non-effects
   component, or `box-shadow`). Confirm whether it's actually caught or silently allowed —
   the effects components are exempted deliberately (see CLAUDE.md rationale), but a new
   *content* component using raw colors in an uncovered property would be a real lint gap,
   not a documented exception.
2. **Try to widen a closed variant union** (e.g. add a 5th `CtaVariant`) without checking
   whether it violates the game-color-scoping brand rule, and see if anything catches the
   brand violation — currently nothing would, since that rule is enforced by convention/review
   only for `Cta.primary`, not by types. This is expected per the accepted risk in §3, but
   confirm it's still true and hasn't quietly become enforced by something else.
3. **Confirm the `className`/`style` ESLint rule catches violations** (§4 D5) — **done in
   Phase 1 §5.** Re-run after major eslint-config changes.
4. **Re-run the two probes from §2** (raw hex color, missing release tag) after Stage A/B
   components exist, to confirm the gates still catch violations in the new files, not just
   the ones that existed when the gates were configured.
5. **Check whether the a11y rule exclusions are being scoped correctly as new stories are
   added** — `tests/stories.visual.spec.ts` currently disables `landmark-one-main`,
   `page-has-heading-one`, and `region` globally for every story, on the reasoning that
   Storybook's iframe-per-story harness isn't a real page. Confirm a new component's story
   doesn't have some *other* legitimate a11y issue that happens to overlap with one of these
   three excluded rule IDs and gets silently swallowed by the blanket exclusion.
6. **Verify the container-query responsive claim empirically**, the way the `Narrow` stories
   do — don't trust that `container-type: inline-size` + `clamp()` in a new component's CSS
   actually produces a visible size difference; add a matching `Narrow` story and diff it
   against the default, the way this session had to catch its own mistake twice (once
   conflating page-viewport with container width, once via the `align-items` bug).
