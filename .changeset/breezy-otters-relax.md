---
---

Comment-only cleanup in `@teamstep/design-system` (scripts, tests, Storybook config)
and `@teamstep/eslint-plugin` — fixes stale doc cross-references (`HANDOFF.md`,
`CLAUDE.md` → `AGENTS.md`) after consolidating repo governance into `AGENTS.md`.
No publishable API or runtime behavior change; empty changeset so `changeset status`
doesn't block this PR on a version bump that isn't needed.
