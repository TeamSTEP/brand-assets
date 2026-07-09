# Team STEP — React Design System: Architecture Proposal

> Extends `teamstep-landing-spec.md`. Scope: pull the visual language and components out of the Astro page into a standalone, versioned React component library (`@teamstep/design-system`), consumed by the existing Astro 5 site as islands. No full implementation code below — this is the architecture and build strategy to hand to a developer or coding agent.

---

## 1. Why a library instead of Astro-only components

The wireframe defines a real design system (tokens, effects, corner-radius rule, CTA hierarchy, card taxonomy) that's reused across sections and will likely be reused again for future Team STEP pages/games. Pulling it into its own package gives you:

- **One source of truth** for tokens, effects, and components — Storybook becomes the living style guide.
- **Reuse** across future pages (next game announcement, itch/Steam press kit page, etc.) without copy-pasting `.astro` files.
- **Framework isolation**: the library knows nothing about `astro:content`, Vercel, or your API routes. It only accepts plain props. The Astro app stays the only place that talks to data.

## 2. Repo shape — pnpm workspace, two packages

```
teamstep/                          (pnpm workspace root)
├── pnpm-workspace.yaml
├── package.json                   root scripts: dev / build / storybook
├── packages/
│   └── design-system/             @teamstep/design-system
│       ├── package.json
│       ├── tsup.config.ts
│       ├── .storybook/
│       └── src/
│           ├── tokens/
│           │   ├── tokens.css     ported 1:1 from spec §2.1
│           │   └── tokens.ts      same values, typed, for JS-side use (canvas, animation math)
│           ├── effects/           PixelGrid, ScanlineOverlay, VignetteOverlay
│           ├── nav/               NavDesktop, NavHUD
│           ├── hero/              Hero
│           ├── quest-log/         GameCardFeatured, GameCardArchive, PlatformAccess, Badge, VideoFacade
│           ├── bbs/               BBSTerminal, BBSPanelAPI, BBSPanelIframe, SocialFeed
│           ├── manifesto/         DialogueBox
│           ├── services/          ServiceCard
│           ├── hooks/             useInView, useTypewriter, useIdleFloat, useCursorTrail
│           └── index.ts           barrel export
└── apps/
    └── web/                       the Astro 5 site from teamstep-landing-spec.md
        ├── astro.config.mjs      + astro add react
        ├── src/pages/index.astro imports from @teamstep/design-system, sets client:* per component
        ├── src/pages/api/feed.ts stays here — library never fetches server-side
        ├── src/content/          games.yaml + config.ts, unchanged
        └── package.json          depends on "@teamstep/design-system": "workspace:*"
```

This is one workspace, two packages — not a multi-repo split. Small enough for a solo/indie team to keep in one `git clone`, but structurally ready to publish `design-system` to a private npm registry later if a second site needs it.

## 3. Styling: CSS Modules, not Tailwind or CSS-in-JS

The spec is explicit about plain CSS and precise custom effects (pixel grid, scanline, vignette, the asymmetric corner-radius rule). Keep that discipline in the library:

- Each component ships a colocated `Component.module.css`.
- `tokens.css` is imported once, globally, by the consuming Astro app (`import '@teamstep/design-system/tokens.css'` in `BaseLayout.astro`) — the library's CSS Modules reference the custom properties (`var(--color-accent)`), they don't redefine them.
- No runtime styling library (no styled-components, no vanilla-extract needed) — keeps bundle weight and hydration cost near zero, which matters because most of this page should ship **zero JS**.

## 4. The hydration boundary is the whole point

Every component lives in the React library, but Astro decides per-instance whether it ships JS:

| Component | Astro directive | Why |
|---|---|---|
| `Hero`, `GameCardArchive`, `Badge`, `ServiceCard`, `DialogueBox` (static shell) | *(none — SSR only)* | Pure presentation, no interaction |
| `GameCardFeatured`, `PlatformAccess` | *(none, usually)* | Hover states can be done in CSS `:hover`, no JS needed |
| `NavHUD` | `client:load` | Needs `IntersectionObserver` immediately on load |
| `SocialFeed` | `client:load` | Tab switching + fetch on click |
| `BBSPanelIframe` | *(none)* | Just a styled `<iframe>`, no React state |
| `VideoFacade` | `client:visible` | Only hydrate once scrolled near |
| Scroll-triggered boot-in animations, typewriter in `DialogueBox` | `client:visible` | Defer until in viewport |
| Cursor trail (page-level, not a "component" per se) | separate tiny island, `client:media="(pointer: fine)"` | Astro's `client:media` directive replaces the old `matchMedia` guard in `cursor.ts` outright |

