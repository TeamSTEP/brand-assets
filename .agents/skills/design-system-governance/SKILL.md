---
name: design-system-governance
description: >-
  Use when auditing this design system for consistency, documenting a component's
  variants/states/accessibility, scoping a new component/variant, diagnosing a red
  design-system CI gate or publish failure, or deciding whether an agent should fix
  something vs hand it to a human owner — before touching tokens/CI/publish config,
  and before reviewing a design-system PR.
---

# Design System Governance (this repo)

## Overview

This repo enforces governance through typed contracts and CI gates, not prose
conventions — because it's read and modified by coding agents as much as humans.
Before adding, auditing, or documenting anything here, know which gate is supposed
to catch a given mistake; a gap in that mapping is itself a finding.

## Agent posture — diagnose, don't force-solve

When CI is red or a publish/deploy question comes up:

1. **Identify the failing gate** and the failure *mode* (see Gate Map + CI triage below).
2. **Name the owner** who must accept or land the fix — do not silently assume the agent is that owner.
3. **Propose the next human action** (command, PR comment, who to ping). Do **not** force a
   merge-blocking workaround (local snapshot updates, loosening gates, hand-editing
   `etc/design-system.api.md`, publishing from a feature branch, inventing primitives).

| Decision | Owner | Agent does | Agent does not |
|---|---|---|---|
| Accept new visual baselines | **@hoonsubin** (CODEOWNERS on `/packages/`) after reviewing PNG diffs in the PR | Diagnose missing vs stale baselines; quote the CI dispatch command | Run `test-visual:update` locally, `act`, or auto-accept diffs to clear the check |
| Promote a primitive | **@hoonsubin** (AGENTS.md lifecycle) | Flag the pattern (≥3 feature repeats) | Invent a new primitive quietly |
| Bump / publish `@teamstep/design-system` | **@hoonsubin** via Changesets + `design-system-publish.yml` on `main` | Ensure a changeset exists; explain version impact | Publish from a feature branch, force-push version commits, or skip Changesets |
| Supply-chain override / `trustPolicyExclude` | **@hoonsubin** (CODEOWNERS on `pnpm-workspace.yaml`) | Report the advisory + proposed same-major override | Broaden overrides or disable `pnpm audit` to unblock |
| Loosen lint / axe / contrast gates | **@hoonsubin** + PR review | Fix the component/token, or document a scoped allowlist reason | Narrow assertions or thresholds to make CI green |
| Branch protection / required checks | Repo admin (**@hoonsubin**) | Note if a check is missing from protection | Rewrite protection rules without ask |

CODEOWNERS (`.github/CODEOWNERS`) auto-requests **@hoonsubin** on package, lockfile,
changeset, and `AGENTS.md` changes. That is review request, not merge power by itself —
branch protection on `main` is what requires the review + the `design-system CI` check.

## When to Use

- Auditing the design system for token/API drift before a release
- Writing documentation for a component's variants, states, and accessibility behavior
- Scoping a new component or variant request into a concrete proposal
- Reviewing a PR against this repo's `AGENTS.md`, not generic best practice
- A red CI check on a design-system PR — triage which gate failed and who owns the resolution
- Questions about when/how the package publishes to GitHub Packages or Storybook Pages

## Gate Map — What Actually Catches What

| Concern | Enforced by | Not by |
|---|---|---|
| Hardcoded color instead of a token | `pnpm run lint` (stylelint `declaration-strict-value`) | Code review alone |
| Known vulnerable transitive deps | CI `pnpm audit` + same-major `overrides` in `pnpm-workspace.yaml` | Ignoring audit because "dev-only" |
| Off-brand contrast pairing | `pnpm run check-contrast` (token-level) + Playwright a11y (DOM-level) | Either one alone — see Hero/Footer incident |
| Accidental public API change | `pnpm run check-api` (diffs built `.d.ts` against `etc/design-system.api.md`) | Manual review of the diff |
| Missing viewport coverage (390/768/1280) | Playwright `test-visual`, one suite per story per viewport from `storybook-static/index.json` | A written note telling consumers to test it |
| Visual contract drift / missing baselines | `test-visual` `toHaveScreenshot` — baselines ship only via CI regen | Local/`act` screenshots (font stack drift) |
| Publishable change without a version bump | CI `changeset status --since=origin/$BASE_REF` | A handoff doc claiming a changeset exists |
| A gate silently breaking | `verify-governance` — injects a real violation, asserts the gate fails, restores | Trusting the gate is still wired up |

**The incident this repo's rules are downstream of:** axe reports `color-contrast` as
`incomplete`, not `violations`, when a gradient/overlay keeps it from resolving a background.
Two components (Hero, Footer) shipped at sub-AA because a test only checked `violations`.
The fix was two independent gates (`check-contrast` + `incomplete`-aware axe). When you build
a new gate, ask whether one failure mode can slip past it the same way.

## CI triage — read the gate, then stop if ownership is human

CI job `design-system CI` / step outcomes live in the run summary and `ci-summary` artifact
(`gate-results.json`). One failed gate can mask others only if you don't open that summary.

