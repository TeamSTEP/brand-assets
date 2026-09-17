import "./BrandTitle.css";
import { brandTitleSvg } from "./svgs.js";

/**
 * Empty props bag for {@link BrandTitle} (no configurable inputs).
 *
 * @public
 */
export type BrandTitleProps = Record<string, never>;

/**
 * Team STEP wordmark only (no circle mark).
 *
 * @public
 */
export function BrandTitle(_props?: BrandTitleProps) {
  void _props;
  return (
    <div className="ds-logo-title" role="img" aria-label="Team STEP">
      {brandTitleSvg}
    </div>
  );
}
