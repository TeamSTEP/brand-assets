---
"@teamstep/design-system": major
---

Hybrid-boot v3 alignment: `Boot` replaces `Hero` as the primary studio entrance (~60vh +
peek strip); `FeaturedStage` is the game-agnostic featured conversion stage (flat CTAs, no
PlatformAccess; `MeltdownStage` remains a deprecated alias); `QuestLog` groups compact
originals by phase; `PortfolioCard` adds teal portfolio chrome. Badge gains `released` /
`prototype` / `portfolio`. `GameCardArchiveStatus` breaks from `legacy | side-quest` to
`legacy | released | prototype`. BBSTerminal quiet mode makes `badge` optional and drops
API/WIDGET tab chrome. Shared `--layout-content-max` rail aligns Boot / FeaturedStage /
nav / QuestLog. `Hero`, `GameCardFeatured`, and `PlatformAccess` remain exported but
deprecated where noted. `--color-text-tertiary` remaps to `{color.muted}` so QuestLog
group labels meet WCAG AA (mid stays the border primitive).
