import { useCallback, useEffect, useRef, useState } from "react";
import { BBSPanelAPI } from "./BBSPanelAPI.js";
import { BBSPanelIframe } from "./BBSPanelIframe.js";
import { BBSTerminal } from "./BBSTerminal.js";
import type { BBSTab } from "./BBSTerminal.js";
import type { FeedPlatform, UnifiedPost } from "./types.js";
import "./SocialFeed.css";

/**
 * Tab identifiers for {@link SocialFeed} (API feeds plus Discord iframe).
 *
 * @public
 */
export type SocialFeedTab = FeedPlatform | "discord";

/**
 * Props for {@link SocialFeed}.
 *
 * @public
 */
export interface SocialFeedProps {
  /** Feed API base URL. Defaults to `/api/feed`. */
  fetchEndpoint?: string;
  /** Discord server ID for the widget tab. */
  discordServerId: string;
}

const TABS: BBSTab[] = [
  {
    id: "bluesky",
    desktopLabel: "[F1] BLUESKY",
    mobileLabel: "BSKY",
    badge: "api",
  },
  {
    id: "substack",
    desktopLabel: "[F2] SUBSTACK",
    mobileLabel: "SUB",
    badge: "api",
  },
  {
    id: "youtube",
    desktopLabel: "[F3] YOUTUBE",
    mobileLabel: "YT",
    badge: "api",
  },
  {
    id: "discord",
    desktopLabel: "[F4] DISCORD",
    mobileLabel: "DC",
    badge: "widget",
  },
];

/**
 * BBS Board social feed with tab switching and per-platform response caching. Fetches via a
 * plain `fetch()` — it does not know whether `fetchEndpoint` is an Astro route.
 *
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

  return (
    <div className="ds-social-feed">
      <BBSTerminal
        title="BBS·TEAMSTEP·v1.0 ─ SIGNAL ACQUIRED"
        tabs={TABS}
        activeTabId={activeTab}
        onTabChange={onTabChange}
      >
        {activeTab === "discord" ? (
          <BBSPanelIframe serverId={discordServerId} title="Team STEP Discord server" />
        ) : loading ? (
          <p className="ds-social-feed__status">{"// ACQUIRING SIGNAL..."}</p>
        ) : error ? (
          <p className="ds-social-feed__status">{`// ${error.toUpperCase()}`}</p>
        ) : (
          <BBSPanelAPI posts={posts} />
        )}
      </BBSTerminal>
    </div>
  );
}
