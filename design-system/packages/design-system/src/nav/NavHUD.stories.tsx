import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavHUD } from "./NavHUD.js";

const ITEMS = [
  { label: "HOME", sectionId: "hero" },
  { label: "GAMES", sectionId: "quest-log" },
  { label: "FEED", sectionId: "bbs-board" },
  { label: "WORK", sectionId: "services" },
];

const meta: Meta<typeof NavHUD> = {
  title: "Nav/NavHUD",
  component: NavHUD,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "120vh", background: "var(--color-background)" }}>
        <section
          id="hero"
          style={{ minHeight: "40vh", padding: 16, color: "var(--color-text-primary)" }}
        >
          Hero
        </section>
        <section
          id="quest-log"
          style={{ minHeight: "40vh", padding: 16, color: "var(--color-text-primary)" }}
        >
          Quest Log
        </section>
        <section
          id="bbs-board"
          style={{ minHeight: "40vh", padding: 16, color: "var(--color-text-primary)" }}
        >
          BBS
        </section>
        <section
          id="services"
          style={{ minHeight: "40vh", padding: 16, color: "var(--color-text-primary)" }}
        >
          Services
        </section>
        <Story />
      </div>
    ),
  ],
  args: { items: ITEMS },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
