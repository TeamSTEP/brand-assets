import { useRef } from "react";
import { PixelGrid } from "../effects/PixelGrid.js";
import { useIdleFloat } from "../hooks/useIdleFloat.js";
import { BrandLogo } from "../logo/BrandLogo.js";
import { Cta } from "../primitives/Cta.js";
import "./Boot.css";

/**
 * Props for {@link Boot}.
 *
 * @public
 */
export interface BootProps {
  /** Italic eyebrow line above the brand lockup. */
  eyebrow: string;
  /** Supporting tagline below the brand lockup. */
  tagline: string;
  /** Destination for the ghost CTA and peek teaser. */
  ctaHref: string;
  /** Defaults to "ENTER" — the studio ambient CTA, not a game CTA. */
  ctaLabel?: string;
  /** Logo mark image URL for the desktop ring. */
  logoMarkSrc: string;
  /** Accessible alt text for the logo mark. */
  logoMarkAlt: string;
  /** Idle-float on the logo ring. Defaults to `true`; disabled when reduced motion is preferred. */
  logoAnimated?: boolean;
  /** Kicker shown in the bottom peek strip (e.g. "Current project"). */
  peekLabel: string;
  /** Featured game title shown in the peek teaser. */
  peekTitle?: string;
  /** Short status line under the peek title (e.g. "Main quest · in development"). */
  peekMeta?: string;
  /** Optional framed thumbnail for the peek strip. */
  peekSrc?: string;
}

/**
 * Landing boot section (fills the first viewport under the sticky nav, pixel grid,
 * brand lockup, peek teaser into FeaturedStage).
 *
 * @public
 */
export function Boot({
  eyebrow,
  tagline,
  ctaHref,
  ctaLabel = "ENTER",
  logoMarkSrc,
  logoMarkAlt,
  logoAnimated = true,
  peekLabel,
  peekTitle,
  peekMeta,
  peekSrc,
}: BootProps) {
  const logoRingRef = useRef<HTMLDivElement>(null);
  useIdleFloat(logoRingRef, logoAnimated);

  const peekBody = (
    <>
      <div className="ds-boot__peek-copy">
        <span className="ds-boot__peek-label">{peekLabel}</span>
        {peekTitle ? <span className="ds-boot__peek-title">{peekTitle}</span> : null}
        {peekMeta ? <span className="ds-boot__peek-meta">{peekMeta}</span> : null}
      </div>
      {peekSrc ? (
        <div className="ds-boot__peek-thumb" aria-hidden="true">
          <img className="ds-boot__peek-thumb-image" src={peekSrc} alt="" />
        </div>
      ) : null}
    </>
  );

  return (
    <section className="ds-boot">
      <PixelGrid />
      <div className="ds-boot__inner">
        <div className="ds-boot__content">
          <p className="ds-boot__eyebrow">{eyebrow}</p>
          <h1 className="ds-boot__brand">
            <BrandLogo variant="brand-filled" />
          </h1>
          <p className="ds-boot__tagline">{tagline}</p>
          <Cta variant="ambient" href={ctaHref}>
            {ctaLabel}
          </Cta>
        </div>
        <div className="ds-boot__logo">
          <div ref={logoRingRef} className="ds-boot__logo-ring">
            <img className="ds-boot__logo-mark" src={logoMarkSrc} alt={logoMarkAlt} />
          </div>
        </div>
      </div>
      {peekTitle ? (
        <a className="ds-boot__peek" href={ctaHref}>
          {peekBody}
        </a>
      ) : (
        <div className="ds-boot__peek" aria-hidden="true">
          {peekBody}
        </div>
      )}
    </section>
  );
}
