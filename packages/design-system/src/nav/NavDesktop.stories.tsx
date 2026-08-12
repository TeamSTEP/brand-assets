import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavDesktop } from "./NavDesktop.js";

const LINKS = [
  { label: "HOME", href: "#hero" },
  { label: "GAMES", href: "#quest-log" },
  { label: "FEED", href: "#bbs-board" },
  { label: "WORK", href: "#services" },
];

const meta: Meta<typeof NavDesktop> = {
  title: "Nav/NavDesktop",
  component: NavDesktop,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    links: LINKS,
    contactHref: "#footer",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
