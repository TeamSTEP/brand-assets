# @teamstep/design-system

## 1.0.0

### Major Changes

- a0cb891: Hybrid-boot v3 alignment: `Boot` replaces `Hero` as the primary studio entrance (~60vh +
  peek strip); `FeaturedStage` is the game-agnostic featured conversion stage (flat CTAs, no
  PlatformAccess; `MeltdownStage` remains a deprecated alias); `QuestLog` groups compact
  originals by phase; `PortfolioCard` adds teal portfolio chrome. Badge gains `released` /
  `prototype` / `portfolio`. `GameCardArchiveStatus` breaks from `legacy | side-quest` to
  `legacy | released | prototype`. BBSTerminal quiet mode makes `badge` optional and drops
  API/WIDGET tab chrome. Shared `--layout-content-max` rail aligns Boot / FeaturedStage /
  nav / QuestLog. `Hero`, `GameCardFeatured`, and `PlatformAccess` remain exported but
  deprecated where noted. `--color-text-tertiary` remaps to `{color.muted}` so QuestLog
  group labels meet WCAG AA (mid stays the border primitive).

### Minor Changes

- a0cb891: Raise the wide-desktop content ceiling: components stopped growing past a ~1280px
  container, so a 1920px+ monitor rendered pixel-identical to a 1280px laptop screen with
  large empty gutters and small type. Hero/Footer/NavDesktop's `max-width` moves from
  1280px to 1600px, DialogueBox's from 380px to 640px, and every `font-size: clamp()`
  ceiling across Hero, Footer, NavDesktop, Quest Log (GameCardFeatured/GameCardArchive/
  PlatformAccess/Badge), Services (ServiceCard/ServiceInspectPanel), BBS Board
  (BBSTerminal/SocialFeed/BBSPanelAPI), Cta, and IconButton is raised roughly 20-25%,
  along with the icon/avatar/logo dimensions that sit next to that text. No prop or
  component API changes — visual only. Visual-regression baselines will need
  regenerating via `design-system-ci.yml`'s `workflow_dispatch` (never locally, per this
  repo's own CI comments) before merge.

## 0.5.1

### Patch Changes

- f20e02e: Stack GameCardArchive thumbnail above body below 480px container width, matching GameCardFeatured.

## 0.5.0

### Minor Changes

- 1738162: Replace in-text glyphs with typed SVG icons on Cta and IconButton so consumers pass text-only labels.

## 0.4.0

### Minor Changes

- b2d2c17: Add BrandIcon, BrandTitle, and BrandLogo. Wire BrandIcon into Footer/NavDesktop and BrandLogo into Hero (replacing the text wordmark); drop logo URL props from Footer and NavDesktop.

## 0.3.0

### Minor Changes

- 4c2b3e2: Introduce the primitives tier (`IconButton`, `Card`) and relocate `Cta` from `src/ui/` to `src/primitives/`. Migrate duplicated card surfaces and icon-only buttons across feature components onto the new primitives.

## 0.2.0

### Minor Changes

- c86ec05: Initial publishable release: 22 components (effects, quest-log, services, manifesto, hero,
  footer, nav, bbs, ui), full primitive/semantic token tiers, closed-API governance (stylelint
  `declaration-strict-value`, `teamstep/no-style-passthrough`, `check-api` release tagging), and
  the companion `@teamstep/eslint-plugin` / `@teamstep/stylelint-config` packages for consuming
  repos.

### Patch Changes

- c86ec05: Self-host the brand fonts (Rajdhani, Nunito, Barlow Condensed) via `@fontsource` instead of
  only referencing their names in `tokens.css`. Previously nothing ever loaded these fonts, so
  every consumer silently fell back to whatever generic sans-serif the host OS/browser happened
  to substitute — invisible in casual review, but non-deterministic across environments, which is
  what was breaking the Playwright visual-regression baselines in CI. Text-bearing components now
  render with the actual brand typeface everywhere, including in this repo's own Storybook/tests.

## 0.1.0

### Minor Changes

- 3808d73: Initial public release: design system package plus companion ESLint and Stylelint presets for consuming repos.
