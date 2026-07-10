/**
 * Feed platforms rendered by {@link SocialFeed} and {@link BBSPanelAPI}.
 *
 * @public
 */
export type FeedPlatform = "bluesky" | "substack" | "youtube";

/**
 * Shared post shape for API-backed BBS panels. Discord is iframe-only and does not use this
 * type.
 *
 * @public
 */
export interface UnifiedPost {
  /** Source platform for this post. */
  platform: FeedPlatform;
  /** Stable unique id from the upstream feed. */
  id: string;
  /** Author handle or display name. */
  author: string;
  /** Post body or title text. */
  text: string;
  /** Canonical URL for the post. */
  url: string;
  /** ISO 8601 publication timestamp. */
  date: string;
  /** YouTube thumbnail URL, when available. */
  thumb?: string;
}
