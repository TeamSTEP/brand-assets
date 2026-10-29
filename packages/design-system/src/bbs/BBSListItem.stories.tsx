import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSListItem } from "./BBSListItem.js";
import type { BBSItem } from "./types.js";
import "./BBSList.css";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%234f476d'/%3E%3Cpolygon points='130,70 130,110 170,90' fill='%238591c9'/%3E%3C/svg%3E";

const BASE: BBSItem = {
  id: "1",
  name: "Post name goes here",
  href: "https://teamstep.io",
};

const meta: Meta<typeof BBSListItem> = {
  title: "BBS/BBSListItem",
  component: BBSListItem,
  decorators: [
    (Story, context) => {
      const maxWidth = (context.parameters.bbsListMaxWidth as number | undefined) ?? 640;
      return (
        <div
          className="ds-bbs-list"
          style={{
            padding: 16,
            background: "var(--color-background-recessed)",
            maxWidth,
          }}
        >
          <ul className="ds-bbs-list__items">
            <Story />
          </ul>
        </div>
      );
    },
  ],
  args: {
    item: {
      ...BASE,
      body: "Body text starts here and is clamped after three lines, so rows stay even.",
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MandatoryOnly: Story = {
  args: { item: BASE },
};

export const ThumbnailOnly: Story = {
  args: {
    item: {
      ...BASE,
      body: "Body text clamped the same way.",
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
    },
  },
};

export const DateOnly: Story = {
  args: {
    item: {
      ...BASE,
      body: "Body text clamped after three lines.",
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const BothOptional: Story = {
  args: {
    item: {
      ...BASE,
      body: "Body text starts here and is clamped after three lines, so rows stay even.",
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const LongBody: Story = {
  args: {
    item: {
      ...BASE,
      body: "Body text starts here and keeps going well past three lines so the clamp is visible. Extra words fill the paragraph until the overflow is cut visually while the full string remains in the DOM for screen readers and copy.",
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
      publishedAt: "2026-09-28T12:00:00.000Z",
    },
  },
};

export const LongName: Story = {
  args: {
    item: {
      ...BASE,
      name: "AnExtremelyLongUnbrokenPostNameThatMustWrapWithoutHorizontalOverflowAcrossTheRow",
      body: "Short body.",
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const OmittedBodyWithThumb: Story = {
  args: {
    item: {
      ...BASE,
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const BrokenImage: Story = {
  args: {
    item: {
      ...BASE,
      body: "Broken thumbnail should not break the row.",
      thumbnail: { src: "https://invalid.example/missing.jpg", alt: "" },
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const CompactDensity: Story = {
  args: {
    density: "compact",
    item: {
      ...BASE,
      body: "Compact density clamps to two lines. This body is long enough to overflow that clamp and demonstrate the denser spacing between rows and within the item.",
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const ThumbnailAbove: Story = {
  args: {
    thumbnailPlacement: "above",
    thumbnailFit: "cover",
    item: {
      ...BASE,
      body: "Stacked thumbnail with cover fit.",
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};

export const NarrowContainer: Story = {
  parameters: { bbsListMaxWidth: 320 },
  args: {
    item: {
      ...BASE,
      body: "Body text starts here and is clamped after three lines.",
      thumbnail: { src: PLACEHOLDER_THUMB, alt: "" },
      publishedAt: "2026-10-02T12:00:00.000Z",
    },
  },
};
