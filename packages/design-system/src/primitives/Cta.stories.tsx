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
  args: { variant: "primary", href: "#", children: "▶ PLAY STEAM DEMO" },
};

export const Secondary: Story = {
  args: { variant: "secondary", href: "#", children: "⬡ WISHLIST FULL RELEASE" },
};

export const Ghost: Story = {
  args: { variant: "ghost", href: "#", children: "▶ ENTER THE GUILD" },
};
