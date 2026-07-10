import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSPanelAPI } from "./BBSPanelAPI.js";
import type { UnifiedPost } from "./types.js";

const MOCK_POSTS: UnifiedPost[] = [
  {
    platform: "bluesky",
    id: "1",
    author: "teamstep.bsky.social",
    text: "Meltdown demo is live — go break a reactor.",
    url: "https://bsky.app",
    date: "2026-07-01T12:00:00.000Z",
  },
  {
    platform: "bluesky",
    id: "2",
    author: "teamstep.bsky.social",
    text: "New devlog: one step at a time.",
    url: "https://bsky.app",
    date: "2026-06-20T12:00:00.000Z",
  },
];

const meta: Meta<typeof BBSPanelAPI> = {
  title: "BBS/BBSPanelAPI",
  component: BBSPanelAPI,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background-recessed)", maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
  args: { posts: MOCK_POSTS },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { posts: [] },
};
