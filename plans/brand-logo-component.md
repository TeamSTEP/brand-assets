# Brand Logo Component — Implementation Plan

## Overview

Add three new components — `BrandLogo`, `BrandIcon`, `BrandTitle` — to the design system, driven by a shared `LogoVariant` type. All SVGs are inlined as JSX (per user directive). No `className`/`style` passthrough (closed API by design system governance).

**Governance note**: `AGENTS.md` at the repo root is the single, actively-maintained governance document for this repo and takes precedence over anything below if the two disagree. This plan follows its tier model, lifecycle, and CI gates as of 2026-07-12 (post primitive-tier restructuring / PR #6). Variant keys and component types below are locked; everything else in this plan should be read as "how to satisfy `AGENTS.md`'s current rules for this specific addition," not as an independent process.

**Tier placement**: `BrandLogo`/`BrandIcon`/`BrandTitle` are **feature-tier** components (`src/logo/`, alongside `hero/`, `footer/`, `nav/`, `quest-log/`) — not primitives. Primitives (`src/primitives/`) must be brand-agnostic in prop shape; these components are the opposite by construction (hardcoded Team STEP SVGs per variant), so they structurally fail the primitive test regardless of how simple their prop surface (`variant` only) looks. No primitive-candidate lifecycle (propose → review → @hoonsubin sign-off) applies here — that lifecycle is only triggered by the three-or-more-duplication promotion rule, and this is a first, single instance of the "SVG-variant-keyed component" pattern.

## SVG Source

20 SVG files in [`brand-assets/svg/`](brand-assets/svg) provide the visual assets. They follow the naming pattern `TeamSTEP_{Style}_{Scope}_{Publication?}.svg`.

See [SVG Variant Analysis](#svg-variant-analysis) for the full breakdown.

---

## Variant Keys

Five variant keys describe the circle treatment and color palette — **what you actually see**:

| Key | Circle Treatment | Colors |
|---|---|---|
| `"brand-filled"` _(default)_ | Filled (#231630) + stroke (3px #231530) | Multicolor brand gradient (#8591c9 → #4e466d → #2c2c54), #7274a2 wordmark |
| `"brand-hollow"` | Transparent (`fill: none`) | Same multicolor brand gradient |
| `"dark"` | Monochrome dark | #231f20, #050606 |
| `"void"` | Solid silhouette | #231630 |
| `"light"` | All white | #fff |

### Type Definition

```typescript
/**
 * Logo visual treatment.
 *
 * "brand-filled" — filled circle with stroked border, multicolor brand gradient
 * "brand-hollow" — transparent circle, multicolor brand gradient
 * "dark"         — monochrome dark for light backgrounds
 * "void"         — solid void silhouette
 * "light"        — all-white for dark backgrounds
 *
 * @public
 */
export type LogoVariant = "brand-filled" | "brand-hollow" | "dark" | "void" | "light";
```

`LogoVariant` is exported once from [`BrandLogo.tsx`](packages/design-system/src/logo/BrandLogo.tsx) and re-used by all three components.

---

## Three Components

| Component | viewBox | Purpose | Variants Available | Fallback |
|---|---|---|---|---|
| **`BrandIcon`** | 208×208 | Team STEP circle icon only | all 5 | — |
| **`BrandTitle`** | ~192×188 | "Team STEP" wordmark only | 4 (`brand-hollow` falls back) | `"brand-hollow"` → `"brand-filled"` + `console.warn` |
| **`BrandLogo`** | 392×208 | Combined mark + wordmark (full brand lockup) | all 5 | — |

### Props

```typescript
/** @public */
export interface BrandIconProps {
  /** Visual treatment. Defaults to `"brand-filled"`. */
  variant?: LogoVariant;
}

/** @public */
export interface BrandTitleProps {
  /** Visual treatment. Defaults to `"brand-filled"`. */
  variant?: LogoVariant;
}

/** @public */
export interface BrandLogoProps {
  /** Visual treatment. Defaults to `"brand-filled"`. */
  variant?: LogoVariant;
}
```

Each component has a single optional `variant` prop defaulting to `"brand-filled"`. No `className`, no `style`, no `publication` boolean — the variant key alone is sufficient.

**Not a hatch**: `BrandTitle`'s `"brand-hollow"` → `"brand-filled"` fallback (below) is default-value coercion for a variant with no corresponding SVG, not an escape hatch in `AGENTS.md`'s sense. It doesn't need a `@hatch` TSDoc tag or a `tsdoc.json` registration — `@hatch` is reserved for a primitive's single governed override point (e.g. `Cta`'s `variant`), and these components aren't primitives.

---

## SVG Selection Logic

### `BrandIcon` — `src/logo/BrandIcon.tsx`

| Variant | Canonical SVG |
|---|---|
| `"brand-filled"` | [`TeamSTEP_Logo_Only_Publication.svg`](brand-assets/svg/TeamSTEP_Logo_Only_Publication.svg) |
| `"brand-hollow"` | [`TeamSTEP_Hollow_Logo_Only_Publication.svg`](brand-assets/svg/TeamSTEP_Hollow_Logo_Only_Publication.svg) |
| `"dark"` | [`TeamSTEP_Positive_Black_Logo_Only.svg`](brand-assets/svg/TeamSTEP_Positive_Black_Logo_Only.svg) |
| `"void"` | [`TeamSTEP_Positive_Block_Logo_Only.svg`](brand-assets/svg/TeamSTEP_Positive_Block_Logo_Only.svg) |
| `"light"` | [`TeamSTEP_Positive_White_Logo_Only.svg`](brand-assets/svg/TeamSTEP_Positive_White_Logo_Only.svg) |

Canonical selection notes:
- `TeamSTEP_Hollow_Logo_Only_Publication.svg` is chosen over `TeamSTEP_Hollow_Logo_Only.svg` — it has richer icon paths (additional #50486e fill class)
- `TeamSTEP_Logo_Only_Publication.svg` is the only SVG with the stroked+filled circle treatment for icon scope
- `TeamSTEP_Locked_Logo_Only.svg` (filled circle, no stroke) has no corresponding variant key — it's intentionally excluded

### `BrandTitle` — `src/logo/BrandTitle.tsx`

| Variant | Canonical SVG |
|---|---|
| `"brand-filled"` | [`TeamSTEP_Locked_Title_Only_Publication.svg`](brand-assets/svg/TeamSTEP_Locked_Title_Only_Publication.svg) |
| `"dark"` | [`TeamSTEP_Positive_Black_Title_Only.svg`](brand-assets/svg/TeamSTEP_Positive_Black_Title_Only.svg) |
| `"void"` | [`TeamSTEP_Positive_Block_Title_Only.svg`](brand-assets/svg/TeamSTEP_Positive_Block_Title_Only.svg) |
| `"light"` | [`TeamSTEP_Positive_White_Title_Only.svg`](brand-assets/svg/TeamSTEP_Positive_White_Title_Only.svg) |
| `"brand-hollow"` | **Fallback** → `"brand-filled"` |

### `BrandLogo` — `src/logo/BrandLogo.tsx`

| Variant | Canonical SVG |
|---|---|
| `"brand-filled"` | [`TeamSTEP_Locked_Publication.svg`](brand-assets/svg/TeamSTEP_Locked_Publication.svg) |
| `"brand-hollow"` | [`TeamSTEP_Hollow_Publication.svg`](brand-assets/svg/TeamSTEP_Hollow_Publication.svg) |
| `"dark"` | [`TeamSTEP_Positive_Black.svg`](brand-assets/svg/TeamSTEP_Positive_Black.svg) |
| `"void"` | [`TeamSTEP_Positive_Block.svg`](brand-assets/svg/TeamSTEP_Positive_Block.svg) |
| `"light"` | [`TeamSTEP_Positive_White.svg`](brand-assets/svg/TeamSTEP_Positive_White.svg) |

---

## File Structure

```
packages/design-system/src/logo/
├── BrandIcon.tsx              — Component + type exports
├── BrandIcon.css              — Container-queried responsive styles
├── BrandIcon.stories.tsx      — 5 stories
├── BrandTitle.tsx             — Component + fallback logic
├── BrandTitle.css             — Container-queried responsive styles
├── BrandTitle.stories.tsx     — 4 stories
├── BrandLogo.tsx              — Component + LogoVariant type
├── BrandLogo.css              — Container-queried responsive styles
├── BrandLogo.stories.tsx      — 5 stories
└── svgs.tsx                   — Internal JSX SVG data (NOT exported from index.ts)
```

---

## CSS Patterns

All three components follow the same container-queried pattern:

```css
/* BrandIcon.css */
.ds-logo-icon {
  container-type: inline-size;
  display: block;
  width: 100%;
  max-width: 208px;
}

.ds-logo-icon svg {
  display: block;
  width: 100%;
  height: auto;
}

@container (max-width: 389px) {
  .ds-logo-icon { max-width: 120px; }
}
```

```css
/* BrandTitle.css */
.ds-logo-title {
  container-type: inline-size;
  display: block;
  width: 100%;
  max-width: 320px;
}

.ds-logo-title svg {
  display: block;
  width: 100%;
  height: auto;
}

@container (max-width: 389px) {
  .ds-logo-title { max-width: 240px; }
}
```

```css
/* BrandLogo.css */
.ds-logo {
  container-type: inline-size;
  display: block;
  width: 100%;
  max-width: 392px;
}

.ds-logo svg {
  display: block;
  width: 100%;
  height: auto;
}

@container (max-width: 389px) {
  .ds-logo { max-width: 280px; }
}
```

**Design decisions**:
- Container queries, not media queries — components are correct at 390/768/1280px by construction
- BEM naming: `ds-logo-icon`, `ds-logo-title`, `ds-logo` — enforced by stylelint rule (`^ds-[a-z0-9]+…(__…)?(--…)?$`)
- No raw hex/rgb in CSS — enforced by `scale-unlimited/declaration-strict-value`
- `svg { display: block }` prevents inline-element whitespace gaps

---

## Story Coverage

All stories render on `--color-void` background (brand constraint). Each story uses a responsive decorator that exposes explicit widths.

### BrandIcon (5 stories)

```
Logo / BrandIcon
├── Brand Filled   (208px → 120px)
├── Brand Hollow   (208px → 120px)
├── Dark           (208px → 120px)
├── Void           (208px → 120px)
└── Light          (208px → 120px)
```

### BrandTitle (4 stories)

```
Logo / BrandTitle
├── Brand Filled   (320px → 240px)
├── Dark           (320px → 240px)
├── Void           (320px → 240px)
└── Light          (320px → 240px)
```

### BrandLogo (5 stories)

```
Logo / BrandLogo
├── Brand Filled   (392px → 280px)
├── Brand Hollow   (392px → 280px)
├── Dark           (392px → 280px)
├── Void           (392px → 280px)
└── Light          (392px → 280px)
```

---

## Exports (`src/index.ts`)

```typescript
export { BrandIcon } from "./logo/BrandIcon.js";
export type { BrandIconProps } from "./logo/BrandIcon.js";
export { BrandTitle } from "./logo/BrandTitle.js";
export type { BrandTitleProps } from "./logo/BrandTitle.js";
export { BrandLogo } from "./logo/BrandLogo.js";
export type { BrandLogoProps } from "./logo/BrandLogo.js";
export type { LogoVariant } from "./logo/BrandLogo.js";
```

`svgs.tsx` is intentionally NOT exported — it's an internal implementation detail.

---

## Component Pattern Reference

Each component follows the [`Cta`](packages/design-system/src/primitives/Cta.tsx) pattern:

1. `import "./ComponentName.css"` for CSS
2. Exported interface with `@public` TSDoc
3. Exported function with `@public` TSDoc, destructured props, BEM class construction
4. Type-only exports in `index.ts`

SVG data follows the `svgs.tsx` internal module pattern — no precedence in the existing codebase (this is new), but analogous to how the token system separates data from presentation.

---

## SVG Variant Analysis

### Full File Inventory

| # | Filename | viewBox | Circle Treatment | Colors |
|---|---|---|---|---|
| 1 | `TeamSTEP_Base_Guide.svg` | 392×208 | Filled #231630 | Gradient + #7274a2 + #4f476d + #8591c9 |
| 2 | `TeamSTEP_Hollow.svg` | 392×208 | `fill: none` | Gradient + #7274a2 + #4f476d + #8591c9 |
| 3 | `TeamSTEP_Hollow_Logo_Only.svg` | 208×208 | `fill: none` | Gradient + #4f476d + #8591c9 |
| 4 | `TeamSTEP_Hollow_Logo_Only_Publication.svg` | 208×208 | `fill: none` | Gradient + #7274a2 + #4f476d + #50486e + #8591c9 |
| 5 | `TeamSTEP_Hollow_Publication.svg` | 392×208 | `fill: none` | Gradient + #7274a2 + #4f476d + #50486e + #8591c9 |
| 6 | `TeamSTEP_Locked_Logo_Only.svg` | 208×208 | Filled #231630 | Gradient + #4f476d + #8591c9 |
| 7 | `TeamSTEP_Locked_Publication.svg` | 392×208 | Filled #231630 + stroke 3px #231530 | Gradient + #7274a2 + #4f476d + #50486e + #8591c9 |
| 8 | `TeamSTEP_Locked_Title_Only.svg` | 192×188 | N/A (title only) | #7274a2 + #4f476d + #50486e + #8591c9 |
| 9 | `TeamSTEP_Locked_Title_Only_Publication.svg` | 192×188 | N/A (title only) | #7274a2 + #50486e + #8591c9 |
| 10 | `TeamSTEP_Logo_Hollow_Title_Publication.svg` | 192×188 | N/A (title only) | #7274a2 + #50486e + #8591c9 |
| 11 | `TeamSTEP_Logo_Only_Publication.svg` | 208×208 | Filled #231630 + stroke 3px #231530 | Gradient + #4f476d + #8591c9 |
| 12 | `TeamSTEP_Positive_Black.svg` | 392×208 | Monochrome | #231f20 + #050606 |
| 13 | `TeamSTEP_Positive_Black_Logo_Only.svg` | 208×208 | Monochrome | #231f20 + #050606 |
| 14 | `TeamSTEP_Positive_Black_Title_Only.svg` | 192×188 | Monochrome (title) | #231f20 + #050606 |
| 15 | `TeamSTEP_Positive_Block.svg` | 392×208 | Solid | #231630 |
| 16 | `TeamSTEP_Positive_Block_Logo_Only.svg` | 208×208 | Solid | #231630 |
| 17 | `TeamSTEP_Positive_Block_Title_Only.svg` | 192×188 | Solid (title) | #231630 |
| 18 | `TeamSTEP_Positive_White.svg` | 392×208 | White | #fff |
| 19 | `TeamSTEP_Positive_White_Logo_Only.svg` | 208×208 | White | #fff |
| 20 | `TeamSTEP_Positive_White_Title_Only.svg` | 192×188 | White (title) | #fff |

### Unused SVGs (6 files)

The following SVGs exist in `brand-assets/svg/` but are intentionally excluded from the component API:

| SVG | Reason |
|---|---|
| `TeamSTEP_Base_Guide.svg` | "full-color filled circle, no stroke" — no variant key maps to this treatment |
| `TeamSTEP_Hollow.svg` | Superseded by `TeamSTEP_Hollow_Publication.svg` (richer paths) |
| `TeamSTEP_Hollow_Logo_Only.svg` | Superseded by `TeamSTEP_Hollow_Logo_Only_Publication.svg` (richer paths) |
| `TeamSTEP_Locked_Logo_Only.svg` | "filled circle, no stroke" — no variant key maps to this treatment |
| `TeamSTEP_Locked_Title_Only.svg` | Superseded by `TeamSTEP_Locked_Title_Only_Publication.svg` (richer paths) |
| `TeamSTEP_Logo_Hollow_Title_Publication.svg` | Same as `TeamSTEP_Locked_Title_Only_Publication` — redundant, uses the latter |

---

## Verification Checklist

| Step | Command | Validates |
|---|---|---|
| Lint | `pnpm run lint` | ESLint (`@public` TSDoc, no `className` passthrough) + stylelint (BEM naming, no raw colors) |
| Types | `pnpm run check-types` | `tsc --noEmit` on both `tsconfig.json` and `tsconfig.tests.json` |
| API | `pnpm run update-api` | Regenerates [`etc/design-system.api.md`](packages/design-system/etc/design-system.api.md) with the 7 new exports (3 components, 3 prop types, `LogoVariant`). Commit the diff — never hand-edit. |
| Changeset | `pnpm changeset add` | Required because `@teamstep/design-system` is changeset-tracked — `changeset status --since` fails the PR on *any* diff in that package, not just public-API changes. Skipping this because "it's just new files" is the failure mode the gate exists to catch. |
| Governance | `pnpm run verify-governance` locally, **plus a script update** | The probe currently only injects violations into `Badge.css`/`Badge.tsx`. Running it as-is proves nothing new about the logo components. Per `AGENTS.md`'s release step, extend `verify-governance.mjs` with a third probe targeting one of the new files (e.g. corrupt a `BrandIcon.css` color declaration, or strip `BrandLogo.tsx`'s `@public` tag) so the adversarial-probe coverage actually includes this addition. |
| Contrast | `pnpm run check-contrast` | DOM-independent WCAG ratio check. Likely a no-op here since these components ship no new color tokens (SVGs carry their own fixed brand colors, not token-driven text/background pairs) — confirm rather than assume. |
| Visual | Push branch → CI `test-visual` runs automatically → if new baselines are needed, `gh workflow run design-system-ci.yml --ref <branch> -f update-snapshots=true` | **Never generate or accept baselines locally or via `act`** — font-rendering doesn't bit-match the hosted runner (this is what broke PR #6). The dispatch job auto-commits PNGs to the branch (never `main`); pull before continuing local work, and review the commit's image diff in the PR's Files Changed tab before merging — the job doesn't review, it just commits. |

Opening a PR against `/packages/design-system/` also auto-requests review via `.github/CODEOWNERS` (not currently merge-blocking — branch protection isn't enabled yet — but expect the request).

---

## Design Decisions Summary

1. **Inline JSX over external references** — per user directive, keeps the component self-contained with no network requests
2. **Three components: `BrandLogo`, `BrandIcon`, `BrandTitle`** — each serves a distinct layout role; consumers compose them in their own layouts
3. **Five variant keys** — `brand-filled` (default), `brand-hollow`, `dark`, `void`, `light` — each describes what you see (circle treatment + color palette)
4. **Single optional `variant` prop per component** — no `scope`, no `publication` boolean, no `className`/`style` passthrough
5. **`"brand-filled"` is the default** — the most visually distinctive treatment with filled + stroked circle
6. **`BrandTitle` graceful fallback** — `"brand-hollow"` falls back to `"brand-filled"` with `console.warn` since no hollow title SVG exists
7. **6 unused SVGs** — richer publication variants are chosen as canonical, ensuring the best visual quality
8. **`svgs.tsx` is internal** — not exported, keeps the public API surface minimal
9. **Container queries** — no media queries, components are responsive by construction
10. **Closed APIs** — no `className`/`style` passthrough per design system governance
11. **`src/logo/` directory, feature tier** — same tier as `hero/`, `footer/`, `nav/`, `quest-log/`, not `src/primitives/`: brand-hardcoded SVGs per variant are the opposite of a primitive's brand-agnostic prop shape, regardless of how minimal the prop surface is
12. **No `@hoonsubin` review gate required by governance** — that sign-off is specific to primitive-candidate promotion; this is ordinary feature-tier work and follows the standard build → document → release lifecycle instead
13. **Release requires a Changesets entry and a `verify-governance` extension** — both are easy to skip because this is "just adding new files," which is exactly the gap those two gates exist to close (see Verification Checklist)
