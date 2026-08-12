import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { BrandTitle } from "./BrandTitle.js";

const meta = {
  title: "Logo / BrandTitle",
  component: BrandTitle,
  decorators: [
    (Story: () => ReactNode) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BrandTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
