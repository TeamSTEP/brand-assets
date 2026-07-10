import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScanlineOverlay } from "./ScanlineOverlay.js";

const meta: Meta<typeof ScanlineOverlay> = {
  title: "Effects/ScanlineOverlay",
  component: ScanlineOverlay,
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: 240, background: "var(--color-background-recessed)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
