import "./BrandTitle.css";
import type { LogoVariant } from "./BrandLogo.js";
import { brandTitleSvgs } from "./svgs.js";

/**
 * Props for {@link BrandTitle}.
 *
 * @public
 */
export interface BrandTitleProps {
  /** Visual treatment. Defaults to `"brand-filled"`. */
  variant?: LogoVariant;
}

function resolveTitleVariant(variant: LogoVariant): Exclude<LogoVariant, "brand-hollow"> {
  if (variant === "brand-hollow") {
    console.warn(
      '[BrandTitle] variant "brand-hollow" has no SVG; falling back to "brand-filled".',
    );
    return "brand-filled";
  }
  return variant;
}

/**
 * Team STEP wordmark only (no circle mark).
 *
 * `"brand-hollow"` falls back to `"brand-filled"` (no hollow title artwork exists).
 *
 * @public
 */
export function BrandTitle({ variant = "brand-filled" }: BrandTitleProps) {
  const resolved = resolveTitleVariant(variant);
  return (
    <div className="ds-logo-title" role="img" aria-label="Team STEP">
      {brandTitleSvgs[resolved]}
    </div>
  );
}
