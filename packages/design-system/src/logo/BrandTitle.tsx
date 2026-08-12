import "./BrandTitle.css";
import { brandTitleSvg } from "./svgs.js";

/**
 * Props for {@link BrandTitle}. Closed — no variants (filled wordmark only).
 *
 * @public
 */
export type BrandTitleProps = Record<string, never>;

/**
 * Team STEP wordmark only (no circle mark). Single filled treatment — no hollow variant.
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
