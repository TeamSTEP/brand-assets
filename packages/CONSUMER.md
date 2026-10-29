# Consuming `@teamstep/design-system`

The design system lives in [TeamSTEP/brand-assets](https://github.com/TeamSTEP/brand-assets) under `packages/design-system` and publishes to **GitHub Packages** under the `@teamstep` scope.

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
pnpm add @teamstep/design-system@^1.1.0
pnpm add motion@^12.0.0   # peer dependency (Boot logo float, DialogueBox animations)
```

`react` and `react-dom` should already be present if you use `astro add react`.

Optional companion governance packages (recommended):

```bash
pnpm add -D @teamstep/eslint-plugin@^0.2.0 @teamstep/stylelint-config@^0.2.0
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

Interactive components need hydration directives:

| Component | Suggested directive |
|---|---|
| `NavHUD` | `client:load` |
| `BBSTerminal` (+ `BBSList` / `BBSPanelIframe` children) | `client:load` |
| `VideoFacade` | `client:visible` |
| `DialogueBox` (typewriter) | `client:visible` |
| `Boot`, `FeaturedStage`, `Footer`, `GameCardArchive`, `PortfolioCard`, `ServiceCard` | none (SSR) |

Deprecated but still exported: `SocialFeed`, `BBSPanelAPI`, `Hero`, `GameCardFeatured`,
`MeltdownStage`, `PlatformAccess`. Prefer the replacements above; removals land in a future major.

Pass plain props — no `className`/`style` overrides. Extend via typed variants in the design
system repo if a new look is needed.

---

## 5. BBS feeds (app-owned)

The design system owns presentation only. Fetching, paging, and Discord/Steam embed URL
construction stay in the app.

Compose chrome + panel:

```tsx
import {
  BBSList,
  BBSPanelIframe,
  BBSTerminal,
  type BBSItem,
  type BBSTab,
} from "@teamstep/design-system";

const tabs: BBSTab[] = [
  { id: "bluesky", desktopLabel: "Bluesky", mobileLabel: "BSKY", icon: "bluesky" },
  { id: "discord", desktopLabel: "Discord", mobileLabel: "DC", icon: "discord" },
];

// Controlled tabs: update `activeTabId` + `tabListLabel` together.
<BBSTerminal
  title="BBS·TEAMSTEP·V1.0 — SIGNAL ACQUIRED"
  tabListLabel={activeTab.desktopLabel}
  tabs={tabs}
  activeTabId={activeTabId}
  onTabChange={setActiveTabId}
>
  {activeTabId === "discord" ? (
    <BBSPanelIframe
      src={`https://discord.com/widget?id=${discordServerId}&theme=dark`}
      title="Discord"
    />
  ) : (
    <BBSList
      status={status} /* loading | ready | error | loadingMore | errorMore | done */
      items={items} /* BBSItem[] — platform-free rows */
      onRetry={reload}
      endSentinelRef={endSentinelRef} /* observe for infinite scroll; DS does not fetch */
    />
  )}
</BBSTerminal>
```

Map API payloads onto `BBSItem` in the app (`id`, `name`, `href`, optional `body` /
`publishedAt` / `thumbnail`). Infinite scroll: observe `endSentinelRef` (and optionally
`listRef` / `children` for virtualization); do not pass an `onLoadMore` — that stays app-side.

CRT scanline/vignette overlays are owned by `BBSTerminal` (and game-card media slots). Do not
stack a second overlay on `BBSPanelIframe`.

Deprecated: `SocialFeed` (`fetchEndpoint` + built-in Discord `serverId` wiring) and
`BBSPanelAPI` (`UnifiedPost[]`). Keep using them only while migrating.

---

## 6. ESLint (closed APIs)

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

## 7. Stylelint (token-backed CSS)

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

## 8. Content mapping (Astro collections)

The library does not import `astro:content`. Map collection entries to component props in the
page layer:

```ts
// src/lib/games.ts
import type { FeaturedStageProps } from "@teamstep/design-system";

export function toFeaturedStage(entry: CollectionEntry<"games">): FeaturedStageProps {
  return {
    title: entry.data.title,
    subtitle: entry.data.subtitle,
    description: entry.data.description,
    media: /* img or VideoFacade */,
    ctas: /* FeaturedStageCta[] */,
    inDevelopment: entry.data.inDevelopment,
  };
}
```

Feed JSON and Discord/Steam embed URLs also stay in the Astro app — map into `BBSItem` /
`BBSPanelIframe` `src` as above.

---

## 9. Consumer-side layout (not in the package)

These stay in the landing page per Phase 0 decisions:

- Services section grid (3-col, mobile odd-card span)
- "GET IN TOUCH →" CTA below service cards (`Cta variant="secondary"`)
- Cursor trail island (`client:media="(pointer: fine)"`)
- Per-section scroll boot-in animations

---

## 10. Version pinning policy

- Pin `@teamstep/design-system` to `^1.1.x` (exact minor, floating patch).
- Run `pnpm update @teamstep/design-system` deliberately after reviewing the changelog.
- API changes require a Changesets bump in brand-assets; `check-api` guards the public surface.
