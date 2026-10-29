import type {
  BBSItem,
  BBSListDensity,
  BBSThumbnailFit,
  BBSThumbnailPlacement,
} from "./types.js";
import "./BBSListItem.css";

/**
 * Props for {@link BBSListItem}.
 *
 * @public
 */
export interface BBSListItemProps {
  /** Row data; platform-free. */
  item: BBSItem;
  /** Row spacing and body line clamp. Defaults to `comfortable` (3 lines). */
  density?: BBSListDensity;
  /** Thumbnail beside text or stacked above. Defaults to `leading`. */
  thumbnailPlacement?: BBSThumbnailPlacement;
  /** Image object-fit. Defaults to `contain`. */
  thumbnailFit?: BBSThumbnailFit;
}

function hasBody(body: string | undefined): body is string {
  return typeof body === "string" && body.trim().length > 0;
}

/**
 * Single BBS feed row: entire row links out (new tab), optional clamped body,
 * optional thumb and date.
 *
 * @public
 */
export function BBSListItem({
  item,
  density = "comfortable",
  thumbnailPlacement = "leading",
  thumbnailFit = "contain",
}: BBSListItemProps) {
  const showBody = hasBody(item.body);
  const showThumb = Boolean(item.thumbnail);
  const showDate = Boolean(item.publishedAt);

  const className = [
    "ds-bbs-list-item",
    `ds-bbs-list-item--${density}`,
    `ds-bbs-list-item--${thumbnailPlacement}`,
    `ds-bbs-list-item--fit-${thumbnailFit}`,
    showBody ? "" : "ds-bbs-list-item--no-body",
    showThumb ? "" : "ds-bbs-list-item--no-thumb",
    showDate ? "" : "ds-bbs-list-item--no-date",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={className}>
      <a
        className="ds-bbs-list-item__link"
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.thumbnail ? (
          <div className="ds-bbs-list-item__thumb">
            <img
              className="ds-bbs-list-item__thumb-image"
              src={item.thumbnail.src}
              alt={item.thumbnail.alt}
            />
          </div>
        ) : null}
        <div className="ds-bbs-list-item__main">
          <div className="ds-bbs-list-item__headline">
            <span className="ds-bbs-list-item__name">{item.name}</span>
            {item.publishedAt ? (
              <time className="ds-bbs-list-item__date" dateTime={item.publishedAt}>
                {new Date(item.publishedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            ) : null}
          </div>
          {showBody ? <p className="ds-bbs-list-item__body">{item.body}</p> : null}
        </div>
      </a>
    </li>
  );
}
