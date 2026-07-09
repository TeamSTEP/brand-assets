# Team STEP — Landing Page Project Specification

> Handoff document for implementation. Covers design system, page structure, component architecture, data model, and API integrations. Read in full before writing any code.

---

## 1. Project Overview

**Studio:** Team STEP — indie game studio  
**Output:** Single-page marketing site (landing page)  
**Stack:** Astro 5 · TypeScript (strict) · Plain CSS · Motion One · Vercel (hybrid)  
**Primary goals:**
- Feature Meltdown Steam release as the main conversion target (demo play + wishlist)
- Communicate studio identity, vision, and outsourcing services
- Surface live social content (Bluesky, Substack, YouTube, Discord)
- Feel like a mini game — interactive, animated, retro-punk — without obscuring content

---

## 2. Brand & Design System

### 2.1 Colour Tokens

Define all of the following as CSS custom properties in `src/styles/tokens.css`.

```css
/* Brand foundation */
--color-void:    #231630; /* page background — always dark */
--color-shadow:  #2d1e3e;
--color-mid:     #4F476D;
--color-muted:   #7274A2;
--color-accent:  #8591C9; /* primary lilac */
--color-ice:     #E9F1F2; /* near-white text */

/* Game-world accents */
--color-green:    #3C7A45; /* Meltdown / main-quest */
--color-green-hi: #5CBA6A;
--color-amber:    #9a6a18; /* coming-soon / in-dev */
--color-amber-hi: #D4A830;
--color-blood:    #6B2020; /* Witch One */
--color-blood-hi: #C94040;

/* UI chrome */
--color-teal:    #2a6070;
--color-teal-hi: #4A9BAF;
```

**Rules:**
- Background is always `--color-void` or darker. Never light backgrounds.
- Logo must always sit on a background darker than itself.
- Game accents (green, blood) are used only within their respective game card scope.
- Gradient (`--color-accent` → `--color-muted`) used subtly and sparingly.

### 2.2 Typography

Self-host all fonts in `/public/fonts/`. Use `font-display: swap`.

| Role | Brand font | Web equivalent | Usage |
|---|---|---|---|
| Headings / wordmark | Carbon | **Rajdhani Bold** | Uppercase only, section titles, hero |
| Subtitles / italic accent | Acumin | **Nunito Italic** | Taglines, secondary labels |
| Body / UI text | Bahnschrift | **Barlow Condensed** | Body copy, BBS feed, badges |

### 2.3 Corner Radius Rule

**Top-left + bottom-right corners only.** Never all four.  
Apply via: `border-radius: 2px 12px 2px 12px` (scale values by component size).  
This mirrors the logo's geometry. Apply consistently to cards, CTAs, and badges.

### 2.4 Key Effects (defined in `src/styles/effects.css`)

**Pixel grid background:**
```css
background-image:
  repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(79,71,109,0.12) 20px),
  repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(79,71,109,0.12) 20px);
```

**Scanline overlay** (non-interactive `position: absolute` div, `pointer-events: none`):
```css
background: repeating-linear-gradient(
  0deg, transparent, transparent 2px,
  rgba(10,8,24,0.10) 2px, rgba(10,8,24,0.10) 4px
);
```

**Vignette overlay** (same wrapper as scanline):
```css
background: radial-gradient(ellipse at center, transparent 55%, rgba(6,6,16,0.7) 100%);
```

### 2.5 CTA Hierarchy

| Type | Style | Use case |
|---|---|---|
| Primary | Green fill + border, `--color-green` | Demo play CTA |
| Secondary | Amber border only, `--color-amber-hi` text | Wishlist CTA |
| Ghost | Dark border, muted text | Archive cards, secondary links |

---

## 3. Page Structure

Single scroll page. Six sections. Section IDs used for HUD navigation.

```
#hero → #quest-log → #bbs-board → #manifesto → #services → #footer
```

