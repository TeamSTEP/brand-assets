import type { Meta, StoryObj } from "@storybook/react-vite";
import { BBSPanelIframe } from "./BBSPanelIframe.js";
import { BBSTerminal } from "./BBSTerminal.js";

const meta: Meta<typeof BBSPanelIframe> = {
  title: "BBS/BBSPanelIframe",
  component: BBSPanelIframe,
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: "var(--color-background-recessed)", maxWidth: 640 }}>
        <BBSTerminal
          title="BBS·TEAMSTEP·v1.0 ─ SIGNAL ACQUIRED"
          tabListLabel="Embed panel"
          tabs={[{ id: "embed", desktopLabel: "Embed", mobileLabel: "EMB" }]}
          activeTabId="embed"
          onTabChange={() => undefined}
        >
          <Story />
        </BBSTerminal>
      </div>
    ),
  ],
  args: {
    src: "https://steamdb.info/embed/?appid=4561950",
    title: "SteamDB app embed",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SteamDB: Story = {};

export const DiscordWidget: Story = {
  args: {
    src: "https://discord.com/widget?id=773053159270514728&theme=dark",
    title: "Team STEP Discord server",
  },
};
