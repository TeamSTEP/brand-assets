---
name: design-tokens
description: Use when adding, editing, or reasoning about color/spacing/radius tokens in this design system — creating a new component's colors, choosing which semantic token to reference, or deciding whether a value belongs in primitive/semantic/component tier.
---

# Design Tokens (this repo)

## Overview

Tokens flow one-way: `tokens/primitive.json` → `tokens/semantic.json` → `tokens/component.json` (currently empty — no component-tier tokens exist yet). Each tier is DTCG JSON. Never hand-edit the generated `src/tokens/tokens.css` / `tokens.ts` — edit the JSON and run `pnpm run build:tokens`.

## When to Use

- Adding a new color, spacing, or radius value to a component
- Deciding whether a value is primitive (raw), semantic (contextual: `text-primary`, `surface`), or component-specific
- Choosing which existing semantic token to reuse instead of introducing a new one
- Reviewing a PR that touches `tokens/*.json` or adds a `color:`/`background`/etc. CSS declaration

## The Rule: Never Skip a Tier

A component's CSS references a **semantic** token (`var(--color-text-primary)`), which resolves to a **primitive** (`{color.ice}`). A component must never reference a primitive directly, and must never hardcode a raw literal — `stylelint`'s `scale-unlimited/declaration-strict-value` rule (defined in `@teamstep/stylelint-config`, not this package) enforces this per-property, for whichever tiers currently have tokens. Check that config's rule list before assuming a property is or isn't covered — don't infer scope from this doc, since the enforced property list changes independently of it.

```json
// tokens/primitive.json — raw value + description of what it physically is
"muted": {
  "$value": "#8A8DB2",
  "$type": "color",
  "$description": "Lightened from #7274A2 (2026-07-10): held only 3.86:1 against
    --color-background, failing WCAG AA. This shade holds >=4.5:1 against every
    sanctioned background — see scripts/check-token-contrast.mjs."
}
```

```json
// tokens/semantic.json — contextual name, points at a primitive
"text-secondary": { "$value": "{color.muted}", "$type": "color" }
```

```css
/* component CSS — references semantic only */
color: var(--color-text-secondary);
```

If a component needs a color the semantic tier doesn't have: add a new semantic token (with a `$description` explaining its role), don't bypass it by pointing the component at a primitive "just this once."

## Brand Constraints That Shape Token Choices

- Background is always `--color-background` (void) or `--color-background-recessed` (void-deep). Never introduce a lighter background token.
- `green`/`green-hi` (game-world "main quest" accent) and any future game-world colors are scoped to their game-card context — don't reference them from a general-purpose component just because they're available.
- Corner radius follows the top-left + bottom-right pattern (`2px 12px 2px 12px`, scaled by size) — never all four corners. Radius, like color, is a token: reference the semantic radius tier (e.g. `--radius-card-sm`), never a raw value in component CSS.

## Contrast Is a Real Gate, Not a Suggestion

Any semantic text token is checked against **every** sanctioned background token (`background`, `background-recessed`, `surface`) — not just the pairing you happen to be using — via `pnpm run check-contrast` (`scripts/check-token-contrast.mjs`), independent of DOM/axe rendering. This exists because axe reports `color-contrast` as `incomplete` (not `violations`) when layered gradients/overlays keep it from resolving a background, and that gap previously let two components ship at sub-AA contrast undetected. When adding or editing a color token:

1. Run `pnpm run check-contrast` after any primitive/semantic color edit.
2. If it fails, the fix is almost always **lightening/darkening the primitive value** (see the `muted` example above) — not adding an exception.
3. A genuine large-text exception goes in the script's `ALLOWLIST` with a written reason. Never loosen the threshold globally to unblock one component.

## Common Mistakes

| Mistake | Why it's wrong | Fix |
|---|---|---|
| `color: #8A8DB2` in a component's CSS | Bypasses the token pipeline; stylelint will reject it | Reference the semantic token, or add one if it doesn't exist |
| Component CSS references `{color.muted}` directly | Skips the semantic tier — component now coupled to a primitive's identity, not its role | Add/use a semantic token like `text-secondary` |
| Hand-editing `src/tokens/tokens.css` | Gets silently overwritten by the next `build:tokens` run | Edit the DTCG JSON, rerun `pnpm run build:tokens` |
| Adding a new light-background token because a mockup calls for it | Violates the dark-only brand rule | Push back on the mockup, or use `surface` (raised panel) instead of a literal light color |
| Narrowing `check-contrast`'s threshold to pass a new pairing | Defeats the gate for everyone else | Fix the actual token value, or add a scoped, reasoned `ALLOWLIST` entry |
