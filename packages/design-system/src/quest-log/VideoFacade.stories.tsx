import type { Meta, StoryObj } from "@storybook/react-vite";
import { VideoFacade } from "./VideoFacade.js";

const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%232d1e3e'/%3E%3Ctext x='50%25' y='50%25' fill='%238591C9' font-family='monospace' font-size='20' text-anchor='middle' dominant-baseline='middle'%3EPOSTER%3C/text%3E%3C/svg%3E";

const meta: Meta<typeof VideoFacade> = {
  title: "Quest Log/VideoFacade",
  component: VideoFacade,
  decorators: [
    (Story) => (
      <div
        style={{
          width: 480,
          aspectRatio: "16 / 9",
          background: "var(--color-background)",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    posterSrc: PLACEHOLDER_POSTER,
    posterAlt: "Meltdown key art",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PosterOnly: Story = {};

export const WithTrailer: Story = {
  args: {
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
};
