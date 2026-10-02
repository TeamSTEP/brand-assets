import { useEffect, useRef, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialFeed } from "./SocialFeed.js";
import type { UnifiedPost } from "./types.js";

// Placeholder art — consumers pass a real YouTube thumbnail URL.
const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%234f476d'/%3E%3Cpolygon points='130,70 130,110 170,90' fill='%238591c9'/%3E%3C/svg%3E";

const MOCK_BLUESKY: UnifiedPost[] = [
  {
    platform: "bluesky",
    id: "1",
    author: "teamstep.io",
    text: "Meltdown demo is live.",
    url: "https://bsky.app",
    date: "2026-07-01T12:00:00.000Z",
  },
];

const MOCK_YOUTUBE: UnifiedPost[] = [
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

function MockFetch({ children }: { children: ReactNode }) {
  const originalRef = useRef<typeof globalThis.fetch | null>(null);

  // Install before child effects run — SocialFeed fetches in useEffect, and
  // child effects fire before parent effects, so a parent useEffect is too late.
  if (originalRef.current === null) {
    originalRef.current = globalThis.fetch;
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.includes("platform=bluesky")) {
        return new Response(JSON.stringify(MOCK_BLUESKY), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("platform=youtube")) {
        return new Response(JSON.stringify(MOCK_YOUTUBE), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return originalRef.current!(input);
    };
  }

  useEffect(() => {
    return () => {
      if (originalRef.current) {
        globalThis.fetch = originalRef.current;
        originalRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}

const meta: Meta<typeof SocialFeed> = {
  title: "BBS/SocialFeed",
  component: SocialFeed,
  decorators: [
    (Story) => (
      <MockFetch>
        <div style={{ padding: 16, background: "var(--color-background-recessed)", maxWidth: 720 }}>
          <Story />
        </div>
      </MockFetch>
    ),
  ],
  args: {
    fetchEndpoint: "/api/feed",
    discordServerId: "000000000000000000",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
