import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./Footer.js";
import type { FooterSocialLink } from "./Footer.js";

const SOCIALS: FooterSocialLink[] = [
  {
    platform: "bluesky",
    href: "https://bsky.app/profile/teamstep.bsky.social",
    label: "Team STEP on Bluesky",
  },
  {
    platform: "substack",
    href: "https://teamstep.substack.com",
    label: "Team STEP on Substack",
  },
  {
    platform: "youtube",
    href: "https://www.youtube.com/@teamstep",
    label: "Team STEP on YouTube",
  },
  {
    platform: "discord",
    href: "https://discord.gg/JPUaPmQvSZ",
    label: "Team STEP on Discord",
  },
];

const meta: Meta<typeof Footer> = {
  title: "Footer/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    studioName: "Team STEP",
    tagline: "Creativity is a human right.",
    socials: SOCIALS,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
