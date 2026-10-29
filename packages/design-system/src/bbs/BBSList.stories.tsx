import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSList } from "./BBSList.js";
import { BBSListItem } from "./BBSListItem.js";
import type { BBSItem } from "./types.js";

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
  args: {
    status: "error",
    items: [],
    onRetry: () => undefined,
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
 * Documents the virtualization contract: consumer owns the list element and
 * observes `endSentinelRef`. No fetch is performed here.
 */
export const VirtualizationContract: Story = {
  render: function VirtualizationContractStory() {
    const listRef = useRef<HTMLUListElement>(null);
    const endSentinelRef = useRef<HTMLDivElement>(null);

    return (
      <BBSList status="ready" endSentinelRef={endSentinelRef}>
        <ul className="ds-bbs-list__items" ref={listRef}>
          {ITEMS.map((item) => (
            <BBSListItem key={item.id} item={item} />
          ))}
        </ul>
      </BBSList>
    );
  },
};
