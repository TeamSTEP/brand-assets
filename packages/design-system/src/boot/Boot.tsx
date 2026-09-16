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
  /** Destination for the ghost CTA. */
  ctaHref: string;
  /** Defaults to "ENTER" — the studio ambient CTA, not a game CTA. */
  ctaLabel?: string;
  /** Logo mark image URL for the desktop ring. */
  logoMarkSrc: string;
  /** Accessible alt text for the logo mark. */
  logoMarkAlt: string;
  /** Idle-float on the logo ring. Defaults to `true`; disabled when reduced motion is preferred. */
  logoAnimated?: boolean;
  /** Label shown in the bottom peek strip (e.g. Meltdown continuity cue). */
  peekLabel: string;
  /** Optional background image for the peek strip. */
  peekSrc?: string;
}

/**
 * Landing-page boot section (hybrid-boot v3): ~60vh, pixel-grid background, 60/40 split with
 * logo mark on desktop, and a bottom peek strip into the featured conversion stage. Brand
 * lockup replaces the former text wordmark. Logo ring uses `useIdleFloat` unless reduced
 * motion is preferred. Mobile hides the logo mark and swaps the scroll cue copy.
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
  peekSrc,
}: BootProps) {
  const logoRingRef = useRef<HTMLDivElement>(null);
  useIdleFloat(logoRingRef, logoAnimated);

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
          <div className="ds-boot__scroll ds-boot__scroll--desktop" aria-hidden="true">
            <span className="ds-boot__scroll-line" />
            <span className="ds-boot__scroll-label">scroll</span>
          </div>
          <p className="ds-boot__scroll ds-boot__scroll--mobile">Tap anywhere to explore</p>
        </div>
        <div className="ds-boot__logo">
          <div ref={logoRingRef} className="ds-boot__logo-ring">
            <img className="ds-boot__logo-mark" src={logoMarkSrc} alt={logoMarkAlt} />
          </div>
        </div>
      </div>
      <div className="ds-boot__peek" aria-hidden="true">
        {peekSrc ? <img className="ds-boot__peek-image" src={peekSrc} alt="" /> : null}
        <span className="ds-boot__peek-label">{peekLabel}</span>
      </div>
    </section>
  );
}
