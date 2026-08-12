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
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Close: Story = {
  args: { size: "sm", icon: "close", "aria-label": "Close", onClick: () => {} },
};

export const Play: Story = {
  args: { size: "lg", icon: "play", "aria-label": "Play trailer", onClick: () => {} },
};
