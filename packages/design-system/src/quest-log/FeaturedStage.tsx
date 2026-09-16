import type { ReactNode } from "react";
import type { CtaIcon } from "../primitives/Cta.js";
import { Cta } from "../primitives/Cta.js";
import { Badge } from "./Badge.js";
import "./FeaturedStage.css";

/**
 * Flat CTA entry for {@link FeaturedStage}.
 *
 * @public
 */
export interface FeaturedStageCta {
  /** Visual hierarchy — `primary` for play, `secondary` for wishlist / coming-soon. */
  variant: "primary" | "secondary";
  /** Text-only label — no Unicode glyphs; icons come from `icon`. */
  label: string;
  /** Destination URL. */
  href: string;
  /**
   * Leading platform/store/download mark.
   *
   * @hatch
   */
  icon?: CtaIcon;
}

/**
 * Props for {@link FeaturedStage}.
 *
 * @public
 */
export interface FeaturedStageProps {
  /** Game title. */
  title: string;
  /** Subtitle shown above the title. */
  subtitle: string;
  /** Longer description paragraph. */
  description: string;
  /** Key art / video slot — pass {@link VideoFacade} or a plain poster `<img>`. */
  media: ReactNode;
  /** Flat CTA row (no nested PlatformAccess). */
  ctas: FeaturedStageCta[];
  /** When true, shows the in-development badge alongside main-quest. */
  inDevelopment?: boolean;
}

/**
 * Full-viewport featured conversion stage for the current main-quest original (hybrid-boot v3).
 * Game-agnostic — content comes from props. Always badges as main-quest; optionally
 * in-development. Flat CTA row — no PlatformAccess.
 *
 * @public
 */
export function FeaturedStage({
  title,
  subtitle,
  description,
  media,
  ctas,
  inDevelopment = false,
}: FeaturedStageProps) {
  return (
    <section className="ds-featured-stage">
      <div className="ds-featured-stage__badges">
        <Badge variant="main-quest" />
        {inDevelopment ? <Badge variant="in-development" /> : null}
      </div>
      <div className="ds-featured-stage__media">{media}</div>
      <div className="ds-featured-stage__meta">
        <p className="ds-featured-stage__subtitle">{subtitle}</p>
        <h2 className="ds-featured-stage__title">{title}</h2>
        <p className="ds-featured-stage__description">{description}</p>
        <div className="ds-featured-stage__ctas">
          {ctas.map((cta) => (
            <Cta key={`${cta.href}-${cta.label}`} variant={cta.variant} icon={cta.icon} href={cta.href}>
              {cta.label}
            </Cta>
          ))}
        </div>
      </div>
    </section>
  );
}
