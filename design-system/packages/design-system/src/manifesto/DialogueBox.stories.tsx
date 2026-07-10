import type { Meta, StoryObj } from "@storybook/react-vite";
import { DialogueBox } from "./DialogueBox.js";

// Stand-in for the studio logo mark — stories don't ship real brand assets (brand/ in the
// repo root, not part of the published package); consumers pass their own logo URL.
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%234f476d'/%3E%3C/svg%3E";

const meta: Meta<typeof DialogueBox> = {
  title: "Manifesto/DialogueBox",
  component: DialogueBox,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: "100%" }}>
        <Story />
      </div>
    ),
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

// Container queries respond to the box's own rendered width, not the page viewport — see
// the same note on GameCardArchive/ServiceCard's Narrow stories.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background)", width: 200 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    text: "Creativity is a human right. One step at a time. We're building the home for the indie game world.",
    animated: false,
  },
};
