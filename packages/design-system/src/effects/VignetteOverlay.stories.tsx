import type { Meta, StoryObj } from "@storybook/react-vite";
import { VignetteOverlay } from "./VignetteOverlay.js";

const meta: Meta<typeof VignetteOverlay> = {
  title: "Effects/VignetteOverlay",
  component: VignetteOverlay,
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: 240, background: "var(--color-accent)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
