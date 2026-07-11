---
name: design-system-governance
description: Use when auditing this design system for consistency, documenting a component's variants/states/accessibility, or scoping a new component/variant before implementation — before touching tokens/CI config, and before reviewing a design-system PR.
---

# Design System Governance (this repo)

## Overview

This repo enforces governance through typed contracts and CI gates, not prose conventions — because it's read and modified by coding agents as much as humans. Before adding, auditing, or documenting anything here, know which gate is supposed to catch a given mistake; a gap in that mapping is itself a finding.

## When to Use

- Auditing the design system for token/API drift before a release
- Writing documentation for a component's variants, states, and accessibility behavior
- Scoping a new component or variant request into a concrete proposal
- Reviewing a PR against `/design-system` (this repo's `AGENTS.md`), not generic best practice

## Gate Map — What Actually Catches What

| Concern | Enforced by | Not by |
|---|---|---|
| Hardcoded color instead of a token | `pnpm run lint` (stylelint `declaration-strict-value`) | Code review alone |
| Off-brand contrast pairing | `pnpm run check-contrast` (token-level) + Playwright a11y (DOM-level, catches what tokens can't: rendering-time issues) | Either one alone — see the Hero/Footer incident below |
| Accidental public API change | `pnpm run check-api` (diffs built `.d.ts` against `etc/design-system.api.md`) | Manual review of the diff |
| Missing viewport coverage (390/768/1280) | Playwright `test-visual`, one suite per story per viewport, auto-discovered from `storybook-static/index.json` | A written note telling consumers to test it |
| Publishable change without a version bump | CI's `changeset status --since=origin/$BASE_REF` | A handoff doc claiming a changeset exists |
| A gate silently breaking (e.g. someone loosens a rule to unblock themselves) | `verify-governance` (`scripts/verify-governance.mjs`) — injects a real violation into a real file and asserts the gate fails, then restores it | Trusting the gate is still wired up |

**The incident this repo's rules are downstream of:** axe reports `color-contrast` as `incomplete`, not `violations`, when a gradient/overlay keeps it from resolving a background. Two components (Hero, Footer) shipped at sub-AA contrast because a test only checked `violations`. The fix was two independent gates (`check-contrast` at the token level, `incomplete`-aware axe assertion at the DOM level) — a single check, however careful, wasn't enough. When you build a new gate, ask whether one failure mode can slip past it the same way.

## Audit Workflow

1. **Token coverage** — grep component CSS for raw literals outside `src/tokens/`; cross-check against `@teamstep/stylelint-config`'s `declaration-strict-value` property list for which properties `pnpm run lint` actually enforces today (color, spacing, and radius are covered as of this writing — don't assume from memory, that list grows as new token tiers ship).
2. **API surface** — diff `etc/design-system.api.md` against `git log` for the package; anything changed without a Changeset is a finding.
3. **Variant/prop shape** — for each public component, check its props are closed unions (see `component-api-design` skill) — no `className`/`style`/free-form string props.
4. **Viewport + a11y coverage** — confirm every story in `storybook-static/index.json` has a corresponding Playwright test entry (should be automatic — a gap here means the index-reading logic broke, not that a story is exempt).
5. **Contrast** — run `pnpm run check-contrast`; any `ALLOWLIST` entries should carry a reason, not just a token name.

## Documenting a Component

Match what the code actually enforces, not a generic template:

```markdown
## Component: [Name]

### Variants
| Variant | Scope/meaning | Notes |
|---|---|---|
| [e.g. "primary"] | [e.g. game-card demo-play only] | [copy the TSDoc scoping note, don't invent new prose] |

### Tokens used
[Which semantic tokens — never list a primitive here]

### Accessibility
- Contrast: checked against [which sanctioned backgrounds] via check-contrast
- Viewport coverage: 390/768/1280, verified by Playwright test-visual

### Do / Don't
| Do | Don't |
|---|---|
| Add a variant for a new look | Pass className/style/inline color |
```

## Scoping a New Component or Variant

Before writing code, answer these — they map directly to `AGENTS.md`'s standing rules:

- **Does an existing component already do this with a new variant?** (see `component-api-design`'s decision flow) — most "new component" requests are actually this.
- **What semantic tokens does it need?** If none exist yet, that's a `design-tokens` task first, not a shortcut to a primitive.
- **What's the closed prop shape?** Write the variant union before writing any JSX.
- **Does it need a Changeset?** Any new public export does.
- **Does it break at any of the three viewports by construction, or does it need a written "remember to test this" note?** If the latter, the responsiveness isn't actually in the component yet — `AGENTS.md` requires it live in the component's own CSS (`clamp()`/container queries), not a consumer's responsibility.

## Common Mistakes

| Mistake | Reality |
|---|---|
| "Lint passed, so the tokens are fine" | Lint only checks the property list currently in `@teamstep/stylelint-config` — a newly added token tier (e.g. shadow) isn't covered until that list is extended. Check the config, don't assume. |
| "Axe didn't report a violation" | Check `incomplete` too — see the Hero/Footer incident. `violations`-only is a known false-negative pattern here. |
| "I'll add a `CHANGELOG` note instead of a changeset" | CI checks for an actual changeset file via `changeset status`, not prose. |
| Treating `etc/design-system.api.md` as something to hand-edit when the diff looks annoying | Defeats the entire point of the gate — always regenerate via `pnpm run update-api` and review the diff as a real decision. |
