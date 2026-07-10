import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavDesktop } from "./NavDesktop.js";

const PLACEHOLDER_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%234f476d'/%3E%3C/svg%3E";

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
    logoSrc: PLACEHOLDER_LOGO,
    logoAlt: "Team STEP",
    links: LINKS,
    contactHref: "#footer",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
