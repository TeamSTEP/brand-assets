# Consuming `@teamstep/design-system`

Guide for the Astro landing site (or any other Team STEP consumer repo). The design system
lives in [TeamSTEP/brand-assets](https://github.com/TeamSTEP/brand-assets) under
`design-system/packages/design-system` and publishes to **GitHub Packages** under the
`@teamstep` scope.

---

## 1. GitHub Packages auth

Create `.npmrc` at the consumer repo root (or in the user's home `~/.npmrc`):

```ini
@teamstep:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Use a GitHub personal access token (classic) or fine-grained token with `read:packages` scope.
In CI, `GITHUB_TOKEN` from `actions/setup-node` works when the consumer repo is in the same org.

---

## 2. Install the design system

Pin a minor range — never `workspace:*` or `latest` outside the brand-assets monorepo:

```bash
pnpm add @teamstep/design-system@^0.1.0
pnpm add motion@^12.0.0   # peer dependency (Hero logo float, DialogueBox animations)
```

`react` and `react-dom` should already be present if you use `astro add react`.

Optional companion governance packages (recommended):

```bash
pnpm add -D @teamstep/eslint-plugin@^0.1.0 @teamstep/stylelint-config@^0.1.0
```

---

## 3. Import tokens and styles

In `BaseLayout.astro` (or equivalent global layout):

```astro
---
import "@teamstep/design-system/tokens.css";
import "@teamstep/design-system/styles.css";
---
```

`tokens.css` defines `--color-*`, `--radius-*`, and spacing custom properties.
`styles.css` bundles component CSS (imported automatically when you use components).

---

## 4. Use components in Astro islands

Example — static SSR (no client JS):

```astro
---
import { GameCardArchive } from "@teamstep/design-system";
---
<GameCardArchive client:load={false} {...props} />
```

Interactive components need hydration directives per the architecture proposal:

| Component | Suggested directive |
|---|---|
| `NavHUD` | `client:load` |
| `SocialFeed` | `client:load` |
| `VideoFacade` | `client:visible` |
| `DialogueBox` (typewriter) | `client:visible` |
| `Hero`, `Footer`, `GameCardArchive`, `ServiceCard` | none (SSR) |

Pass plain props — no `className`/`style` overrides. Extend via typed variants in the design
system repo if a new look is needed.

---

## 5. ESLint (closed APIs)

```js
// eslint.config.mjs
import teamstep from "@teamstep/eslint-plugin";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["src/**/*.tsx"],
    ...teamstep.configs.recommended,
  },
];
```

---

## 6. Stylelint (token-backed CSS)

For page-level CSS that uses design tokens:

```js
// stylelint.config.mjs
import teamstepConfig from "@teamstep/stylelint-config";

/** @type {import('stylelint').Config} */
export default {
  extends: [teamstepConfig],
};
```

Use `var(--color-void)`, `var(--color-accent)`, etc. — never raw hex in consumer stylesheets.

---

## 7. Content mapping (Astro collections)

The library does not import `astro:content`. Map collection entries to component props in the
page layer:

```ts
// src/lib/games.ts
import type { GameCardFeaturedProps } from "@teamstep/design-system";

export function toFeaturedCard(entry: CollectionEntry<"games">): GameCardFeaturedProps {
  return {
    title: entry.data.title,
    // ...
  };
}
```

`SocialFeed` accepts `fetchEndpoint` (default `/api/feed`) — keep API routes in the Astro app.

---

## 8. Consumer-side layout (not in the package)

These stay in the landing page per Phase 0 decisions:

- Services section grid (3-col, mobile odd-card span)
- "GET IN TOUCH →" CTA below service cards (`Cta variant="secondary"`)
- Cursor trail island (`client:media="(pointer: fine)"`)
- Per-section scroll boot-in animations

---

## 9. Version pinning policy

- Pin `@teamstep/design-system` to `^0.1.x` (exact minor, floating patch).
- Run `pnpm update @teamstep/design-system` deliberately after reviewing the changelog.
- API changes require a Changesets bump in brand-assets; `check-api` guards the public surface.
