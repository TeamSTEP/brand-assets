import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlatformAccess } from "./PlatformAccess.js";

const meta: Meta<typeof PlatformAccess> = {
  title: "Quest Log/PlatformAccess",
  component: PlatformAccess,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: "100%", maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Meltdown's real platform data (teamstep-landing-spec.md §5.2): both sections present.
export const BothSections: Story = {
  args: {
    platforms: [
      {
        platform: "itch",
        tier: "demo",
        label: "PLAY IN BROWSER · ITCH.IO",
        url: "https://teamstep.itch.io/meltdown",
        available: true,
      },
      {
        platform: "steam",
        tier: "demo",
        label: "PLAY STEAM DEMO",
        url: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
        available: true,
      },
      {
        platform: "steam",
        tier: "full",
        label: "WISHLIST FULL RELEASE · STEAM",
        url: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
        available: false,
      },
    ],
  },
};

export const AvailableOnly: Story = {
  args: {
    platforms: [
      {
        platform: "itch",
        tier: "free",
        label: "DOWNLOAD FREE · ITCH.IO",
        url: "https://teamstep.itch.io/witch-one-crucible",
        available: true,
      },
    ],
  },
};

export const ComingSoonOnly: Story = {
  args: {
    platforms: [
      {
        platform: "steam",
        tier: "full",
        label: "WISHLIST · STEAM",
        url: "https://store.steampowered.com/app/0000000/",
        available: false,
      },
    ],
  },
};

// Proves the "no empty states" rule (teamstep-landing-spec.md §5.3): an empty platforms[]
// renders nothing at all, not a placeholder.
export const Empty: Story = {
  args: {
    platforms: [],
  },
};