### Section 01 — Hero `#hero`
- **Height:** 80vh (not 100vh — leaves a peek of Quest Board above fold)
- **Layout:** 60/40 split. Left: eyebrow italic, H1 "TEAM STEP", tagline, single ghost CTA "▶ ENTER THE GUILD", scroll indicator. Right: logo mark with animated idle float ring.
- **Background:** `--color-void` + pixel grid overlay
- **Mobile:** Logo mark removed. H1 scales to 40px. "Tap anywhere to explore" replaces scroll indicator.
- **Note:** "Enter the Guild" is the studio ambient CTA — not a game CTA. Game conversion happens in Section 02.

### Section 02 — Quest Log `#quest-log`
- **Content:** All games from the Content Collection, sorted by `sortOrder`
- **Featured card** (`status: main-quest`): Full-width, green top border, badges, key art / looping WebM, description, Platform Access panel
- **Archive row** (`status: legacy` / `side-quest`): Horizontal card, 60% opacity, single ghost CTA
- **Mobile:** Featured card stacks vertically. Archive row below. Platform Access panel always visible (not behind hover).

### Section 03 — BBS Board `#bbs-board`
- **Background:** `#060610` (deepest)
- **Interaction:** Tab switching (desktop: F-key labels; mobile: short pill labels + swipe)
- **Platforms:** Bluesky [API], Substack [API], YouTube [API], Discord [iframe]
- **Chrome:** Terminal window with dot buttons, title bar, status badge (`API` vs `WIDGET`), scanline + vignette overlay on all panels
- **Discord panel:** `filter: brightness(0.85) saturate(0.65) hue-rotate(225deg)` on the `<iframe>` element directly. Scanline overlay sits on top. Test in Safari.

### Section 04 — Manifesto `#manifesto`
- **Background:** `--color-void` full bleed
- **Layout:** Large uppercase display text (48px, Carbon-equivalent), centred. Below it: NPC dialogue box with logo mark as speaker avatar, mission text inside.
- **Animation:** Typewriter effect on dialogue text, triggered on first scroll into view.
- **Brand values to include:** "Creativity is a human right." · "One step at a time." · "Building the home for the indie game world."

### Section 05 — Services / Inventory `#services`
- **Layout:** 3-column grid (desktop) · 2-column max with odd card spanning full width (mobile)
- **Services:** Game Development · Gamification · Visual Art
- **Interaction:** Click "INSPECT ITEM ↗" → slide-up modal (desktop) or bottom sheet (mobile) with full description + contact CTA
- **Footer CTA:** "GET IN TOUCH →" centred below grid, amber border style

### Section 06 — Footer / Credits `#footer`
- **Background:** `--color-void` blending to near-black
- **Layout:** Centred logo mark, studio name, tagline, social icon links (Bluesky, Substack, YouTube, Discord)
- **Aesthetic:** End-credits screen

---

## 4. Navigation

### Desktop — Sticky Top Bar
- 64px height · transparent → frosted glass (`--color-void` at 80% opacity + `backdrop-filter: blur`) on scroll
- Left: logo · Centre: anchor links (HOME, GAMES, FEED, WORK) · Right: ghost CTA "CONTACT"

### Mobile — Bottom HUD
- Replaces hamburger entirely
- 4 items: HOME · GAMES · FEED · WORK
- 44px minimum tap targets, labels always visible
- Active item shows a small lilac dot indicator
- Active state driven by `IntersectionObserver` on each section (`src/scripts/hud.ts`)

---

## 5. Game Card Data Model

### 5.1 Content Collection Schema — `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content'

const games = defineCollection({
  type: 'data',
  schema: z.object({
    title:       z.string(),
    slug:        z.string(),
    subtitle:    z.string(),
    description: z.string(),
    status:      z.enum(['main-quest', 'side-quest', 'legacy']),
    sortOrder:   z.number(),
    platforms: z.array(z.object({
      platform:  z.enum(['steam', 'itch', 'gog', 'epic', 'browser']),
      tier:      z.enum(['demo', 'full', 'free', 'dlc']),
      label:     z.string(),
      url:       z.string().url(),
      available: z.boolean(), // false = renders as "Coming Soon"
    })),
    media: z.object({
      poster:  z.string(),           // /games/{slug}/poster.webp
      loop:    z.string().optional(),// /games/{slug}/gameplay.webm
      trailer: z.string().url().optional(), // YouTube URL
    }),
  }),
})

