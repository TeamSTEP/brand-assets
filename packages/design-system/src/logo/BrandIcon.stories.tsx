import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandIcon } from "./BrandIcon.js";

const meta: Meta<typeof BrandIcon> = {
  title: "Logo / BrandIcon",
  component: BrandIcon,
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["brand-filled", "brand-hollow"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BrandFilled: Story = {
  args: { variant: "brand-filled" },
};

export const BrandHollow: Story = {
  args: { variant: "brand-hollow" },
};
