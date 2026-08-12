import "./BrandLogo.css";
import { brandLogoSvgs } from "./svgs.js";

/**
 * Logo visual treatment.
 *
 * "brand-filled" — filled circle with stroked border, multicolor brand gradient
 * "brand-hollow" — transparent circle, multicolor brand gradient
 *
 * @public
 */
export type LogoVariant = "brand-filled" | "brand-hollow";

/**
 * Props for {@link BrandLogo}.
 *
 * @public
 */
export interface BrandLogoProps {
  /** Visual treatment. Defaults to `"brand-filled"`. */
  variant?: LogoVariant;
}

/**
 * Full Team STEP brand lockup (circle mark + wordmark).
 *
 * @public
 */
export function BrandLogo({ variant = "brand-filled" }: BrandLogoProps) {
  return (
    <div className="ds-logo" role="img" aria-label="Team STEP">
      {brandLogoSvgs[variant]}
    </div>
  );
}