export const collections = { games }
```

### 5.2 Current Game Entries

**`src/content/games/meltdown.yaml`**
```yaml
title:       Meltdown
slug:        meltdown
subtitle:    Nuclear Reactor Simulator
description: >
  Manage an overworked reactor. Keep the city powered.
  Try not to cause a meltdown. The full Steam release is coming.
status:      main-quest
sortOrder:   1

platforms:
  - platform:  itch
    tier:      demo
    label:     Play free in browser
    url:       https://teamstep.itch.io/meltdown
    available: true

  - platform:  steam
    tier:      demo
    label:     Play Steam Demo
    url:       https://store.steampowered.com/app/4561950/Meltdown_Demo/
    available: true

  - platform:  steam
    tier:      full
    label:     Wishlist full release
    url:       https://store.steampowered.com/app/4561950/Meltdown_Demo/
    available: false   # flip to true on full release

media:
  poster:  /games/meltdown/poster.webp
  loop:    /games/meltdown/gameplay.webm
  trailer: # add YouTube URL when available
```

**`src/content/games/witch-one.yaml`**
```yaml
title:       "Witch One: Crucible"
slug:        witch-one-crucible
subtitle:    Action Roguelite
description: >
  A magic assassin adventure. Shelved while Meltdown ships — but not forgotten.
status:      legacy
sortOrder:   2

platforms:
  - platform:  itch
    tier:      free
    label:     Download free
    url:       https://teamstep.itch.io/witch-one-crucible
    available: true

media:
  poster: /games/witch-one/poster.webp
```

### 5.3 Platform Access Component Logic

```typescript
// Derived inside PlatformAccess.astro from platforms[]
const available = platforms.filter(p => p.available)  // → green "Playable Now" pills
const coming    = platforms.filter(p => !p.available) // → amber "Coming Soon" pills
// Each section hides entirely if its array is empty — no empty states
```

### 5.4 Status → Visual Mapping

| `status` | Card type | Opacity | Border | Badge |
|---|---|---|---|---|
| `main-quest` | `GameCardFeatured` | 100% | Green top `2px` | MAIN QUEST (pulse dot) |
| `side-quest` | `GameCardArchive` | 100% | Default | SIDE QUEST |
| `legacy` | `GameCardArchive` | 60% | Default | LEGACY (no pulse) |

---

## 6. Social Feed API Integrations

All three API sources share a `UnifiedPost` interface. Discord is iframe-only.

### 6.1 UnifiedPost Type

```typescript
// src/lib/feed.ts
export interface UnifiedPost {
  platform: 'bluesky' | 'substack' | 'youtube'
  id:       string
  author:   string
  text:     string
  url:      string
  date:     string  // ISO 8601
  thumb?:   string  // YouTube only
}
```

### 6.2 Bluesky — AT Protocol (no auth required)

```typescript
// src/lib/bluesky.ts
const BASE   = 'https://public.api.bsky.app/xrpc'
const HANDLE = 'teamstep.bsky.social'

export async function fetchBluesky(): Promise<UnifiedPost[]> {
  const res  = await fetch(`${BASE}/app.bsky.feed.getAuthorFeed?actor=${HANDLE}&limit=10`)
  const { feed } = await res.json()
  return feed.map(({ post }: any) => ({
    platform: 'bluesky',
    id:       post.cid,
    author:   post.author.handle,
    text:     post.record.text,
    url:      `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`,
    date:     post.record.createdAt,
  }))
}
```

### 6.3 Substack — RSS (no auth required)

```typescript
// src/lib/substack.ts — same pattern for youtube.ts
// YouTube RSS: https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}
import { XMLParser } from 'fast-xml-parser'

const RSS = 'https://teamstep.substack.com/feed'

