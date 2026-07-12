import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton.js";

const meta: Meta<typeof IconButton> = {
  title: "Primitives/IconButton",
  component: IconButton,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "select", options: ["sm", "lg"] },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { size: "sm", "aria-label": "Close", onClick: () => {}, children: "×" },
};

export const Large: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: "relative", width: 320, height: 180, background: "var(--color-background-recessed)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: { size: "lg", "aria-label": "Play trailer", onClick: () => {}, children: "▶" },
};
