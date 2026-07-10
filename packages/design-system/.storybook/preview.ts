import type { Preview } from "@storybook/react-vite";
import "../src/tokens/tokens.css";
import "../src/fonts.css";

// Matches the wireframe's desktop/mobile breakpoints (teamstep_final_wireframe_v2.html) —
// every story gets checked at these three widths before merge, per CLAUDE.md step 6.
const preview: Preview = {
  parameters: {
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
