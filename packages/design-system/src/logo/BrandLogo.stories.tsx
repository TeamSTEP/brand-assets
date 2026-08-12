import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandLogo } from "./BrandLogo.js";

const meta: Meta<typeof BrandLogo> = {
  title: "Logo / BrandLogo",
  component: BrandLogo,
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
