import { useEffect, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialFeed } from "./SocialFeed.js";
import type { UnifiedPost } from "./types.js";

const MOCK_POSTS: UnifiedPost[] = [
  {
    platform: "bluesky",
    id: "1",
    author: "teamstep.bsky.social",
    text: "Meltdown demo is live.",
    url: "https://bsky.app",
    date: "2026-07-01T12:00:00.000Z",
  },
];

function MockFetch({ children }: { children: ReactNode }) {
  useEffect(() => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.includes("platform=bluesky")) {
        return new Response(JSON.stringify(MOCK_POSTS), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("platform=substack") || url.includes("platform=youtube")) {
        return new Response(JSON.stringify([]), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return originalFetch(input);
    };

    return () => {
      globalThis.fetch = originalFetch;
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