export async function fetchSubstack(): Promise<UnifiedPost[]> {
  const xml  = await fetch(RSS).then(r => r.text())
  const data = new XMLParser().parse(xml)
  const items = data.rss.channel.item.slice(0, 5)
  return items.map((item: any) => ({
    platform: 'substack',
    id:       item.guid,
    author:   'Team STEP',
    text:     item.title,
    url:      item.link,
    date:     item.pubDate,
  }))
}
```

### 6.4 Server Endpoint — `src/pages/api/feed.ts`

```typescript
export const prerender = false  // server-rendered, not static

export async function GET({ url }: APIContext) {
  const platform = url.searchParams.get('platform')
  let posts: UnifiedPost[] = []

  if (platform === 'bluesky')  posts = await fetchBluesky()
  if (platform === 'substack') posts = await fetchSubstack()
  if (platform === 'youtube')  posts = await fetchYouTube()

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  })
}
```

### 6.5 Discord — iframe

```html
<!-- BBSPanelIframe.astro -->
<div class="iframe-wrap">
  <iframe
    src="https://discord.com/widget?id={SERVER_ID}&theme=dark"
    style="filter: brightness(0.85) saturate(0.65) hue-rotate(225deg)"
    loading="lazy"
    title="Team STEP Discord server"
  />
  <div class="scanline" aria-hidden="true"></div>
  <div class="vignette" aria-hidden="true"></div>
</div>
```

---

## 7. Component Map

| Component | Type | Notes |
|---|---|---|
| `BaseLayout.astro` | Layout | Head, fonts, OG meta, JSON-LD, global CSS |
| `NavDesktop.astro` | Static | Sticky top bar, anchor links |
| `NavHUD.astro` | Static + `hud.ts` | Mobile bottom HUD, IntersectionObserver active state |
| `Hero.astro` | Static | Pixel grid, logo mark, ghost CTA |
| `QuestBoard.astro` | Static | Fetches + sorts Content Collection |
| `GameCardFeatured.astro` | Static | Featured game layout, receives `CollectionEntry<'games'>` |
| `GameCardArchive.astro` | Static | Archive layout, reduced opacity |
| `PlatformAccess.astro` | Static | Splits `platforms[]` into available/coming arrays |
| `Badge.astro` | Static | Accepts `variant` prop → maps to colour + label + pulse |
| `VideoFacade.astro` | Static + inline JS | Poster + autoplay WebM; swaps to YouTube iframe on click |
| `SocialFeed.astro` | Island (`client:load`) | Fetches `/api/feed`, tab switching, caches per-platform in `Map` |
| `BBSTerminal.astro` | Static | Terminal chrome, tabs, scanline/vignette |
| `BBSPanelAPI.astro` | Static | Receives `UnifiedPost[]`, renders branded mono feed |
| `BBSPanelIframe.astro` | Static | CSS-filtered Discord iframe |
| `DialogueBox.astro` | Static | NPC dialogue style, used in Manifesto |
| `ServiceCard.astro` | Static | Inventory card, click triggers bottom sheet / modal |

---

## 8. Client Scripts

All in `src/scripts/`. Vanilla TypeScript — no framework.

| File | Responsibility |
|---|---|
| `animations.ts` | Motion One scroll-triggered boot-in per section (glitch title 150ms → content fade 200ms). Logo idle float. Wrap all in `prefers-reduced-motion: none`. |
| `cursor.ts` | Pixel trail custom cursor. Guard with `window.matchMedia('(pointer: coarse)')` — skip entirely on touch devices. |
| `hud.ts` | `IntersectionObserver` on each `[data-section]` element. Updates active HUD item on mobile. |
| `bbs.ts` | BBS tab switching. Lazy-fetches `/api/feed?platform=X` on tab click. Caches results in a `Map` for the session. |

---

## 9. Rendering Strategy

```
output: 'hybrid'  (astro.config.mjs)
adapter: @astrojs/vercel/serverless
```

| Route | Rendering | Reason |
|---|---|---|
| `index.astro` | Static (build time) | All content except social feed |
| `/api/feed.ts` | Server (`prerender: false`) | Live social data, 5-min cache |
| `SocialFeed` island | Client hydrated | Tab switching + on-demand fetch |

---

## 10. Project Setup

### Install
```bash
# Scaffold
npm create astro@latest teamstep-web -- --template minimal --typescript strict

