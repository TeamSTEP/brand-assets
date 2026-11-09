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

const postedAt = (isoDate: string): string => `${isoDate}T12:00:00.000Z`;

/** Bluesky-like: body text, sometimes thumbnail, date. */
const BLUESKY_ITEMS: BBSItem[] = ([
  ["Meltdown demo is live — go break a reactor. Patch notes inbound.", false, "2026-10-02"],
  ["New art pass on the coolant pipes. Thumbnail when the render finishes.", true, "2026-09-28"],
  ["One step at a time. Weekend build streaming later.", false, "2026-09-20"],
  ["Reactor UI pass is in. The gauges finally agree with each other.", false, "2026-09-14"],
  ["Playtest notes from Friday: three meltdowns, one perfect shutdown.", true, "2026-09-08"],
  ["Shipping the patch tonight. Save your run before you update.", false, "2026-09-02"],
  ["Coolant loop concept art. Still deciding how loud the pumps should be.", true, "2026-08-26"],
  ["Office soundtrack this week is nothing but alarm tests.", false, "2026-08-19"],
  ["Tutorial rewrite is up for review. Fewer words, more blinking lights.", false, "2026-08-12"],
  ["Someone left a wrench in the turbine. It is now a feature.", true, "2026-08-05"],
  ["Build is green. Going outside to remember what daylight looks like.", false, "2026-07-29"],
  ["Next stream is a no-reset run. Chat picks the first valve.", false, "2026-07-22"],
] as const satisfies readonly (readonly [string, boolean, string])[]).map(([body, withThumb, date], index) => ({
  id: `bsky-${index + 1}`,
  name: "teamstep.bsky.social",
  href: "https://bsky.app",
  body,
  thumbnail: withThumb ? { src: PLACEHOLDER_THUMB, alt: "" } : undefined,
  publishedAt: postedAt(date),
}));

/** YouTube-like: always title, thumbnail, date. */
const YOUTUBE_ITEMS: BBSItem[] = ([
  ["Meltdown trailer is live", "2026-10-01"],
  ["Devlog: one step at a time", "2026-09-15"],
  ["Behind the scenes: reactor UI", "2026-08-30"],
  ["Patch notes: save corruption hotfix", "2026-08-18"],
  ["How the coolant loop actually works", "2026-08-04"],
  ["Playtest diary: Friday night shift", "2026-07-21"],
  ["Sound design: alarms, pumps, and silence", "2026-07-07"],
  ["Tutorial teardown — what we cut", "2026-06-23"],
  ["Community clips: best shutdowns", "2026-06-09"],
  ["Winter event teaser", "2026-05-26"],
  ["Tools tour: the build monitor", "2026-05-12"],
  ["One hour of uninterrupted reactor hum", "2026-04-28"],
] as const satisfies readonly (readonly [string, string])[]).map(([name, date], index) => ({
  id: `yt-${index + 1}`,
  name,
  href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
  publishedAt: postedAt(date),
}));

/** Reddit-like: title, sometimes body, sometimes thumbnail, date. */
const REDDIT_ITEMS: BBSItem[] = ([
  [
    "Meltdown early access weekend — feedback thread",
    "Drop bugs, balance notes, and wish-list items. We are reading.",
    false,
    "2026-10-03",
  ],
  ["Screenshot Saturday: coolant overflow", undefined, true, "2026-09-27"],
  [
    "AMA with the Team STEP engineers",
    "Ask about netcode, tools, and how we ship one step at a time.",
    true,
    "2026-09-10",
  ],
  ["Patch 0.4.2 thread — save your game first", "Hotfix notes are in the top comment.", false, "2026-09-04"],
  ["Which alarm is the most annoying?", undefined, false, "2026-08-28"],
  ["Layout idea: move the turbine readout up", undefined, true, "2026-08-21"],
  [
    "Bug: gauges freeze after a long session",
    "Happens around the two-hour mark. Logs attached.",
    false,
    "2026-08-14",
  ],
  ["Fan art of the night shift", undefined, true, "2026-08-07"],
  ["Wishlist check-in — who is waiting on winter?", "A limited scenario is cooking.", false, "2026-07-31"],
  ["Controller binds that actually work", undefined, false, "2026-07-24"],
  ["Photo mode request", "Let us freeze the meltdown and orbit the core.", true, "2026-07-17"],
  ["Weekly thread: show your best shutdown", undefined, true, "2026-07-10"],
] as const satisfies readonly (readonly [string, string | undefined, boolean, string])[]).map(
  ([name, body, withThumb, date], index) => ({
  id: `rd-${index + 1}`,
  name,
  href: "https://www.reddit.com",
  body,
  thumbnail: withThumb ? { src: PLACEHOLDER_THUMB, alt: "" } : undefined,
  publishedAt: postedAt(date),
}));

/** Steam community-like: title, body, date, thumbnail. */
const STEAM_ITEMS: BBSItem[] = ([
  [
    "Update 0.4.2 — stable core temperature",
    "Hotfix for save corruption on long sessions, plus new tutorial tips.",
    "2026-10-04",
  ],
  [
    "Community highlight: best meltdowns of the week",
    "We featured three player clips on the hub. Keep tagging #TeamSTEP.",
    "2026-09-29",
  ],
  [
    "Roadmap: winter event teaser",
    "A limited-time scenario is cooking. Wishlist reminders welcome.",
    "2026-09-18",
  ],
  [
    "Known issue: wrench in the turbine",
    "A physics prop can lodge in the fan. Pull it out before the next shift.",
    "2026-09-11",
  ],
  [
    "Soundtrack preview on the store page",
    "Two new alarm stingers and a quieter idle loop are up for a listen.",
    "2026-09-04",
  ],
  [
    "Discussion: how long is your longest stable run?",
    "Post the timestamp. We are collecting them for the next trailer.",
    "2026-08-28",
  ],
  [
    "Controller layout v2",
    "Shoulder buttons now cycle valves. Full diagram is on the announcement.",
    "2026-08-21",
  ],
  [
    "Workshop is not open yet",
    "Mod tools ship after the winter scenario. Hang onto those ideas.",
    "2026-08-14",
  ],
  [
    "Screenshot contest: night shift",
    "Submit one frame from inside the control room. Winners go on the hub.",
    "2026-08-07",
  ],
  [
    "Server maintenance Thursday",
    "Cloud saves will be read-only for about an hour. Local saves are fine.",
    "2026-07-31",
  ],
  [
    "Patch preview: quieter pumps",
    "The coolant loop was shouting. This build turns it down a notch.",
    "2026-07-24",
  ],
  [
    "Thanks for the first month",
    "Notes from launch week are now a public post. More fixes are queued.",
    "2026-07-17",
  ],
] as const satisfies readonly (readonly [string, string, string])[]).map(([name, body, date], index) => ({
  id: `st-${index + 1}`,
  name,
  href: "https://store.steampowered.com",
  body,
  thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
  publishedAt: postedAt(date),
}));

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
