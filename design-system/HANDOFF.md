# @teamstep/design-system — Handoff: Review, Governance Audit, Remaining Stages

> Written for the agent picking up this work next. Read `/Users/hoonkim/Projects/brand-assets/CLAUDE.md`
> in full first — it is the binding spec for this repo and everything below assumes it.
> This document is a snapshot as of Stage D completion (2026-07-10).
> Re-verify anything below against current repo state before trusting it — it is a record of
> what was true at write time, not a live source of truth.

---

## 1. What exists today

**Tokens** (`packages/design-system/tokens/{primitive,semantic,component}.json`): full color,
spacing, radius, and font-family tiers, primitive → semantic layered per CLAUDE.md.
`component.json` is still `{}` — nothing built so far has needed a value different from its
semantic role, so no component-tier tokens exist yet. That's a correct, not a lazy, state.

**Components** (22, all exported from the single barrel `src/index.ts`):

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
| `VideoFacade` | `src/quest-log/` | Poster/loop + click-to-load YouTube iframe |
| `ServiceInspectPanel` | `src/services/` | Modal/bottom sheet; consumer owns `open`/`onClose` |
| `NavDesktop` | `src/nav/` | Sticky desktop top bar; internal scroll frost |
| `NavHUD` | `src/nav/` | Mobile bottom HUD; `IntersectionObserver` active section |
| `BBSTerminal` | `src/bbs/` | Terminal chrome + tab bar |
| `BBSPanelAPI` | `src/bbs/` | API feed renderer (`UnifiedPost[]`) |
| `BBSPanelIframe` | `src/bbs/` | Discord widget + CSS filter |
| `SocialFeed` | `src/bbs/` | Tab switching + per-platform fetch cache |

**Hooks** (exported): `useInView`, `useTypewriter`, `useIdleFloat`

Every component: closed variant props (no `className`/`style` passthrough — verified by
grep, zero hits), asymmetric corner-radius tokens only, `@public` TSDoc tags, a Storybook
story per meaningful state, and a Playwright visual+a11y baseline per story per viewport
(390/768/1280).

**Current test surface**: 117 Playwright cases (a11y via axe + visual regression), all
green. `check-api`, `lint`, `check-types`, `build`, `build-storybook` all green. Package
version **0.1.0** (unpublished until merge + Changesets publish workflow runs).

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
| No Changesets entries for any component yet | **Resolved in Stage C** | Batched `v0.1.0` changeset at `design-system/.changeset/v0-1-0-initial-release.md` |
| Font-size has no type-scale token tier — still hardcoded px (wrapped in `clamp()`) | **Deferred, documented in `stylelint.config.mjs`'s own comment** | `declaration-strict-value` covers color/spacing/radius/shadow/gradient; font-size tier still deferred |
| `tests/` isn't in `tsconfig.json`'s `include`, so `check-types` silently skips the Playwright spec file | **Resolved in Stage C** | `tsconfig.tests.json` + dual `tsc` in `check-types`; `AxeBuilder` named import |
| Companion `eslint-plugin-teamstep`/stylelint preset for consuming repos | **Resolved in Stage D** | Published as `@teamstep/eslint-plugin` and `@teamstep/stylelint-config`; see `CONSUMER.md` |

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
| **§8.1** Hardcoded color via uncovered CSS property | **Hardened in Stage C** | `box-shadow` and `background-image` added to `declaration-strict-value` (effects CSS exempt). Hex/rgb/hsl still caught by standard notation rules on any property. |
| **§8.2** Widen `CtaVariant` (added `"danger"`) | **No brand gate** (expected) | `pnpm run lint` passes. Nothing enforces game-color scoping at the type level — still convention/review only (§3 accepted risk). `check-api` would require `update-api` for a deliberate variant addition, but does not judge brand validity. |
| **§8.3** `className` on exported prop interface | **Blocked** | D5 implemented: `teamstep/no-style-passthrough` in `@repo/eslint-config`, enabled in `eslint.config.mjs` for `src/**/*.tsx` (excludes stories). Injected `className?: string` on `CtaProps` → `pnpm run lint` exits non-zero. |
| **§8.4** Re-run §2 probes | **Still blocking** | `#ff00ff` in `Badge.css` `color` → stylelint `declaration-strict-value`, non-zero. Removed `@public` from `Badge` exports → `check-api` `ae-missing-release-tag` Error, non-zero. |
| **§8.5** Axe rule exclusions in visual tests | **Appropriately scoped** | Only `landmark-one-main`, `page-has-heading-one`, and `region` disabled — all document-structure rules false-positive in Storybook's iframe harness. Component-level rules (`color-contrast`, `button-name`, `image-alt`, etc.) remain active. No overlap found that would swallow real component violations. |
| **§8.6** Container-query `Narrow` stories | **Verified** | `GameCardArchive` Narrow vs Legacy snapshots differ at all three viewports (not identical PNGs). `ServiceCard` Narrow snapshots also committed. **Standing rule for new card components:** ship a `Narrow` story and confirm visual diff before merging. |

