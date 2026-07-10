import type { Meta, StoryObj } from "@storybook/react-vite";
import { PixelGrid } from "./PixelGrid.js";

const meta: Meta<typeof PixelGrid> = {
  title: "Effects/PixelGrid",
  component: PixelGrid,
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: 240, background: "var(--color-background)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
