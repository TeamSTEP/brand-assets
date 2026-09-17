import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSTerminal } from "./BBSTerminal.js";
import { BBSPanelAPI } from "./BBSPanelAPI.js";
import type { UnifiedPost } from "./types.js";

const TABS = [
  { id: "bluesky", desktopLabel: "Bluesky", mobileLabel: "BSKY" },
  { id: "discord", desktopLabel: "Discord", mobileLabel: "DC" },
];

const MOCK_POSTS: UnifiedPost[] = [
  {
    platform: "bluesky",
    id: "1",
    author: "teamstep.bsky.social",
    text: "Signal acquired.",
    url: "https://bsky.app",
    date: "2026-07-01T12:00:00.000Z",
  },
];

function TerminalDemo() {
  const [activeTab, setActiveTab] = useState("bluesky");

  return (
    <BBSTerminal
      title="BBS·TEAMSTEP·v1.0 ─ SIGNAL ACQUIRED"
      tabs={TABS}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "bluesky" ? <BBSPanelAPI posts={MOCK_POSTS} /> : <p>{"// WIDGET PANEL"}</p>}
    </BBSTerminal>
  );
}

const meta: Meta<typeof BBSTerminal> = {
  title: "BBS/BBSTerminal",
  component: BBSTerminal,
  render: () => <TerminalDemo />,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background-recessed)", maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
