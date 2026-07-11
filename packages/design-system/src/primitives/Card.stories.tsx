import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card.js";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    accent: { control: "select", options: ["none", "game-border", "game-top"] },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SmallDefault: Story = {
  args: {
    size: "sm",
    accent: "none",
    children: <p style={{ margin: 0, padding: "var(--spacing-sm)", color: "var(--color-text-primary)" }}>Small card surface</p>,
  },
};

export const MediumDefault: Story = {
  args: {
    size: "md",
    accent: "none",
    children: <p style={{ margin: 0, padding: "var(--spacing-sm)", color: "var(--color-text-primary)" }}>Medium card surface</p>,
  },
};

export const LargeDefault: Story = {
  args: {
    size: "lg",
    accent: "none",
    children: <p style={{ margin: 0, padding: "var(--spacing-sm)", color: "var(--color-text-primary)" }}>Large card surface</p>,
  },
};

export const GameBorder: Story = {
  args: {
    size: "sm",
    accent: "game-border",
    children: <p style={{ margin: 0, padding: "var(--spacing-sm)", color: "var(--color-text-primary)" }}>Game-green border accent</p>,
  },
};

export const GameTop: Story = {
  args: {
    size: "lg",
    accent: "game-top",
    children: <p style={{ margin: 0, padding: "var(--spacing-sm)", color: "var(--color-text-primary)" }}>Game-green top-border accent</p>,
  },
};
