import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSList } from "./BBSList.js";
import { BBSPanelIframe } from "./BBSPanelIframe.js";
import { BBSTerminal } from "./BBSTerminal.js";
import type { BBSTab } from "./BBSTerminal.js";
import type { BBSItem } from "./types.js";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%234f476d'/%3E%3Cpolygon points='130,70 130,110 170,90' fill='%238591c9'/%3E%3C/svg%3E";

const TABS: BBSTab[] = [
  { id: "bluesky", desktopLabel: "Bluesky", mobileLabel: "BSKY", icon: "bluesky" },
  { id: "youtube", desktopLabel: "YouTube", mobileLabel: "YT", icon: "youtube" },
  { id: "reddit", desktopLabel: "Reddit", mobileLabel: "RD", icon: "reddit" },
  { id: "steam", desktopLabel: "Steam", mobileLabel: "STM", icon: "steam" },
  { id: "discord", desktopLabel: "Discord", mobileLabel: "DC", icon: "discord" },
];

/** Bluesky-like: body text, sometimes thumbnail, date. */
const BLUESKY_ITEMS: BBSItem[] = [
  {
    id: "bsky-1",
    name: "teamstep.bsky.social",
    href: "https://bsky.app",
    body: "Meltdown demo is live — go break a reactor. Patch notes inbound.",
    publishedAt: "2026-10-02T12:00:00.000Z",
  },
  {
    id: "bsky-2",
    name: "teamstep.bsky.social",
    href: "https://bsky.app",
    body: "New art pass on the coolant pipes. Thumbnail when the render finishes.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-28T12:00:00.000Z",
  },
  {
    id: "bsky-3",
    name: "teamstep.bsky.social",
    href: "https://bsky.app",
    body: "One step at a time. Weekend build streaming later.",
    publishedAt: "2026-09-20T12:00:00.000Z",
  },
];

/** YouTube-like: always title, thumbnail, date. */
const YOUTUBE_ITEMS: BBSItem[] = [
  {
    id: "yt-1",
    name: "Meltdown trailer is live",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "yt-2",
    name: "Devlog: one step at a time",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-15T12:00:00.000Z",
  },
  {
    id: "yt-3",
    name: "Behind the scenes: reactor UI",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-08-30T12:00:00.000Z",
  },
];

/** Reddit-like: title, sometimes body, sometimes thumbnail, date. */
const REDDIT_ITEMS: BBSItem[] = [
  {
    id: "rd-1",
    name: "Meltdown early access weekend — feedback thread",
    href: "https://www.reddit.com",
    body: "Drop bugs, balance notes, and wish-list items. We are reading.",
    publishedAt: "2026-10-03T12:00:00.000Z",
  },
  {
    id: "rd-2",
    name: "Screenshot Saturday: coolant overflow",
    href: "https://www.reddit.com",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-27T12:00:00.000Z",
  },
  {
    id: "rd-3",
    name: "AMA with the Team STEP engineers",
    href: "https://www.reddit.com",
    body: "Ask about netcode, tools, and how we ship one step at a time.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-10T12:00:00.000Z",
  },
];

/** Steam community-like: title, body, date, thumbnail. */
const STEAM_ITEMS: BBSItem[] = [
  {
    id: "st-1",
    name: "Update 0.4.2 — stable core temperature",
    href: "https://store.steampowered.com",
    body: "Hotfix for save corruption on long sessions, plus new tutorial tips.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-10-04T12:00:00.000Z",
  },
  {
    id: "st-2",
    name: "Community highlight: best meltdowns of the week",
    href: "https://store.steampowered.com",
    body: "We featured three player clips on the hub. Keep tagging #TeamSTEP.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-29T12:00:00.000Z",
  },
  {
    id: "st-3",
    name: "Roadmap: winter event teaser",
    href: "https://store.steampowered.com",
    body: "A limited-time scenario is cooking. Wishlist reminders welcome.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-18T12:00:00.000Z",
  },
];

const FEEDS: Record<string, BBSItem[]> = {
  bluesky: BLUESKY_ITEMS,
  youtube: YOUTUBE_ITEMS,
  reddit: REDDIT_ITEMS,
  steam: STEAM_ITEMS,
};

const DISCORD_EMBED_SRC = "https://discord.com/widget?id=773053159270514728&theme=dark";

function TerminalDemo() {
  const [activeTab, setActiveTab] = useState("bluesky");
  const active = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <BBSTerminal
      title="BBS·TEAMSTEP·v1.0 ─ SIGNAL ACQUIRED"
      tabListLabel={active?.desktopLabel ?? "Feed"}
      tabs={TABS}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "discord" ? (
        <BBSPanelIframe src={DISCORD_EMBED_SRC} title="Team STEP Discord server" />
      ) : (
        <BBSList status="done" items={FEEDS[activeTab] ?? []} />
      )}
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
