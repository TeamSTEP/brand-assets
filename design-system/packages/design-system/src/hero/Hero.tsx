import { useRef } from "react";
import { PixelGrid } from "../effects/PixelGrid.js";
import { useIdleFloat } from "../hooks/useIdleFloat.js";
import { Cta } from "../ui/Cta.js";
import "./Hero.css";

/** @public */
export interface HeroProps {
  eyebrow: string;
  title: string;
  tagline: string;
  ctaHref: string;
  /** Defaults to "▶ ENTER THE GUILD" — the studio ambient CTA, not a game CTA. */
  ctaLabel?: string;
  logoMarkSrc: string;
  logoMarkAlt: string;
  /** Idle-float on the logo ring. Defaults to `true`; disabled when reduced motion is preferred. */
  logoAnimated?: boolean;
}

/**
 * Landing-page hero section (wireframe §01): 80vh, pixel-grid background, 60/40 split with
 * logo mark on desktop. Logo ring uses `useIdleFloat` unless reduced motion is preferred.
 * Mobile hides the logo mark and swaps the scroll cue copy.
 *
 * @public
 */
export function Hero({
  eyebrow,
  title,
  tagline,
  ctaHref,
  ctaLabel = "▶ ENTER THE GUILD",
  logoMarkSrc,
  logoMarkAlt,
  logoAnimated = true,
}: HeroProps) {
  const logoRingRef = useRef<HTMLDivElement>(null);
  useIdleFloat(logoRingRef, logoAnimated);

  return (
    <section className="ds-hero">
      <PixelGrid />
      <div className="ds-hero__inner">
        <div className="ds-hero__content">
          <p className="ds-hero__eyebrow">{eyebrow}</p>
          <h1 className="ds-hero__title">{title}</h1>
          <p className="ds-hero__tagline">{tagline}</p>
          <Cta variant="ghost" href={ctaHref}>
            {ctaLabel}
          </Cta>
          <div className="ds-hero__scroll ds-hero__scroll--desktop" aria-hidden="true">
            <span className="ds-hero__scroll-line" />
            <span className="ds-hero__scroll-label">scroll</span>
          </div>
          <p className="ds-hero__scroll ds-hero__scroll--mobile">Tap anywhere to explore</p>
        </div>
        <div className="ds-hero__logo">
          <div ref={logoRingRef} className="ds-hero__logo-ring">
            <img className="ds-hero__logo-mark" src={logoMarkSrc} alt={logoMarkAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