Astro can render a React component with **no** `client:*` directive at all and it still emits static HTML — this is the mechanism that keeps the "static except social feed" rendering strategy from the original spec intact while giving you one component source.

## 5. Animation: `motion` (already in the spec) has first-class React bindings

The spec already chose `motion` (Motion One's successor package) for `animations.ts`. Same package exports a React API (`motion/react`), so:

- `animations.ts`, `hud.ts`, `cursor.ts` from the original spec become **hooks** inside the library instead of standalone scripts: `useInView`, `useIdleFloat`, `useCursorTrail`, `useTypewriter`.
- All hooks respect `prefers-reduced-motion` internally (check once in the hook, not per call site) — enforce this in code review, it's easy to forget per-component.
- `bbs.ts`'s tab-switch + per-platform `Map` cache becomes local state inside `SocialFeed` (`useState`/`useRef`), no separate script file needed.

## 6. Keeping the library decoupled from Astro Content Collections

`GameCardFeatured`/`GameCardArchive` must **not** import from `astro:content` — that ties the library to Astro. Instead:

- Define a plain `GameCardProps` interface in the library (mirrors the Zod schema's shape, but as a hand-written TS type — no Zod dependency in the library).
- In `apps/web`, a small mapper function converts `CollectionEntry<'games'>` → `GameCardProps` right before passing it to the component in `index.astro`.
- Same pattern for `SocialFeed`: it takes a `fetchEndpoint` prop (default `/api/feed`) and does a plain `fetch()` — it has no idea the endpoint is an Astro server route.

This is the one discipline that makes the library actually reusable outside this specific Astro project later.

## 7. Storybook as the design system's catalog

Since the ask is specifically a *design system*, not just "components for one page": add Storybook to `packages/design-system`.

- One story per component, plus a `Tokens.stories` page rendering swatches for every color/font token (useful for catching accidental token drift).
- Stories double as the fastest way to iterate on the retro-punk effects (scanline, vignette, pixel grid) in isolation, without rebuilding the whole Astro page each time.
- Optional later step: Chromatic or Playwright screenshot tests per story for visual regression, if the studio wants that safety net.

## 8. Build tooling for the package

- **Bundler:** `tsup` (esbuild-based) — outputs ESM + `.d.ts`, fastest setup for a small component library, no need for Rollup's config surface here.
- **Package exports:** `"exports"` map in `package.json` splitting `.` (components) from `./tokens.css` (raw CSS) so Astro can import the stylesheet separately from the JS.
- **TypeScript:** `strict: true`, matching the Astro app; a shared `tsconfig.base.json` at the workspace root, extended by both packages.
- **Versioning:** Changesets, even at v0.x — gives you a changelog for free and is the standard path if you ever publish this to a private registry for a second site.

## 9. Updated build order (extends spec §12)

1. **Workspace scaffold** — `pnpm-workspace.yaml`, root `tsconfig.base.json`, empty `packages/design-system` + `apps/web`.
2. **Tokens + effects** — port `tokens.css`, build `PixelGrid`/`ScanlineOverlay`/`VignetteOverlay` first; confirm they render correctly in a Storybook story before touching real components.
3. **Static components** — `Badge`, `GameCardArchive`, `ServiceCard`, `DialogueBox` shells (no hooks yet). Verify Astro can render each with zero `client:*` and zero shipped JS (check the network tab).
4. **Interactive components + hooks** — `NavHUD` + `useInView`, `SocialFeed` + fetch/tab state, `VideoFacade`, cursor trail. Wire hydration directives per the table in §4.
5. **Content Collection mapping layer** — write the `CollectionEntry<'games'> → GameCardProps` mapper in `apps/web`; confirm the library still has zero Astro imports.
6. **Assemble `index.astro`** — same six sections as the original spec, now importing from `@teamstep/design-system`.
7. **Storybook polish + Changesets init** — write remaining stories, tag `v0.1.0`.
8. **SEO + deploy** — unchanged from original spec §11–12.

## 10. What stays exactly as in the original spec

- Content Collection schema (`src/content/config.ts`), the two game YAML files, and `zod` validation — all Astro-side, untouched.
- API routes (`bluesky.ts`, `substack.ts`, `feed.ts`) and the `UnifiedPost` type — stay server-side in `apps/web`, not in the library.
- Rendering strategy (`output: 'hybrid'`, Vercel adapter) — unchanged.
- Fonts, SEO/OG meta, JSON-LD — unchanged, still owned by `BaseLayout.astro`.

---

*This document is a companion to `teamstep-landing-spec.md` — read both before scaffolding.*
