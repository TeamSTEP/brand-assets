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
    (Story, context) => {
      const maxWidth = context.parameters.gameCardMaxWidth as number | undefined;
      return (
        <div
          style={{
            boxSizing: "border-box",
            width: "100%",
            padding: "var(--spacing-md)",
            background: "var(--color-background)",
            ...(maxWidth !== undefined ? { maxWidth } : null),
          }}
        >
          <Story />
        </div>
      );
    },
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

/** One-line body — baseline for thumb sizing beside short copy. */
export const ShortDescription: Story = {
  args: {
    title: "Witch One: Crucible",
    description: "A magic assassin adventure to save the kingdom.",
    status: "legacy",
    posterAlt: "Witch One: Crucible key art",
    cta: { icon: "download", label: "PLAY NOW", url: "https://teamstep.itch.io/witch-one-crucible" },
  },
};

/** Tall body — thumb scales with the text column (4:3), then caps and centers. */
export const VeryLongDescription: Story = {
  args: {
    title: "Witch One",
    description:
      "A 2D online hide-and-seek battle-royale game inspired by the asymmetric play of Dead by Daylight and the deception of Among Us. One player becomes the invisible Cursed One hunting the rest. This longer archive blurb is intentional: it must wrap across several lines so Storybook and visual tests prove the poster grows with the text column at 4:3, then caps and centers once the card outgrows the thumb max-height.",
    status: "legacy",
    posterAlt: "Witch One key art",
    cta: { icon: "gamepad", label: "PLAY THE ALPHA", url: "https://play.witchone.io/" },
  },
};

/** Mobile viewport width (390) — stacked CQ under 480. */
export const Narrow: Story = {
  parameters: {
    gameCardMaxWidth: 390,
  },
  args: {
    title: "Witch One: Crucible",
    description: "A magic assassin adventure. Shelved while Meltdown ships — but not forgotten.",
    status: "legacy",
    posterAlt: "Witch One: Crucible key art",
    cta: { icon: "download", label: "DOWNLOAD FREE · ITCH.IO", url: "https://teamstep.itch.io/witch-one-crucible" },
  },
};
