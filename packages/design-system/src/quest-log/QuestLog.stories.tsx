import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuestLog } from "./QuestLog.js";

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='72'%3E%3Crect width='96' height='72' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof QuestLog> = {
  title: "Quest Log/QuestLog",
  component: QuestLog,
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-background)", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: "More from Team Step",
    lede: "Released titles, live prototypes, and paused projects.",
    groups: [
      {
        phase: "released",
        label: "Released",
        items: [
          {
            title: "Signal Drift",
            description: "Placeholder released title.",
            status: "released",
            posterSrc: POSTER,
            posterAlt: "Signal Drift",
            cta: { icon: "gamepad", label: "PLAY ON STEAM", url: "#" },
          },
        ],
      },
      {
        phase: "prototype",
        label: "Prototypes",
        items: [
          {
            title: "Project Helix",
            description: "Active experiment build.",
            status: "prototype",
            posterSrc: POSTER,
            posterAlt: "Helix",
            cta: { icon: "hexagon", label: "PLAY BUILD", url: "#" },
          },
        ],
      },
      {
        phase: "legacy",
        label: "Archive",
        items: [
          {
            title: "Witch One: Crucible",
            description: "Shelved while Meltdown ships.",
            status: "legacy",
            posterSrc: POSTER,
            posterAlt: "Witch One",
            cta: { icon: "download", label: "DOWNLOAD FREE", url: "#" },
          },
        ],
      },
    ],
  },
};
