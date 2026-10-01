---
name: visual-verification
description: >-
  Use before claiming a visual/accessibility change in this design system is correct —
  after editing component CSS, tokens, or Storybook stories; when interpreting
  test-visual/check-contrast (including incomplete, missing baselines, or pixel diffs);
  or when tempted to clear a red visual check by updating snapshots without a human owner.
---

# Visual Verification (this repo)

## Overview

This repo shipped two components (Hero, Footer) at sub-AA contrast because a test asserted
only on axe's `violations` array, and axe reports `color-contrast` as `incomplete` whenever
a layered gradient/overlay keeps it from resolving a background. The tests were green. The
bug was real. **An ambiguous test result is not a passing one.**

## Agent posture — diagnose visual CI, don't force the baseline

When `test-visual` is red:

1. Separate **a11y assertion failure** from **screenshot failure** (missing file vs pixel diff).
2. Report the mode and the owning decision (see table). Do **not** clear the gate by force.

| Failure mode | What it means | Agent does | Who accepts / lands |
|---|---|---|---|
| axe `violations` / unresolved `incomplete` | Real a11y gap or unapproved incomplete reason | Fix token/CSS or confirm messageKey is in the approved set | Agent may code-fix; **@hoonsubin** reviews |
| Snapshot **does not exist** | Story never got a linux baseline (often earlier axe failures blocked screenshot write during regen) | Name the missing `*-chromium-linux.png` paths; propose CI regen | **@hoonsubin** reviews PNG diffs after CI commits |
| Pixel diff above `maxDiffPixelRatio` (0.02) | Visual contract changed or baseline stale | Confirm the diff matches the intended change; propose CI regen | **@hoonsubin** accepts the new contract in PR review |
| Regen job push rejected (`fetch first`) | Branch moved while `update-visual-snapshots` ran — baselines generated but not on remote | Explain the race; ask for a quiet re-dispatch | Human re-runs workflow; agent does not force-push |

**Never:** `pnpm run test-visual:update` locally, `act`, committing macOS-captured PNGs, or
updating snapshots solely to turn a check green. Font stack drift makes local baselines lie.

**Human-owned regen (only):**

```bash
gh workflow run design-system-ci.yml --ref <feature-branch> -f update-snapshots=true
```

Pull the bot commit afterward. Review image diffs before merge. CODEOWNERS routes
`/packages/` review to **@hoonsubin**.

## When to Use

- After editing a component's CSS, tokens, or Storybook story, before saying the change is done
- Interpreting Playwright `test-visual` or `check-contrast` output (skipped / incomplete / "probably fine")
- A red `test-visual` gate — triage mode before proposing a fix or handoff
- Reviewing a visual-regression snapshot diff before accepting it as the new baseline

## Default Assumption: Not Achieved Until Proven

Don't infer visual correctness from a diff. Layered overlays (`PixelGrid`, `ScanlineOverlay`,
`VignetteOverlay`) and viewport-specific `clamp()` can change what axe and pixels see.

## This Repo's Toolchain

| Tool | What it verifies | Command |
|---|---|---|
| Playwright + `@axe-core/playwright` | Per-story a11y at 390/768/1280 + `toHaveScreenshot` | `pnpm run test-visual` (needs `build-storybook`) |
| `scripts/check-token-contrast.mjs` | WCAG from resolved token hex — DOM-independent | `pnpm run check-contrast` |
| `scripts/verify-governance.mjs` | Gates still fail on injected violations | `pnpm run verify-governance` |

Both contrast gates are required: axe can miss behind gradients; the token check can't see
rendering-time issues.

## Reading `test-visual` a11y output

The suite asserts on `violations` **and** unresolved `incomplete` together.

Approved unresolvable `color-contrast` incomplete `messageKey`s (every node on the result
must be one of these — mixed with a real fail still fails):

| `messageKey` | Meaning in this repo |
|---|---|
| `bgGradient` | CSS gradient on element/ancestor (PixelGrid, peek fades, scanline/vignette, etc.) |
| `imgNode` | Text compositing over a foreground `<img>` (e.g. Boot peek image) |
| `elmPartiallyObscured` | Text box clipped/obscured by an ancestor (e.g. Narrow story decorators) |

Real failures have `messageKey: null` and a measured `contrastRatio`. Token AA is still
enforced by `check-contrast` — these incompletes are not a free pass to ship bad tokens.

Never narrow the assertion back to `violations`-only.

## Reading a Visual-Regression Diff

Baselines in `tests/*-snapshots/*.png` are the visual contract.

- Confirm the diff matches the intended change before asking for regen.
- Untouched components/viewports in the diff → real bug, not noise.
- Review the new baseline like a code change after CI commits it.

## Mandatory Checklist Before Claiming "Done"

- [ ] Ran `test-visual` and `check-contrast` (or read CI artifacts), not only reasoned from source
- [ ] Checked `incomplete`, not just `violations`
- [ ] Held at 390 / 768 / 1280
- [ ] If snapshots must change: proposed CI regen and named **@hoonsubin** as acceptor — did not update locally
- [ ] Ambiguous results treated as unresolved
- [ ] Any `ALLOWLIST` / exception has a written reason

## Common Mistakes

| Mistake | Reality |
|---|---|
| "No `violations`, so it's accessible" | Check `incomplete` too — how Hero/Footer shipped broken. |
| "Only `bgGradient` is allowlisted" | Also `imgNode` and `elmPartiallyObscured` when every node is unresolvable. |
| Local snapshot update to unblock merge | Font drift; only CI linux baselines + human review. |
| Updating snapshots because the check is red | Deliberate contract acceptance by **@hoonsubin**, not a gate-clearing reflex. |
| Assuming missing Boot/QuestLog baselines are "flake" | Often never committed because axe failed first on earlier regen runs. |
| Narrowing a11y/contrast assertions for a new component | Fix the token/CSS; don't loosen the check. |
