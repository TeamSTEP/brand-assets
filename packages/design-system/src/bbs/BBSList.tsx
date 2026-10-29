import type { ReactNode, Ref } from "react";
import { StaticNoiseOverlay } from "../effects/StaticNoiseOverlay.js";
import { BBSListItem } from "./BBSListItem.js";
import type {
  BBSItem,
  BBSListDensity,
  BBSListStatus,
  BBSThumbnailFit,
  BBSThumbnailPlacement,
} from "./types.js";
import "./BBSList.css";

/**
 * Props for {@link BBSList}.
 *
 * @public
 */
export interface BBSListProps {
  /** App-owned list lifecycle. */
  status: BBSListStatus;
  /**
   * Rows for the default renderer. Ignored when `children` is provided
   * (virtualization escape hatch).
   */
  items?: BBSItem[];
  /**
   * Custom list body (e.g. virtualizer). Status chrome and the end sentinel
   * still wrap this content. Consumer owns scroll-fetch / IntersectionObserver.
   */
  children?: ReactNode;
  /** Row spacing and body line clamp. Defaults to `comfortable`. */
  density?: BBSListDensity;
  /** Thumbnail layout passed to each default row. Defaults to `leading`. */
  thumbnailPlacement?: BBSThumbnailPlacement;
  /** Thumbnail object-fit passed to each default row. Defaults to `contain`. */
  thumbnailFit?: BBSThumbnailFit;
  /** Retry handler for `error` and `errorMore`. */
  onRetry?: () => void;
  /** Ref to the default `<ul>` (or omitted when only status chrome shows). */
  listRef?: Ref<HTMLUListElement>;
  /**
   * Ref to the end sentinel after rows when more pages may load.
   * Consumer observes this; the design system does not fetch.
   */
  endSentinelRef?: Ref<HTMLDivElement>;
}

function shouldShowSentinel(status: BBSListStatus, hasRows: boolean): boolean {
  if (!hasRows) {
    return false;
  }
  return status === "ready" || status === "loadingMore" || status === "errorMore";
}

/**
 * BBS feed list chrome: status UI, optional default rows, virtualization hooks.
 *
 * @public
 */
export function BBSList({
  status,
  items = [],
  children,
  density = "comfortable",
  thumbnailPlacement = "leading",
  thumbnailFit = "contain",
  onRetry,
  listRef,
  endSentinelRef,
}: BBSListProps) {
  const usingChildren = children !== undefined && children !== null;
  const hasRows = usingChildren || items.length > 0;
  const showSentinel = shouldShowSentinel(status, hasRows);

  if (status === "loading") {
    return (
      <div className="ds-bbs-list">
        <p className="ds-bbs-list__status">{"// ACQUIRING SIGNAL..."}</p>
      </div>
    );
  }

  if (status === "error" && !hasRows) {
    return (
      <div className="ds-bbs-list">
        <div className="ds-bbs-list__error">
          <StaticNoiseOverlay />
          <div className="ds-bbs-list__error-chrome">
            <p className="ds-bbs-list__status">{"// SIGNAL LOST"}</p>
            {onRetry ? (
              <button type="button" className="ds-bbs-list__retry" onClick={onRetry}>
                Retry
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (status === "ready" && !hasRows) {
    return (
      <div className="ds-bbs-list">
        <p className="ds-bbs-list__status">{"// NO SIGNAL"}</p>
      </div>
    );
  }

  const listBody = usingChildren ? (
    children
  ) : (
    <ul className="ds-bbs-list__items" ref={listRef}>
      {items.map((item) => (
        <BBSListItem
          key={item.id}
          item={item}
          density={density}
          thumbnailPlacement={thumbnailPlacement}
          thumbnailFit={thumbnailFit}
        />
      ))}
    </ul>
  );

  return (
    <div className="ds-bbs-list">
      {listBody}
      {status === "loadingMore" ? (
        <p className="ds-bbs-list__status ds-bbs-list__status--footer">
          {"// ACQUIRING MORE..."}
        </p>
      ) : null}
      {status === "errorMore" ? (
        <div className="ds-bbs-list__status-block ds-bbs-list__status-block--footer">
          <p className="ds-bbs-list__status">{"// SIGNAL LOST"}</p>
          {onRetry ? (
            <button type="button" className="ds-bbs-list__retry" onClick={onRetry}>
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
      {showSentinel ? (
        <div
          className="ds-bbs-list__sentinel"
          ref={endSentinelRef}
          data-bbs-list-end=""
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
