import type { UnifiedPost } from "./types.js";
import "./BBSPanelAPI.css";

/** @public */
export interface BBSPanelAPIProps {
  posts: UnifiedPost[];
}

/**
 * Branded mono feed panel for API-backed social platforms.
 *
 * @public
 */
export function BBSPanelAPI({ posts }: BBSPanelAPIProps) {
  if (posts.length === 0) {
    return <p className="ds-bbs-panel-api__empty">{"// NO SIGNAL"}</p>;
  }

  return (
    <ul className="ds-bbs-panel-api">
      {posts.map((post) => (
        <li key={post.id} className="ds-bbs-panel-api__row">
          <time className="ds-bbs-panel-api__date" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </time>
          <div className="ds-bbs-panel-api__content">
            <p className="ds-bbs-panel-api__meta">
              @{post.author} · {post.platform.toUpperCase()}
            </p>
            <a className="ds-bbs-panel-api__text" href={post.url}>
              {post.text}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