| `gate-results` / step | Typical real cause | Next step (agent) | Owner to land it |
|---|---|---|---|
| `audit` | New GHSA on a transitive; override lag | Identify package + patched range; propose same-major override | **@hoonsubin** reviews `pnpm-workspace.yaml` |
| `check-contrast` | Text token too dark on sanctioned backgrounds | Fix primitive/semantic (don't darken a shared border primitive like `mid`) | Agent may implement token fix; **@hoonsubin** reviews |
| `test-visual` — axe `toEqual([])` | Real contrast fail (`messageKey: null`) or unresolved incomplete | Fix token/CSS, or confirm incomplete keys are in the approved set (see `visual-verification`) | Agent may fix code; human reviews |
| `test-visual` — snapshot missing | Story never got a linux baseline (often because axe failed first on earlier runs) | Report missing files; propose CI regen command | **@hoonsubin** accepts after PNG review |
| `test-visual` — pixel diff > tolerance | Intentional visual change or stale baseline | Confirm intent; propose CI regen — never local update | **@hoonsubin** accepts after PNG review |
| `changeset` | Tracked package diff without a changeset | Add changeset (or empty if no bump) | Agent may add; reviewer confirms bump intent |
| `check-api` | Public `.d.ts` drift or `@public` without a summary line | `pnpm run update-api` after deliberate API decision | Agent may regenerate; treat diff as API decision |
| `verify-governance` | Probe transform no longer matches file shape | Update `scripts/verify-governance.mjs` markers | Agent may fix script; **@hoonsubin** reviews |

**Visual baseline regen (human-owned acceptance):**

```bash
gh workflow run design-system-ci.yml --ref <feature-branch> -f update-snapshots=true
```

Then pull the bot commit and review PNG diffs in the PR. Never `test-visual:update` locally
or via `act`. If the update job's push is rejected (`fetch first`), the branch moved during
the run — say so, and ask for a quiet re-dispatch rather than force-pushing.

## Package deployment

- **Registry:** `@teamstep/*` → GitHub Packages (`npm.pkg.github.com`), scoped in `.npmrc`.
- **Versioning:** Changesets on the PR; empty changeset if the diff must not bump.
- **Publish:** `design-system-publish.yml` on push to `main` — `changesets/action` runs
  `pnpm run version` / `pnpm run release`. Agents do not publish from feature branches.
- **Storybook Pages:** same workflow's `pages-build` / `pages-deploy` (parallel to release).
- **Consumers:** pin `@teamstep/design-system` by version (`^x.y`); never `workspace:*` /
  `latest` outside this monorepo (`CONSUMER.md`).

## Audit Workflow

1. **Token coverage** — grep component CSS for raw literals outside `src/tokens/`; cross-check
   `@teamstep/stylelint-config`'s `declaration-strict-value` property list (don't assume from memory).
2. **API surface** — diff `etc/design-system.api.md` against package history; changed without a Changeset is a finding.
3. **Variant/prop shape** — closed unions only (see `component-api-design`).
4. **Viewport + a11y** — every story in `storybook-static/index.json` is covered by `test-visual` automatically; a gap means the index-reading logic broke.
5. **Contrast** — `pnpm run check-contrast`; `ALLOWLIST` entries need a written reason.

## Documenting a Component

Match what the code actually enforces, not a generic template:

```markdown
## Component: [Name]

### Variants
| Variant | Scope/meaning | Notes |
|---|---|---|
| [e.g. "primary"] | [e.g. game-card demo-play only] | [copy the TSDoc scoping note] |

### Tokens used
[Semantic tokens only — never list a primitive]

### Accessibility
- Contrast: checked against sanctioned backgrounds via check-contrast
- Viewport coverage: 390/768/1280 via Playwright test-visual

### Do / Don't
| Do | Don't |
|---|---|
| Add a variant for a new look | Pass className/style/inline color |
```

## Scoping a New Component or Variant

Before writing code:

- **Existing component + new variant?** (see `component-api-design`) — most "new component" requests are this.
- **Semantic tokens first** if none exist (`design-tokens`).
- **Closed prop shape** — write the variant union before JSX.
- **Changeset** for any new public export.
- **Responsive in-component** — `clamp()` / container queries; no "remember to test" consumer notes.

## Common Mistakes

| Mistake | Reality |
|---|---|
| "Lint passed, so the tokens are fine" | Lint only checks properties currently listed in `@teamstep/stylelint-config`. |
| "Axe didn't report a violation" | Check `incomplete` too — see Hero/Footer. |
| "I'll clear test-visual myself with a local snapshot update" | Font stack drift; baselines must come from CI and be accepted by **@hoonsubin**. |
| "CI is red so I'll loosen the gate / skip audit" | Gates are the product — fix the cause or hand the override to the owner. |
| "I'll add a CHANGELOG note instead of a changeset" | CI checks `changeset status`, not prose. |
| Hand-editing `etc/design-system.api.md` | Always `pnpm run update-api` and review the API diff as a real decision. |
| Agent invents a primitive to unblock a feature | Flag for **@hoonsubin**; do not ship quietly. |
