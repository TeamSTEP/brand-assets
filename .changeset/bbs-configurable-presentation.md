---
"@teamstep/design-system": minor
---

Add platform-free BBS list primitives (`BBSItem`, `BBSList`, `BBSListItem`) and require `tabListLabel` on `BBSTerminal` with keyboard/manual tab activation. `BBSPanelIframe` now takes a consumer-built `src` (replaces Discord-only `serverId`). Deprecate `SocialFeed`, `BBSPanelAPI`, `UnifiedPost`, and `FeedPlatform` in favor of app-owned feeds; removals deferred to a future major. Deprecated `BBSPanelAPI` / `SocialFeed` now adapt onto `BBSList`; CRT overlays and panel child layout are owned solely by `BBSTerminal`. Animated CRT scanlines also cover game-card / FeaturedStage media thumbs. BBS list item titles use chrome teal (WCAG AA) instead of game blood.
