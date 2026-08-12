import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cta } from "./Cta.js";

const meta: Meta<typeof Cta> = {
  title: "Primitives/Cta",
  component: Cta,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", icon: "hexagon", href: "#", children: "PLAY STEAM DEMO" },
};

export const Secondary: Story = {
  args: { variant: "secondary", icon: "hexagon", href: "#", children: "WISHLIST FULL RELEASE" },
};

export const Contact: Story = {
  args: { variant: "contact", href: "#", children: "GET IN TOUCH" },
};

export const Ghost: Story = {
  args: { variant: "ghost", href: "#", children: "CONTACT" },
};

export const Inspect: Story = {
  args: { variant: "inspect", onClick: () => {}, children: "INSPECT ITEM" },
};

export const Ambient: Story = {
  args: { variant: "ambient", href: "#", children: "ENTER THE GUILD" },
};

export const Download: Story = {
  args: { variant: "ghost", icon: "download", href: "#", children: "DOWNLOAD FREE · ITCH.IO" },
};

export const Gamepad: Story = {
  args: { variant: "primary", icon: "gamepad", href: "#", children: "PLAY IN BROWSER · ITCH.IO" },
};
