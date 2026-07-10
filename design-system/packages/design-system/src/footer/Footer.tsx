import type { ReactElement } from "react";
import "./Footer.css";

/** @public */
export type FooterSocialPlatform = "bluesky" | "substack" | "youtube" | "discord";

/** @public */
export interface FooterSocialLink {
  platform: FooterSocialPlatform;
  href: string;
  label: string;
}

/** @public */
export interface FooterProps {
  logoSrc: string;
  logoAlt: string;
  studioName: string;
  tagline: string;
  socials: FooterSocialLink[];
}

function SocialIcon({ platform }: { platform: FooterSocialPlatform }): ReactElement {
  switch (platform) {
    case "bluesky":
      return (
        <svg className="ds-footer__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.5 4.5C9.2 6.6 12.1 10.8 13 12c.9-1.2 3.8-5.4 6.5-7.5 1.9-1.6 5-.9 5 2.2 0 .5-.1 1.1-.3 1.6-1.1 3.9-5.1 13.2-7.2 13.2-1.3 0-2.3-2.1-3.2-3.9-.6 1.2-1.2 2.4-1.9 3.3-1.9 2.6-3.1 1.1-3.1-1.2V4.5c0-3.1 3.1-3.8 5-2.2z"
          />
        </svg>
      );
    case "substack":
      return (
        <svg className="ds-footer__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M4 4h16v3H4V4zm0 5h16v11H4V9z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="ds-footer__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.8a2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.5V8.5l6 3.5-6 3.5z"
          />
        </svg>
      );
    case "discord":
      return (
        <svg className="ds-footer__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.9 6.2A15.4 15.4 0 0 0 15.5 5l-.3.6a13.7 13.7 0 0 1 3.3 1.3 11.8 11.8 0 0 0-9.5 0 13.2 13.2 0 0 1 3.2-1.3l-.3-.6a15.2 15.2 0 0 0-3.4 1.2C4.7 8.8 3.6 12.8 4 16.7a15.5 15.5 0 0 0 4.7 2.4l.8-1.2a9.2 9.2 0 0 1-1.5-.7l.4-.3c2.9 1.3 6.1 1.3 9 0l.4.3a9.5 9.5 0 0 1-1.5.7l.8 1.2a15.4 15.4 0 0 0 4.7-2.4c.6-4.8-.5-8.7-3.1-10.5zM9.7 14.6c-.9 0-1.6-.8-1.6-1.7s.7-1.7 1.6-1.7 1.6.8 1.6 1.7-.7 1.7-1.6 1.7zm4.6 0c-.9 0-1.6-.8-1.6-1.7s.7-1.7 1.6-1.7 1.6.8 1.6 1.7-.7 1.7-1.6 1.7z"
          />
        </svg>
      );
  }
}

/**
 * End-credits footer (wireframe §06): centered logo, studio name, tagline, and social links.
 *
 * @public
 */
export function Footer({ logoSrc, logoAlt, studioName, tagline, socials }: FooterProps) {
  return (
    <footer className="ds-footer">
      <div className="ds-footer__inner">
        <img className="ds-footer__logo" src={logoSrc} alt={logoAlt} />
        <h2 className="ds-footer__studio">{studioName}</h2>
        <p className="ds-footer__tagline">{tagline}</p>
        <ul className="ds-footer__socials">
          {socials.map((social) => (
            <li key={social.platform}>
              <a className="ds-footer__social-link" href={social.href} aria-label={social.label}>
                <SocialIcon platform={social.platform} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
