import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameCardArchive } from "./GameCardArchive.js";

// Placeholder art — consumers pass a real poster URL.
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='72'%3E%3Crect width='96' height='72' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof GameCardArchive> = {
  title: "Quest Log/GameCardArchive",
  component: GameCardArchive,
  decorators: [
    // Fluid width so Playwright viewports exercise CQ sizing.
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: "100%", maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    posterSrc: PLACEHOLDER_POSTER,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Legacy: Story = {
  args: {
    title: "Witch One: Crucible",
    description: "A magic assassin adventure. Shelved while Meltdown ships — but not forgotten.",
    status: "legacy",
    posterAlt: "Witch One: Crucible key art",
    cta: { icon: "download", label: "DOWNLOAD FREE · ITCH.IO", url: "https://teamstep.itch.io/witch-one-crucible" },
  },
};

export const Released: Story = {
  args: {
    title: "Signal Drift",
    description: "Placeholder released title — playable on storefronts.",
    status: "released",
    posterAlt: "Signal Drift key art",
    cta: { icon: "gamepad", label: "PLAY ON STEAM", url: "https://store.steampowered.com/" },
  },
};

export const Prototype: Story = {
  args: {
    title: "Project Helix",
    description: "Active experiment — follow or play the latest build.",
    status: "prototype",
    posterAlt: "Project Helix key art",
    cta: { icon: "hexagon", label: "PLAY BUILD", url: "https://teamstep.itch.io/" },
  },
};

// Sub-480px container to cover stacked CQ layout.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: 200 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Witch One: Crucible",
    description: "A magic assassin adventure. Shelved while Meltdown ships — but not forgotten.",
    status: "legacy",
    posterAlt: "Witch One: Crucible key art",
    cta: { icon: "download", label: "DOWNLOAD FREE · ITCH.IO", url: "https://teamstep.itch.io/witch-one-crucible" },
  },
};
