import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameCardArchive } from "./GameCardArchive.js";

// 96x72 solid-fill placeholder — stories don't ship real game art; consumers pass a real
// poster URL from their own asset pipeline.
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='72'%3E%3Crect width='96' height='72' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof GameCardArchive> = {
  title: "Quest Log/GameCardArchive",
  component: GameCardArchive,
  decorators: [
    // Width tracks the page viewport (capped at a realistic single-column max) instead of a
    // fixed size, so the mobile/tablet/desktop Playwright viewports actually exercise the
    // component's container-query fluid sizing instead of all rendering identically.
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

export const SideQuest: Story = {
  args: {
    title: "Signal Lost",
    description: "A short, free side-project built between Meltdown milestones.",
    status: "side-quest",
    posterAlt: "Signal Lost key art",
    cta: { icon: "download", label: "DOWNLOAD FREE · ITCH.IO", url: "https://teamstep.itch.io/signal-lost" },
  },
};

// Container queries respond to the card's own rendered width, not the page viewport — a
// single isolated card is wide enough to hit the side-by-side layout (≥480px) at every
// Playwright viewport (390–1280px) tested on the default stories. This story forces a
// sub-480px container so the stacked thumb-above-body layout (and fluid type/thumb sizing)
// stays covered independent of that viewport/container mismatch.
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
