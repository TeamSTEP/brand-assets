---
name: visual-verification
description: Use before claiming a visual/accessibility change in this design system is correct — after editing component CSS, tokens, or Storybook stories, before running or trusting test-visual/check-contrast output, or when a11y/visual results look ambiguous instead of clearly pass or fail.
---

# Visual Verification (this repo)

## Overview

This repo shipped two components (Hero, Footer) at sub-AA contrast because a test asserted only on axe's `violations` array, and axe reports `color-contrast` as `incomplete` — not a violation — whenever a layered gradient/overlay keeps it from resolving a definitive background. The tests were green. The bug was real. The lesson: **an ambiguous test result is not a passing one**, and this applies beyond contrast to any visual claim you're about to make.

## When to Use

- After editing a component's CSS, tokens, or Storybook story, before saying the change is done
- Interpreting Playwright `test-visual` or `check-contrast` output, especially when something is skipped, `incomplete`, or "probably fine"
- Reviewing a visual-regression snapshot diff before accepting it as the new baseline
- Any point where you're tempted to infer a visual result from the code change rather than looking at actual output

## Default Assumption: Not Achieved Until Proven

Don't infer visual correctness from a diff. A CSS change that looks correct in isolation can still fail at a specific viewport, against a specific background, or in combination with an overlay effect (`PixelGrid`, `ScanlineOverlay`, `VignetteOverlay`) that changes what's actually resolvable. Look at what the tools actually report.

## This Repo's Actual Toolchain — Use These, Not Generic Advice

| Tool | What it verifies | Command |
|---|---|---|
| Playwright + `@axe-core/playwright` | DOM-rendered a11y (per story, per viewport 390/768/1280) + visual regression (`toHaveScreenshot`) | `pnpm run test-visual` (needs `build-storybook` first) |
| `scripts/check-token-contrast.mjs` | WCAG ratio computed directly from resolved token hex values — DOM-independent, catches what axe's gradient-detection limitation can't | `pnpm run check-contrast` |
| `scripts/verify-governance.mjs` | Confirms the gates themselves still fail on a real injected violation | `pnpm run verify-governance` |

Two checks exist for contrast specifically because either one alone has a blind spot: axe can miss it behind a gradient (`incomplete`, `bgGradient` reason); the token-level check can't see rendering-time issues axe would catch. Treat both as required, not redundant.

## Reading `test-visual` Output Correctly

```
accessibilityScanResults.incomplete.filter(result => !isUnresolvableBackgroundIncomplete(result))
```

This repo's test asserts on `violations` **and** unresolved `incomplete` results together — not `violations` alone. If you're writing or modifying this kind of check anywhere:

1. An `incomplete` result means axe *couldn't determine* pass/fail — treat it as failing by default.
2. The only pre-approved exception is the specific, structurally-safe case where every flagged node's reason is `bgGradient` (an overlay/gradient axe can't resolve, already covered independently by `check-contrast`).
3. Never narrow an assertion back to `violations`-only to make a result look cleaner — that's the exact regression that caused the original incident.

## Reading a Visual-Regression Diff

Baseline screenshots in `tests/*-snapshots/*.png` are the visual contract, not a formality. Before running `test-visual:update` to accept a new baseline:

- Confirm the diff matches the change you intended — a snapshot update should never be a reflex to turn a red check green.
- If the diff shows something you didn't intend to touch (a different component, a different viewport), that's a real bug, not noise to update away.
- Review the new baseline like a code change: does it actually look right, not just "different from before in the expected direction"?

## Mandatory Checklist Before Claiming "Done"

- [ ] Did I run `test-visual` and `check-contrast`, not just read the code and reason about it?
- [ ] Did I check `incomplete` results, not just `violations`?
- [ ] Does the change hold at all three viewports (390/768/1280), not just the one I happened to look at?
- [ ] If a snapshot changed, did I look at the actual diff image, not just accept the update?
- [ ] If something is ambiguous (skipped, `incomplete`, flaky), did I treat that as unresolved rather than passing?
- [ ] If I added an `ALLOWLIST`/exception, did I write down why — not just silence the check?

## Common Mistakes

| Mistake | Reality |
|---|---|
| "No `violations`, so it's accessible" | Check `incomplete` too — that's exactly how Hero/Footer shipped broken. |
| "The CSS change looks right, no need to run test-visual" | Visual correctness is not inferable from source — layered overlays and viewport-specific `clamp()` behavior can surprise you. |
| Updating snapshots because the check is red and blocking a merge | Snapshot updates are a deliberate acceptance of a new visual contract, not a way to clear a gate. |
| Narrowing an a11y/contrast assertion because a new component keeps tripping it | The assertion is probably right and the component is probably still broken — fix the token/CSS, don't loosen the check. |
