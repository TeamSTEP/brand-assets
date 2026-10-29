import type { BBSItem, UnifiedPost } from "./types.js";

/**
 * Maps a deprecated {@link UnifiedPost} onto a platform-free {@link BBSItem}.
 * Internal adapter only — not part of the public API.
 */
export function toBBSItem(post: UnifiedPost): BBSItem {
  return {
    id: post.id,
    name: `@${post.author} · ${post.platform.toUpperCase()}`,
    href: post.url,
    body: post.text,
    publishedAt: post.date,
    thumbnail: post.thumb ? { src: post.thumb, alt: "" } : undefined,
  };
}
