import "./BrandIcon.css";
import type { LogoVariant } from "./BrandLogo.js";
import { brandIconSvgs } from "./svgs.js";

/**
 * Props for {@link BrandIcon}.
 *
 * @public
 */
export interface BrandIconProps {
  /** Visual treatment. Defaults to `"brand-filled"`. */
  variant?: LogoVariant;
}

/**
 * Team STEP circle mark only (no wordmark).
 *
 * @public
 */
export function BrandIcon({ variant = "brand-filled" }: BrandIconProps) {
  return (
    <div className="ds-logo-icon" role="img" aria-label="Team STEP">
      {brandIconSvgs[variant]}
    </div>
  );
}
