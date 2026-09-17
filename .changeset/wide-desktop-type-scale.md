---
"@teamstep/design-system": minor
---

Raise the wide-desktop content ceiling: components stopped growing past a ~1280px
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
