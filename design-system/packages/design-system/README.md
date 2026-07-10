# @teamstep/design-system

Versioned React component library and design tokens for Team STEP. Storybook is the docs
site; this package is consumed by the Astro landing page and future Team STEP sites.

## Install

Published to GitHub Packages. See [CONSUMER.md](../CONSUMER.md) for auth, Astro integration,
and companion lint presets.

```bash
pnpm add @teamstep/design-system@^0.1.0
```

## Exports

| Import | Purpose |
|---|---|
| `@teamstep/design-system` | Components and hooks |
| `@teamstep/design-system/tokens.css` | CSS custom properties |
| `@teamstep/design-system/styles.css` | Bundled component styles |

## Development

From the `design-system/` workspace root:

```bash
pnpm install
pnpm run storybook          # component catalog
pnpm run test-visual        # Playwright a11y + visual regression
pnpm run lint && pnpm run check-api && pnpm run build
```

## Peer dependencies

- `react` ^19
- `react-dom` ^19
- `motion` ^12 (Hero idle float, DialogueBox typewriter)
