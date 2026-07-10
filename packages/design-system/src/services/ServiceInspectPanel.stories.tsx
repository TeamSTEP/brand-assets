import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ServiceCard } from "./ServiceCard.js";
import { ServiceInspectPanel } from "./ServiceInspectPanel.js";

const PLACEHOLDER_ICON = (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" fill="var(--color-accent-primary)" />
  </svg>
);

function InspectDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 16, background: "var(--color-background)", maxWidth: 320 }}>
      <ServiceCard
        icon={PLACEHOLDER_ICON}
        title="Game Development"
        description="Full-cycle development for indie and AA titles."
        onInspect={() => setOpen(true)}
      />
      <ServiceInspectPanel
        open={open}
        onClose={() => setOpen(false)}
        title="Game Development"
        description="From prototype to polish — we build games with small teams, fast iteration, and a player-first mindset."
        contactHref="mailto:hello@teamstep.gg"
      />
    </div>
  );
}

const meta: Meta<typeof ServiceInspectPanel> = {
  title: "Services/ServiceInspectPanel",
  component: ServiceInspectPanel,
  render: () => <InspectDemo />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
