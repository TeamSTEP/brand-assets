# Team STEP Brand Assets

`@teamstep/design-system` — a versioned, Storybook-documented component + token library for
the Team STEP brand — plus the raw brand assets in [`brand-assets/`](brand-assets/). Storybook
is the docs site; there is no separate app. Full architectural context and locked scope
decisions live in [CLAUDE.md](CLAUDE.md) — read it before adding components, editing tokens, or
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
- **`test-visual` fails on a screenshot diff** → review it like a code change:
  `pnpm --filter @teamstep/design-system run test-visual:update`, then inspect the diff before
  committing. **Regenerate snapshots on Linux, not macOS** — Chromium's font rendering differs
  enough between the two to fail every screenshot on CI (`ubuntu-latest`) even when nothing
  visually changed. Use the devcontainer or Docker directly:

  ```bash
  docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.61.1-noble bash -c "
    corepack enable && corepack prepare pnpm@11.11.0 --activate
    CI=true pnpm install --frozen-lockfile
    pnpm --filter @teamstep/design-system exec playwright install --with-deps chromium
    pnpm --filter @teamstep/design-system run build-storybook
    pnpm --filter @teamstep/design-system run test-visual:update
  "
  ```

  Bind-mounting `node_modules` this way rewrites it for Linux — if you're not using the
  devcontainer, run `pnpm install` again afterward to restore your host's native `node_modules`.

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
