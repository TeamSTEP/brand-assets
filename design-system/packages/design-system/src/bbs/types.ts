/** @public */
export type FeedPlatform = "bluesky" | "substack" | "youtube";

/**
 * Shared post shape for API-backed BBS panels. Discord is iframe-only and does not use this
 * type.
 *
 * @public
 */
export interface UnifiedPost {
  platform: FeedPlatform;
  id: string;
  author: string;
  text: string;
  url: string;
  /** ISO 8601 */
  date: string;
  /** YouTube thumbnails only. */
  thumb?: string;
}
