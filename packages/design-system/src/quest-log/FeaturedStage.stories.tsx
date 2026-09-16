import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturedStage } from "./FeaturedStage.js";

const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%23122018'/%3E%3C/svg%3E";

const meta: Meta<typeof FeaturedStage> = {
  title: "Quest Log/FeaturedStage",
  component: FeaturedStage,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    media: <img src={PLACEHOLDER_POSTER} alt="Featured game key art" />,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Meltdown",
    subtitle: "Nuclear Reactor Simulator",
    description:
      "Manage an overworked reactor. Keep the city powered. Try not to cause a meltdown. The full Steam release is coming.",
    inDevelopment: true,
    ctas: [
      {
        variant: "primary",
        icon: "hexagon",
        label: "PLAY FREE · ITCH.IO",
        href: "https://teamstep.itch.io/meltdown",
      },
      {
        variant: "primary",
        icon: "gamepad",
        label: "PLAY STEAM DEMO",
        href: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
      },
      {
        variant: "secondary",
        icon: "gamepad",
        label: "WISHLIST FULL RELEASE · STEAM",
        href: "https://store.steampowered.com/app/4561950/Meltdown_Demo/",
      },
    ],
  },
};

export const Released: Story = {
  args: {
    title: "Meltdown",
    subtitle: "Nuclear Reactor Simulator",
    description: "Manage an overworked reactor. Keep the city powered. Try not to cause a meltdown.",
    inDevelopment: false,
    ctas: [
      {
        variant: "primary",
        icon: "gamepad",
        label: "BUY ON STEAM",
        href: "https://store.steampowered.com/app/4561950/",
      },
    ],
  },
};