**D5 implementation detail:** `packages/eslint-plugin-teamstep/` (published as
`@teamstep/eslint-plugin` at Stage D). `@repo/eslint-config/teamstep-plugin` re-exports it
for monorepo dev.

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
**Complete (2026-07-10).** Cursor trail remains consumer-side (§4 D3).
- **Hooks** (`src/hooks/`): `useInView`, `useTypewriter`, `useIdleFloat`, internal `usePrefersReducedMotion`
- **`VideoFacade`**, **`ServiceInspectPanel`**, **`NavDesktop`**, **`NavHUD`**
- **`BBSTerminal`**, **`BBSPanelAPI`**, **`BBSPanelIframe`**, **`SocialFeed`** + `UnifiedPost` type
- **`DialogueBox`**: `animated?: boolean` default `true` (stories use `false` for stable Playwright baselines)
- **`Hero`**: `useIdleFloat` via `logoAnimated?: boolean` default `true` (story uses `false` for baselines)
- **`motion`** added as peer dependency; visual tests use `animations: "disabled"` + `domcontentloaded` wait

### Stage B — Remaining static shells
**Complete (2026-07-10):** `Hero` and `Footer` shipped (§4 D1).
- **`Hero`**: 80vh, `PixelGrid` background, 60/40 split, ghost CTA, logo mark slot, container-query
  mobile layout (no logo, scroll-cue swap). `useIdleFloat` on logo ring is Stage A.
- **`Footer`**: centered logo, studio name, tagline, social links with `FooterSocialPlatform` union.

Services grid layout and "GET IN TOUCH →" CTA below the cards stay consumer-side (§4 B1).

### Stage C — Cleanup before v0.1.0
**Complete (2026-07-10).**
- **`component.json` stays `{}`** — no Stage A/B component needed a value distinct from its semantic role; correct state, not a gap.
- **Stylelint hardened:** `box-shadow` and `background-image` added to `declaration-strict-value`; `src/effects/**/*.css` exempt (procedural overlays).
- **TSDoc pass:** all public exports in `etc/design-system.api.md` documented — zero `(undocumented)` entries.
- **`tsconfig.tests.json`:** Playwright spec type-checked; `AxeBuilder` named import.
- **Visual test stability:** `workers: 1` + `document.fonts.ready` wait before screenshots (parallel runs were flaky against the static http-server).
- **Accepted risks reaffirmed (§3):** `Cta.primary` scoping and `ServiceCard.icon` slot still hold — convention/review only.
- **Changeset cut:** `design-system/.changeset/v0-1-0-initial-release.md` (`minor` → `0.1.0` on publish).
- **Gates green:** `lint`, `check-types`, `check-api`, `build`, `test-visual` — 117/117.

### Stage D — Cross-repo publish
**Complete (2026-07-10).**
- **`@teamstep/design-system`** publishable to GitHub Packages (`publishConfig`, `prepublishOnly`,
  `sideEffects` for CSS, `private` removed).
- **Companion packages:** `@teamstep/eslint-plugin` (`no-style-passthrough` + `configs.recommended`),
  `@teamstep/stylelint-config` (token `declaration-strict-value` preset). `@repo/eslint-config`
  re-exports the plugin via workspace for monorepo dev.
- **Publish CI:** `.github/workflows/design-system-publish.yml` — Changesets version PR or
  `pnpm run release` (`turbo build` + `changeset publish`) on merge to `main`.
- **Consumer guide:** `design-system/CONSUMER.md` — GitHub Packages auth, `^0.1.x` pinning,
  token/CSS imports, Astro hydration table, ESLint/Stylelint setup, consumer-side layout scope.
- **Landing page repo:** not in this workspace — wire dependency per `CONSUMER.md` when the Astro
  app is scaffolded (`pnpm add @teamstep/design-system@^0.1.0`).

**To ship v0.1.0:** merge this branch, let Changesets open the version PR (or run
`pnpm run version` locally), merge that PR — publish workflow uploads all three `@teamstep/*`
packages to `npm.pkg.github.com`.

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
