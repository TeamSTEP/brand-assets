import type { Meta, StoryObj } from "@storybook/react-vite";
import { DialogueBox } from "./DialogueBox.js";

// Placeholder mark — consumers pass their own logo URL.
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof DialogueBox> = {
  title: "Manifesto/DialogueBox",
  component: DialogueBox,
  decorators: [
    (Story, context) => {
      // Narrow passes 390 (mobile viewport); Default uses a rem soft rail, not a hard px cap.
      const maxWidth =
        (context.parameters.dialogueBoxMaxWidth as number | string | undefined) ?? "min(100%, 40rem)";
      return (
        <div
          style={{
            padding: "var(--spacing-md)",
            background: "var(--color-background)",
            width: "100%",
            maxWidth,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  args: {
    avatarSrc: PLACEHOLDER_AVATAR,
    avatarAlt: "Team STEP logo mark",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Creativity is a human right. One step at a time. We're building the home for the indie game world.",
    animated: false,
  },
};

/** Mobile viewport width (390) — exercises CQ-tightened padding under 480. */
export const Narrow: Story = {
  parameters: {
    dialogueBoxMaxWidth: 390,
  },
  args: {
    text: "Creativity is a human right. One step at a time. We're building the home for the indie game world.",
    animated: false,
  },
};
