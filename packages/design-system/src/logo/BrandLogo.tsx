import "./BrandLogo.css";
import { brandLogoSvgs } from "./svgs.js";

/**
 * Filled vs hollow logo mark treatment.
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
 * Combined circle mark + wordmark lockup.
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
