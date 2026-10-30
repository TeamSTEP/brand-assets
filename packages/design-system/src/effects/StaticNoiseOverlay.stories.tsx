import type { Meta, StoryObj } from "@storybook/react-vite";
import { StaticNoiseOverlay } from "./StaticNoiseOverlay.js";

const meta: Meta<typeof StaticNoiseOverlay> = {
  title: "Effects/StaticNoiseOverlay",
  component: StaticNoiseOverlay,
  decorators: [
    (Story) => (
      <div
        style={{
          position: "relative",
          height: 240,
          background: "var(--color-background-recessed)",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
