# Team STEP Brand Assets

`@teamstep/design-system` — a versioned, Storybook-documented component + token library for
the Team STEP brand — plus the raw brand assets in [`brand-assets/`](brand-assets/). Storybook
is the docs site; there is no separate app. Full architectural context and locked scope
decisions live in [AGENTS.md](AGENTS.md) — read it before adding components, editing tokens, or
touching CI/tooling config.

```
. (pnpm + Turborepo workspace root)
├── brand-assets/          raw logo assets, guidelines PDF — not part of the package
├── packages/
│   ├── design-system/     @teamstep/design-system — tokens, effects, components, Storybook
│   ├── eslint-config/
│   ├── eslint-plugin-teamstep/
│   ├── stylelint-config-teamstep/
│   └── typescript-config/
└── .devcontainer/         reproducible dev environment (Docker + act)
```

## For consumers

Installing and using `@teamstep/design-system` in another project is covered in **[./packages/CONSUMER.md](./packages/CONSUMER.md)** — auth against GitHub Packages, version pinning, hydration directives, and the companion ESLint/stylelint configs.

## For contributors

### Prerequisites

- Node >=18, [pnpm 11.11.0](package.json) (pinned via `packageManager` — use `corepack enable`
  rather than a global pnpm install)
- Docker, if you want to reproduce CI locally (see [Devcontainer](#devcontainer--reproducing-ci-locally))

### Setup

```bash
corepack enable
pnpm install --frozen-lockfile
```

### Day-to-day development

```bash
pnpm --filter @teamstep/design-system run storybook   # dev server at :6006
pnpm run build                                         # turbo build, all packages
pnpm run dev                                            # turbo dev (watch mode), all packages
```

Working on a single component? Scope commands with `--filter`:

```bash
pnpm --filter @teamstep/design-system run <script>
```

### Before opening a PR

Run the same gates CI runs (`turbo run lint check-contrast test check-types check-api build
build-storybook test-visual`):

```bash
pnpm run lint            # ESLint + stylelint (raw color literals outside tokens/ are banned)
pnpm run check-contrast  # WCAG contrast, computed from resolved token hex values
pnpm run check-types
pnpm run check-api       # diffs built .d.ts against etc/design-system.api.md
pnpm run build
pnpm run build-storybook
pnpm run test-visual     # Playwright a11y + visual regression against the built Storybook
```

A few of these need setup or deliberate review, not just a rerun on failure:

- **`check-api` fails on a public API change** → run
  `pnpm --filter @teamstep/design-system run update-api` to accept the new baseline
  deliberately (never hand-edit `etc/design-system.api.md`).
- **`test-visual` fails on a screenshot diff** → review it like a code change. `toHaveScreenshot`
  has a small built-in tolerance (`maxDiffPixelRatio: 0.02` in `playwright.config.ts`) for
  harmless OS-level font-hinting noise, so a failure here means either a real visual change or a
  diff bigger than that noise floor — worth looking at either way.

  **CI's own `update-visual-snapshots` job is the source of truth for new baselines, not your
  local machine.** No local environment — Docker included — reliably bit-matches GitHub's hosted
  `ubuntu-latest` runner's exact font-rendering stack; generating baselines locally and
  committing them directly caused this exact CI failure twice before this note was added. Instead:

  ```bash
  gh workflow run design-system-ci.yml --ref <your-branch> -f update-snapshots=true
  # once it finishes:
  gh run list --workflow design-system-ci.yml --branch <your-branch> --limit 1   # get the run id
  gh run download <run-id> --name visual-snapshots \
    --dir packages/design-system/tests/stories.visual.spec.ts-snapshots
  ```

  Then review the diff and commit it like any other change. Local Docker regeneration (see
  Devcontainer below) is still useful as a quick sanity check that a change looks roughly right
  before pushing — just don't treat its output as the final committed baseline.

- **Token or component color changes** → tokens are one-way generated:
  `primitive.json` → `semantic.json` → `component.json` → `pnpm run build:tokens` produces
  `tokens.css`/`tokens.ts`. Never hand-edit the generated files.
- **Publishable package changed** → add a changeset: `pnpm changeset`. CI's
  `changeset status --since=origin/$BASE_REF` fails the PR without one.

### Devcontainer / reproducing CI locally

`.devcontainer/` builds an image pinned to this repo's exact Playwright version
(`mcr.microsoft.com/playwright:v1.61.1-noble`) with `act` and pnpm preinstalled, so local runs
match CI's `ubuntu-latest` byte-for-byte instead of drifting against your host OS.

1. Open the repo in VS Code and **Reopen in Container** (or `devcontainer up` from the CLI).
2. Run any of the commands above as normal — `postCreateCommand` already ran `pnpm install`.
3. To replay a full CI workflow locally:

   ```bash
   act -W .github/workflows/design-system-ci.yml pull_request
   ```

   `.actrc` points `act` at `catthehacker/ubuntu:act-latest`, the closest published equivalent
   to GitHub's hosted runner — the default `act` image is too minimal for this repo's CI steps.
