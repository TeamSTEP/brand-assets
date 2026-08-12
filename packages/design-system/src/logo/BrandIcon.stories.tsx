import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { BrandIcon } from "./BrandIcon.js";

const voidDecorator = (Story: () => ReactNode) => (
  <div style={{ padding: 24, background: "var(--color-void)" }}>
    <Story />
  </div>
);

const lightPanelDecorator = (Story: () => ReactNode) => (
  <div style={{ padding: 24, background: "var(--color-void)" }}>
    <div style={{ padding: 24, background: "var(--color-text-primary)" }}>
      <Story />
    </div>
  </div>
);

const meta: Meta<typeof BrandIcon> = {
  title: "Logo / BrandIcon",
  component: BrandIcon,
  argTypes: {
    variant: {
      control: "select",
      options: ["brand-filled", "brand-hollow", "dark", "void", "light"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BrandFilled: Story = {
  args: { variant: "brand-filled" },
  decorators: [voidDecorator],
};

export const BrandHollow: Story = {
  args: { variant: "brand-hollow" },
  decorators: [voidDecorator],
};

export const Dark: Story = {
  args: { variant: "dark" },
  decorators: [lightPanelDecorator],
};

export const Void: Story = {
  args: { variant: "void" },
  decorators: [lightPanelDecorator],
};

export const Light: Story = {
  args: { variant: "light" },
  decorators: [voidDecorator],
};
