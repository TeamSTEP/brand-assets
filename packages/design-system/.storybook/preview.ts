import type { Preview } from "@storybook/react-vite";
import "../src/tokens/tokens.css";
import "../src/fonts.css";

// Matches the wireframe's desktop/mobile breakpoints (teamstep_final_wireframe_v2.html) —
// every story gets checked at these three widths before merge, per CLAUDE.md step 6.
const preview: Preview = {
  parameters: {
    // @storybook/addon-a11y runs its own automatic axe-core scan on every story render
    // (afterEach hook) independent of anything in tests/stories.visual.spec.ts. That collides
    // with this repo's actual a11y gate — @axe-core/playwright's AxeBuilder, invoked directly
    // against the same iframe.html document in the Playwright suite — because axe-core refuses
    // concurrent runs in one document: "Axe is already running." 'off' here only stops the
    // addon's *automatic* per-render scan; the interactive Accessibility panel in dev Storybook
    // still works for manual, on-demand checks. The Playwright-driven scan remains the one
    // enforced in CI (see stories.visual.spec.ts for why it, not this addon, is the gate).
    a11y: { test: "off" },
    viewport: {
      options: {
        mobile: {
          name: "Mobile — 390px",
          styles: { width: "390px", height: "844px" },
        },
        tablet: {
          name: "Tablet — 768px",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop — 1280px",
          styles: { width: "1280px", height: "800px" },
        },
      },
    },
  },
};

export default preview;
