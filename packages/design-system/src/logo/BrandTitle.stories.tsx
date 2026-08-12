import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandTitle } from "./BrandTitle.js";

const meta: Meta<typeof BrandTitle> = {
  title: "Logo / BrandTitle",
  component: BrandTitle,
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

/** Documents hollow → filled fallback (warns in console). */
export const BrandHollowFallback: Story = {
  args: { variant: "brand-hollow" },
};
