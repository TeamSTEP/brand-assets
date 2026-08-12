import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "./Hero.js";

const PLACEHOLDER_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112'%3E%3Ccircle cx='56' cy='56' r='52' fill='none' stroke='%238591C9' stroke-width='2'/%3E%3Ccircle cx='56' cy='56' r='28' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof Hero> = {
  title: "Hero/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    eyebrow: "indie game studio",
    tagline: "Building the home for the indie game world — one step at a time.",
    ctaHref: "#quest-log",
    logoMarkSrc: PLACEHOLDER_LOGO,
    logoMarkAlt: "Team STEP logo mark",
    logoAnimated: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
