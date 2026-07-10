import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameCardFeatured } from "./GameCardFeatured.js";

// Stories don't ship real game art; consumers pass a real poster/VideoFacade.
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof GameCardFeatured> = {
  title: "Quest Log/GameCardFeatured",
  component: GameCardFeatured,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    media: <img src={PLACEHOLDER_POSTER} alt="Meltdown key art" />,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Meltdown's real data (teamstep-landing-spec.md §5.2): a "full" tier entry exists and
// isn't available yet, so the "IN DEVELOPMENT" badge shows alongside "MAIN QUEST".
export const Default: Story = {
  args: {
    title: "Meltdown",
    subtitle: "Nuclear Reactor Simulator",
    description:
      "Manage an overworked reactor. Keep the city powered. Try not to cause a meltdown. The full Steam release is coming.",
    platforms: [
      { platform: "itch", tier: "demo", label: "🎮 PLAY IN BROWSER · ITCH.IO", url: "https://teamstep.itch.io/meltdown", available: true },
      {
        platform: "steam",
        tier: "demo",
        label: "⬡ PLAY STEAM DEMO",
        url: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
        available: true,
      },
      {
        platform: "steam",
        tier: "full",
        label: "⬡ WISHLIST FULL RELEASE · STEAM",
        url: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
        available: false,
      },
    ],
  },
};

// No "full" tier entry pending release, so no "IN DEVELOPMENT" badge — a fully-shipped
// main-quest game would look like this.
export const FullyReleased: Story = {
  args: {
    title: "Meltdown",
    subtitle: "Nuclear Reactor Simulator",
    description: "Manage an overworked reactor. Keep the city powered. Try not to cause a meltdown.",
    platforms: [
      {
        platform: "steam",
        tier: "full",
        label: "⬡ BUY ON STEAM",
        url: "https://store.steampowered.com/app/4561950/",
        available: true,
      },
    ],
  },
};

// Container queries respond to the card's own rendered width, not the page viewport — see
// the same note on the other components' Narrow stories. Below the 480px container
// breakpoint the body stacks vertically per the spec's mobile layout note.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Meltdown",
    subtitle: "Nuclear Reactor Simulator",
    description:
      "Manage an overworked reactor. Keep the city powered. Try not to cause a meltdown. The full Steam release is coming.",
    platforms: [
      { platform: "itch", tier: "demo", label: "🎮 PLAY IN BROWSER · ITCH.IO", url: "https://teamstep.itch.io/meltdown", available: true },
      {
        platform: "steam",
        tier: "full",
        label: "⬡ WISHLIST FULL RELEASE · STEAM",
        url: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
        available: false,
      },
    ],
  },
};
