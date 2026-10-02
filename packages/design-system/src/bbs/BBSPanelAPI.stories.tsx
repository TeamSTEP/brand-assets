import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSPanelAPI } from "./BBSPanelAPI.js";
import type { UnifiedPost } from "./types.js";

// Placeholder art — consumers pass a real YouTube thumbnail URL.
const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%234f476d'/%3E%3Cpolygon points='130,70 130,110 170,90' fill='%238591c9'/%3E%3C/svg%3E";

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

const YOUTUBE_POSTS: UnifiedPost[] = [
  {
    platform: "youtube",
    id: "yt-1",
    author: "teamstep",
    text: "Meltdown trailer is live",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    date: "2026-07-01T12:00:00.000Z",
    thumb: PLACEHOLDER_THUMB,
  },
  {
    platform: "youtube",
    id: "yt-2",
    author: "teamstep",
    text: "Devlog: one step at a time",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    date: "2026-06-20T12:00:00.000Z",
    thumb: PLACEHOLDER_THUMB,
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

export const WithThumb: Story = {
  args: { posts: YOUTUBE_POSTS },
};

export const Empty: Story = {
  args: { posts: [] },
};
