import { useCallback, useEffect, useRef, useState } from "react";
import { BBSList } from "./BBSList.js";
import { BBSPanelIframe } from "./BBSPanelIframe.js";
import { BBSTerminal } from "./BBSTerminal.js";
import type { BBSTab } from "./BBSTerminal.js";
import { toBBSItem } from "./mapUnifiedPost.js";
import type { BBSListStatus, FeedPlatform, UnifiedPost } from "./types.js";
import "./SocialFeed.css";

/**
 * Social feed tab id — a {@link FeedPlatform} or Discord.
 *
 * @deprecated Prefer app-owned tabs with {@link BBSTerminal} + {@link BBSList}.
 * @public
 */
export type SocialFeedTab = FeedPlatform | "discord";

/**
 * Props for {@link SocialFeed}.
 *
 * @deprecated Prefer {@link BBSTerminal} + {@link BBSList} with app-owned fetch.
 * @public
 */
export interface SocialFeedProps {
  /** Feed API base URL. Defaults to `/api/feed`. */
  fetchEndpoint?: string;
  /** Discord server ID for the widget tab. */
  discordServerId: string;
}

const TABS: BBSTab[] = [
  { id: "bluesky", desktopLabel: "Bluesky", mobileLabel: "BSKY", icon: "bluesky" },
  { id: "youtube", desktopLabel: "YouTube", mobileLabel: "YT", icon: "youtube" },
  { id: "discord", desktopLabel: "Discord", mobileLabel: "DC", icon: "discord" },
];

/**
 * Tabbed BBS feed with cached `fetch()` responses.
 *
 * @deprecated Prefer {@link BBSTerminal} + {@link BBSList} with app-owned fetch.
 * @public
 */
export function SocialFeed({
  fetchEndpoint = "/api/feed",
  discordServerId,
}: SocialFeedProps) {
  const [activeTab, setActiveTab] = useState<SocialFeedTab>("bluesky");
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<SocialFeedTab, UnifiedPost[]>>(new Map());

  const loadPlatform = useCallback(
    async (tab: SocialFeedTab) => {
      if (tab === "discord") {
        setPosts([]);
        setError(null);
        setLoading(false);
        return;
      }

      const cached = cacheRef.current.get(tab);
      if (cached) {
        setPosts(cached);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${fetchEndpoint}?platform=${tab}`);
        if (!response.ok) {
          throw new Error(`Feed request failed (${response.status})`);
        }
        const data = (await response.json()) as UnifiedPost[];
        cacheRef.current.set(tab, data);
        setPosts(data);
      } catch (fetchError) {
        setPosts([]);
        setError(fetchError instanceof Error ? fetchError.message : "Feed request failed");
      } finally {
        setLoading(false);
      }
    },
    [fetchEndpoint],
  );

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId as SocialFeedTab);
  };

  useEffect(() => {
    void loadPlatform(activeTab);
  }, [activeTab, loadPlatform]);

  const activeTabMeta = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  let listStatus: BBSListStatus = "done";
  if (loading) {
    listStatus = "loading";
  } else if (error) {
    listStatus = "error";
  } else if (posts.length === 0) {
    listStatus = "ready";
  }

  return (
    <div className="ds-social-feed">
      <BBSTerminal
        title="BBS·TEAMSTEP·v1.0 ─ SIGNAL ACQUIRED"
        tabListLabel={activeTabMeta?.desktopLabel ?? "Feed"}
        tabs={TABS}
        activeTabId={activeTab}
        onTabChange={onTabChange}
      >
        {activeTab === "discord" ? (
          <BBSPanelIframe
            src={`https://discord.com/widget?id=${discordServerId}&theme=dark`}
            title="Team STEP Discord server"
          />
        ) : (
          <BBSList
            status={listStatus}
            items={posts.map(toBBSItem)}
            onRetry={error ? () => void loadPlatform(activeTab) : undefined}
          />
        )}
      </BBSTerminal>
    </div>
  );
}
