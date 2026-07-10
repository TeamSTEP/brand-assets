import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./Footer.js";
import type { FooterSocialLink } from "./Footer.js";

const PLACEHOLDER_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%234f476d'/%3E%3C/svg%3E";

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
    logoSrc: PLACEHOLDER_LOGO,
    logoAlt: "Team STEP logo",
    studioName: "Team STEP",
    tagline: "Creativity is a human right.",
    socials: SOCIALS,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
