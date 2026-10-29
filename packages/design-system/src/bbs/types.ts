/**
 * Feed platforms rendered by {@link SocialFeed} and {@link BBSPanelAPI}.
 *
 * @deprecated Prefer app-owned providers mapped onto {@link BBSItem}.
 * @public
 */
export type FeedPlatform = "bluesky" | "substack" | "youtube";

/**
 * Post shape for API-backed BBS panels (not Discord iframe).
 *
 * @deprecated Prefer {@link BBSItem} with {@link BBSList} / {@link BBSListItem}.
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

/**
 * Optional thumbnail for a {@link BBSItem} row.
 *
 * @public
 */
export interface BBSItemThumbnail {
  /** Image URL. */
  src: string;
  /** Accessible alt; use `""` when the name already describes the image. */
  alt: string;
}

/**
 * Platform-free feed row for {@link BBSList} / {@link BBSListItem}.
 *
 * @public
 */
export interface BBSItem {
  /** Stable string, unique within the list. */
  id: string;
  /** Visible link text; non-empty. */
  name: string;
  /** Destination URL. */
  href: string;
  /** Plain text body; omit or whitespace-only to center the name beside the thumbnail. */
  body?: string;
  /** Optional leading/stacked image. */
  thumbnail?: BBSItemThumbnail;
  /** ISO 8601 timestamp; omit the date node when absent. */
  publishedAt?: string;
}

/**
 * Row spacing and body clamp for {@link BBSList} / {@link BBSListItem}.
 *
 * @public
 */
export type BBSListDensity = "compact" | "comfortable";

/**
 * Thumbnail layout relative to the text column.
 *
 * @public
 */
export type BBSThumbnailPlacement = "leading" | "above";

/**
 * How the thumbnail fills its frame.
 *
 * @public
 */
export type BBSThumbnailFit = "contain" | "cover";

/**
 * App-owned list lifecycle rendered by {@link BBSList}.
 *
 * @public
 */
export type BBSListStatus =
  | "loading"
  | "ready"
  | "error"
  | "loadingMore"
  | "errorMore"
  | "done";
