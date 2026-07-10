import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSPanelIframe } from "./BBSPanelIframe.js";

const meta: Meta<typeof BBSPanelIframe> = {
  title: "BBS/BBSPanelIframe",
  component: BBSPanelIframe,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background-recessed)", maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    serverId: "000000000000000000",
    title: "Team STEP Discord server",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
