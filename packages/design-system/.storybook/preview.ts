import type { Preview } from "@storybook/react-vite";
import "../src/tokens/tokens.css";
import "../src/fonts.css";

const preview: Preview = {
  parameters: {
    // Addon auto-scan races Playwright's AxeBuilder ("Axe is already running"); CI gate is Playwright.
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
