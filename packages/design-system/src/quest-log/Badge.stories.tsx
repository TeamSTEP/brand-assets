import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge.js";

const meta: Meta<typeof Badge> = {
  title: "Quest Log/Badge",
  component: Badge,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["main-quest", "side-quest", "legacy", "in-development"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MainQuest: Story = { args: { variant: "main-quest" } };
export const SideQuest: Story = { args: { variant: "side-quest" } };
export const Legacy: Story = { args: { variant: "legacy" } };
export const InDevelopment: Story = { args: { variant: "in-development" } };
