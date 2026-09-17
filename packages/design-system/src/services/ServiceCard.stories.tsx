import type { Meta, StoryObj } from "@storybook/react-vite";
import { ServiceCard } from "./ServiceCard.js";

// Placeholder icon — consumers pass their own.
const PlaceholderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const meta: Meta<typeof ServiceCard> = {
  title: "Services/ServiceCard",
  component: ServiceCard,
  decorators: [
    // Fluid width so Playwright viewports exercise CQ sizing.
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

// Narrow container to cover compact CQ sizing.
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
