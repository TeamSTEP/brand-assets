---
name: design-tokens
description: >-
  Use when adding, editing, or reasoning about color/spacing/radius tokens in this design
  system — creating a component's colors, choosing a semantic token, deciding
  primitive/semantic/component tier, or fixing a check-contrast failure without breaking
  shared border primitives.
---

# Design Tokens (this repo)

## Overview

Tokens flow one-way: `tokens/primitive.json` → `tokens/semantic.json` →
`tokens/component.json` (currently empty — no component-tier tokens yet). Each tier is DTCG
JSON. Never hand-edit generated `src/tokens/tokens.css` / `tokens.ts` — edit JSON and run
`pnpm run build:tokens`.

## When to Use

- Adding a new color, spacing, or radius value to a component
- Deciding primitive vs semantic vs component tier
- Choosing which semantic token to reuse
- Reviewing a PR that touches `tokens/*.json` or adds color/spacing/radius CSS
- `check-contrast` fails on a text/background pair

## The Rule: Never Skip a Tier

Component CSS references a **semantic** token (`var(--color-text-primary)`), which resolves
to a **primitive**. Never reference a primitive from component CSS; never hardcode a raw
literal — stylelint `declaration-strict-value` in `@teamstep/stylelint-config` enforces
per-property. Check that config's list; don't assume from memory.

```json
// tokens/primitive.json — raw value
"muted": {
  "$value": "#8A8DB2",
  "$type": "color",
  "$description": "Lightened for WCAG AA (≥4.5:1) on sanctioned backgrounds — see scripts/check-token-contrast.mjs."
}
```

```json
// tokens/semantic.json — role name → primitive
"text-secondary": { "$value": "{color.muted}", "$type": "color" },
"text-tertiary": {
  "$value": "{color.muted}",
  "$type": "color",
  "$description": "Remapped from mid to muted for WCAG AA; hierarchy vs secondary is letter-spacing/case, not fill."
}
```

```css
/* component CSS — semantic only */
color: var(--color-text-secondary);
```

If the semantic tier lacks a needed role: add a semantic token with a `$description`, don't
point the component at a primitive "just this once."

## Brand Constraints

- Background is always `--color-background` (void) or `--color-background-recessed`
  (void-deep). Never a light background token.
- Game greens/bloods stay in game-card/stage scope — not general UI chrome (use teal /
  `--color-chrome-accent*`).
- Radius is asymmetric TL+BR via `--radius-card-*` / `--radius-chip-*` — never raw literals
  in component CSS (except `src/effects/**`).

## Contrast Is a Real Gate

Every discovered text token (`color: var(--color-*)` in `src/**/*.css`) is checked against
**every** sanctioned background (`background`, `background-recessed`, `surface`) via
`pnpm run check-contrast`. This exists because axe reports `incomplete` on gradients —
see `visual-verification` / `design-system-governance`.

When adding or editing a color token:

1. Run `pnpm run check-contrast` after the edit.
2. Prefer fixing the primitive or remapping the semantic token — not an exception.
3. **Do not darken/lighten a primitive that also drives borders** (e.g. `mid` →
   `--color-border-default`) just to fix text — remap the text semantic (as `text-tertiary`
   did: mid → muted) or introduce a dedicated primitive.
4. Large-text exceptions only: `ALLOWLIST` in `scripts/check-token-contrast.mjs` with a
   written reason. Never lower the global 4.5:1 threshold.

Token AA fixes are normal agent work; **@hoonsubin** still reviews via CODEOWNERS. Do not
silence `check-contrast` or axe to unblock a PR — hand allowlist/threshold debates to that owner.

## Common Mistakes

| Mistake | Why it's wrong | Fix |
|---|---|---|
| `color: #8A8DB2` in component CSS | Bypasses tokens; stylelint rejects | Use/add a semantic token |
| Component references a primitive | Couples to identity, not role | Add/use a semantic token |
| Hand-edit `src/tokens/tokens.css` | Overwritten by `build:tokens` | Edit DTCG JSON |
| New light-background token for a mockup | Breaks dark-only brand | Push back or use `surface` |
| Lighten `mid` to fix tertiary text | Changes every border using `border-default` | Remap text semantic (e.g. to `muted`) |
| Narrow `check-contrast` threshold | Defeats the gate for everyone | Fix the value or scoped `ALLOWLIST` |
