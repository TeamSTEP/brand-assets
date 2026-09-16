import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortfolioCard } from "./PortfolioCard.js";

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='96'%3E%3Crect width='320' height='96' fill='%232a6070'/%3E%3C/svg%3E";

const meta: Meta<typeof PortfolioCard> = {
  title: "Services/PortfolioCard",
  component: PortfolioCard,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Brand Quest Hub",
    client: "Client",
    year: 2025,
    description: "Gamified onboarding experience for a product launch.",
    posterSrc: POSTER,
    posterAlt: "Brand Quest Hub",
    caseHref: "#",
  },
};
