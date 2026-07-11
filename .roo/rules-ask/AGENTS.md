# Ask Mode Rules (Non-Obvious Only)

- **This repo is design system only** — no Astro/Next.js app lives here. Storybook is the whole deliverable. Consumer apps (e.g. the Astro landing site) are in separate repos.
- **`brand-assets/` is not part of the pnpm workspace** — it contains raw logo files and `Team_STEP_Branding_Guidelines_2024.pdf`. The workspace root is the repo root itself, and only `packages/*` are in the workspace.
- **Source of truth for visual language**: `teamstep-landing-spec.md` and `teamstep-react-design-system-proposal.md` (original design decisions). CLAUDE.md/AGENTS.md document enforcement mechanisms, not token values.
- **Consumer documentation** is in [`packages/CONSUMER.md`](packages/CONSUMER.md:1) — covers GitHub Packages auth, installation, Astro integration, hydration directives, ESLint/stylelint setup, and content mapping patterns.
- **`@teamstep/design-system` publishes to GitHub Packages**, not npmjs.com. Consumers need `@teamstep:registry=https://npm.pkg.github.com` in their `.npmrc`.
- **Components are documented via Storybook stories**, not a separate docs site. Each component has a `*.stories.tsx` file that serves as both dev playground and documentation.
- **Token system is three-tier DTCG**: `primitive.json` → `semantic.json` → `component.json`. Primitive tokens are raw values; semantic tokens are purpose-named aliases; component tier is reserved for component-specific tokens (currently empty).
- **`components/` directory does not exist** — components live directly under `src/` grouped by domain: `hero/`, `footer/`, `nav/`, `bbs/`, `quest-log/`, `services/`, `manifesto/`, `ui/`, `effects/`, `hooks/`.
- **Three custom hooks are exported**: `useInView`, `useTypewriter`, `useIdleFloat`. Plus internal `usePrefersReducedMotion`.
- **`motion` (Framer Motion fork) is a peer dependency** — consumers install it separately. It powers Hero logo float and DialogueBox animations.
