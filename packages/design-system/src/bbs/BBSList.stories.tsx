import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSList } from "./BBSList.js";
import { BBSListItem } from "./BBSListItem.js";
import { BBSTerminal } from "./BBSTerminal.js";
import type { BBSItem, BBSListStatus } from "./types.js";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%234f476d'/%3E%3Cpolygon points='130,70 130,110 170,90' fill='%238591c9'/%3E%3C/svg%3E";

const ITEMS: BBSItem[] = [
  {
    id: "1",
    name: "Post name goes here",
    href: "https://teamstep.io",
    body: "Body text starts here and is clamped after three lines, so rows stay even.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-10-02T12:00:00.000Z",
  },
  {
    id: "2",
    name: "Another post name",
    href: "https://teamstep.io",
    body: "Body text, clamped the same way.",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: "2026-09-28T12:00:00.000Z",
  },
  {
    id: "3",
    name: "Title only next to thumb",
    href: "https://teamstep.io",
    thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
  },
];

const PAGE_SIZE = 30;

const ALL_ITEMS: BBSItem[] = Array.from({ length: 1000 }, (_, index) => {
  const n = index + 1;
  return {
    id: `item-${n}`,
    name: `Post name ${n}`,
    href: "https://teamstep.io",
    body:
      n % 5 === 0
        ? undefined
        : `Body text for item ${n}. Clamped after a few lines so rows stay even while the list grows.`,
    thumbnail: n % 3 === 0 ? undefined : { src: PLACEHOLDER_THUMB, alt: "" },
    publishedAt: n % 4 === 0 ? undefined : "2026-10-02T12:00:00.000Z",
  };
});

const meta: Meta<typeof BBSList> = {
  title: "BBS/BBSList",
  component: BBSList,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background-recessed)", maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    status: "ready",
    items: ITEMS,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Empty: Story = {
  args: { status: "ready", items: [] },
};

export const Loading: Story = {
  args: { status: "loading", items: [] },
};

export const ErrorState: Story = {
  render: function ErrorStateStory() {
    return (
      <BBSTerminal
        title="BBS·TEAMSTEP·v1.0 ─ SIGNAL LOST"
        tabListLabel="Feed"
        tabs={[{ id: "feed", desktopLabel: "Feed", mobileLabel: "FEED" }]}
        activeTabId="feed"
        onTabChange={() => undefined}
      >
        <BBSList status="error" items={[]} onRetry={() => undefined} />
      </BBSTerminal>
    );
  },
};

export const LoadingMore: Story = {
  args: { status: "loadingMore", items: ITEMS },
};

export const ErrorMore: Story = {
  args: {
    status: "errorMore",
    items: ITEMS,
    onRetry: () => undefined,
  },
};

export const Done: Story = {
  args: { status: "done", items: ITEMS },
};

/**
 * Documents the virtualization contract: consumer owns progressive reveal via
 * `endSentinelRef` + IntersectionObserver. 1000 source items; pages append on scroll.
 */
export const VirtualizationContract: Story = {
  render: function VirtualizationContractStory() {
    const listRef = useRef<HTMLUListElement>(null);
    const endSentinelRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [status, setStatus] = useState<BBSListStatus>("ready");

    useEffect(() => {
      const sentinel = endSentinelRef.current;
      if (!sentinel || status === "done") {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) {
            return;
          }
          setStatus("loadingMore");
          window.setTimeout(() => {
            setVisibleCount((current) => {
              const next = Math.min(current + PAGE_SIZE, ALL_ITEMS.length);
              setStatus(next >= ALL_ITEMS.length ? "done" : "ready");
              return next;
            });
          }, 200);
        },
        { root: sentinel.closest(".ds-bbs-terminal__body"), rootMargin: "80px", threshold: 0 },
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }, [status, visibleCount]);

    const visibleItems = ALL_ITEMS.slice(0, visibleCount);

    return (
      <BBSTerminal
        title="BBS·TEAMSTEP·v1.0 ─ VIRTUAL FEED"
        tabListLabel="Virtual feed"
        tabs={[{ id: "feed", desktopLabel: "Feed", mobileLabel: "FEED" }]}
        activeTabId="feed"
        onTabChange={() => undefined}
      >
        <BBSList status={status} endSentinelRef={endSentinelRef}>
          <ul className="ds-bbs-list__items" ref={listRef}>
            {visibleItems.map((item) => (
              <BBSListItem key={item.id} item={item} />
            ))}
          </ul>
        </BBSList>
      </BBSTerminal>
    );
  },
};
