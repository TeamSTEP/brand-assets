import { PixelGrid } from "../effects/PixelGrid.js";
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
}

/**
 * Landing-page hero section (wireframe §01): 80vh, pixel-grid background, 60/40 split with
 * logo mark on desktop. Idle-float animation on the logo ring is Stage A (`useIdleFloat`) —
 * this is the static layout shell. Mobile hides the logo mark and swaps the scroll cue copy.
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
}: HeroProps) {
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
          <div className="ds-hero__logo-ring">
            <img className="ds-hero__logo-mark" src={logoMarkSrc} alt={logoMarkAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