# Adapters + integrations
npx astro add vercel sitemap

# Runtime dependencies
npm install motion fast-xml-parser
```

### Dependencies

| Package | Purpose |
|---|---|
| `astro@5` | Framework, Content Collections, image optimisation |
| `@astrojs/vercel` | Hybrid adapter for serverless API routes |
| `motion` | Scroll animations, ~18KB, wraps Web Animations API |
| `fast-xml-parser` | RSS XML parsing in Node (avoid DOMParser in server routes) |
| `zod` | Schema validation, bundled with Astro |
| `@astrojs/sitemap` | Auto-generates sitemap.xml at build |
| `sharp` | Astro `<Image>` peer dep — WebP + srcset at build time |

### Environment Variables
```bash
# .env
PUBLIC_DISCORD_SERVER_ID=   # Discord server ID for widget embed
YOUTUBE_CHANNEL_ID=          # For YouTube RSS feed
# No secret API keys needed — all feeds are public
```

### Directory skeleton
```
src/
  content/config.ts
  content/games/*.yaml
  pages/index.astro
  pages/api/feed.ts
  layouts/BaseLayout.astro
  components/
    sections/   Hero · QuestBoard · SocialFeed · Manifesto · Services
    game/       GameCardFeatured · GameCardArchive · PlatformAccess
    bbs/        BBSTerminal · BBSPanelAPI · BBSPanelIframe
    ui/         Badge · VideoFacade · ServiceCard · DialogueBox
    nav/        NavDesktop · NavHUD
  lib/          bluesky.ts · substack.ts · youtube.ts · feed.ts
  scripts/      animations.ts · cursor.ts · hud.ts · bbs.ts
  styles/       tokens.css · global.css · effects.css
public/
  fonts/        Rajdhani · Nunito · Barlow Condensed (self-hosted)
  games/meltdown/  poster.webp · gameplay.webm
  games/witch-one/ poster.webp
  og/default.png
```

---

## 11. SEO

Add to `BaseLayout.astro` `<head>`:

```html
<meta property="og:title"       content={title} />
<meta property="og:description" content={description} />
<meta property="og:image"       content="/og/default.png" />
<meta name="twitter:card"       content="summary_large_image" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Team STEP",
  "url": "https://teamstep.gg",
  "sameAs": [
    "https://bsky.app/profile/teamstep.bsky.social",
    "https://teamstep.itch.io",
    "https://teamstep.substack.com",
    "https://discord.gg/JPUaPmQvSZ"
  ]
}
</script>
```

---

## 12. Build Order

Work through this sequentially. Each step unblocks the next.

1. **Scaffold + design tokens** — Install, create `tokens.css` with all CSS custom properties, self-host fonts, wire `BaseLayout`. Confirm dark background renders.
2. **Content Collection** — Write `config.ts` schema, create both YAML files, run `astro dev`, confirm no type errors.
3. **QuestBoard + game cards** — Build `GameCardFeatured`, `GameCardArchive`, `PlatformAccess`, `Badge` using real YAML data. This is the most critical section — get it right before proceeding.
4. **Static sections** — Hero, Manifesto, Services, Footer, NavDesktop, NavHUD. Wire into `index.astro`.
5. **VideoFacade + game assets** — Convert GIFs to WebM (`ffmpeg -i input.gif -c:v libvpx-vp9 -b:v 0 -crf 33 output.webm`). Wire into Meltdown card. Test lazy YouTube iframe on click.
6. **Social feed** — Write `src/lib/` fetchers, build `/api/feed.ts`, test locally. Build BBS components. Wire `SocialFeed` as `client:load` island. Discord iframe last — test CSS filter in Chrome **and** Safari.
7. **Animations + scripts** — `animations.ts` (Motion scroll triggers), `cursor.ts` (desktop only, check pointer media query), `hud.ts` (IntersectionObserver). All wrapped in `prefers-reduced-motion: none`.
8. **SEO + deploy** — OG meta, JSON-LD, `astro build`, connect to Vercel, confirm `/api/feed` runs as serverless function.

---

*Document version: 1.0 — reflects all design decisions made in the Team STEP design session.*
