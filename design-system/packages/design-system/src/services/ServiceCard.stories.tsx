import type { Meta, StoryObj } from "@storybook/react-vite";
import { ServiceCard } from "./ServiceCard.js";

// Stand-in icon — consumers pass their own icon per service; the design system
// doesn't ship a fixed icon set.
const PlaceholderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const meta: Meta<typeof ServiceCard> = {
  title: "Services/ServiceCard",
  component: ServiceCard,
  decorators: [
    // Width tracks the page viewport (capped at a realistic single grid-cell max) instead of
    // a fixed size, so the mobile/tablet/desktop Playwright viewports actually exercise the
    // component's container-query fluid sizing instead of all rendering identically.
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: "100%", maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    icon: <PlaceholderIcon />,
    onInspect: () => {
      console.log("inspect clicked");
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const GameDevelopment: Story = {
  args: {
    title: "Game Development",
    description: "Full-cycle production, from prototype to shipped Steam release.",
  },
};

export const Gamification: Story = {
  args: {
    title: "Gamification",
    description: "Turn existing products into engaging, game-like experiences.",
  },
};

export const VisualArt: Story = {
  args: {
    title: "Visual Art",
    description: "Key art, UI art, and animation in the Team STEP house style.",
  },
};

// Container queries respond to the card's own rendered width, not the page viewport — a
// single isolated card is wide enough to hit the fluid sizing's max at every Playwright
// viewport (390–1280px) tested here. This story proves the compact end of the range (icon/
// title/description all shrink) independent of that viewport/container mismatch.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: 160 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Game Development",
    description: "Full-cycle production, from prototype to shipped Steam release.",
  },
};
