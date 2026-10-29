import { BBSList } from "./BBSList.js";
import { toBBSItem } from "./mapUnifiedPost.js";
import type { UnifiedPost } from "./types.js";

/**
 * Props for {@link BBSPanelAPI}.
 *
 * @deprecated Prefer {@link BBSListProps} with {@link BBSItem}.
 * @public
 */
export interface BBSPanelAPIProps {
  /** Feed items to render in the branded mono list. */
  posts: UnifiedPost[];
}

/**
 * Deprecated adapter: maps {@link UnifiedPost} onto {@link BBSList}.
 *
 * @deprecated Prefer {@link BBSList} / {@link BBSListItem} with {@link BBSItem}.
 * @public
 */
export function BBSPanelAPI({ posts }: BBSPanelAPIProps) {
  if (posts.length === 0) {
    return <BBSList status="ready" items={[]} />;
  }

  return <BBSList status="done" items={posts.map(toBBSItem)} />;
}
