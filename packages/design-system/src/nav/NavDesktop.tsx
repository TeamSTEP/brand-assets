import { useEffect, useState } from "react";
import { Cta } from "../primitives/Cta.js";
import "./NavDesktop.css";

/**
 * One anchor link in {@link NavDesktop}.
 *
 * @public
 */
export interface NavDesktopLink {
  /** Link label (e.g. `HOME`). */
  label: string;
  /** Section anchor href (e.g. `#hero`). */
  href: string;
}

/**
 * Props for {@link NavDesktop}.
 *
 * @public
 */
export interface NavDesktopProps {
  /** Logo image URL. */
  logoSrc: string;
  /** Accessible alt text for the logo. */
  logoAlt: string;
  /** Centre navigation links. */
  links: NavDesktopLink[];
  /** Destination for the CONTACT ghost CTA. */
  contactHref: string;
}

/**
 * Sticky desktop top bar. Frosted background after scroll is owned internally.
 *
 * @public
 */
export function NavDesktop({ logoSrc, logoAlt, links, contactHref }: NavDesktopProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`ds-nav-desktop${scrolled ? " ds-nav-desktop--scrolled" : ""}`}>
      <div className="ds-nav-desktop__inner">
        <a className="ds-nav-desktop__logo" href="#hero">
          <img src={logoSrc} alt={logoAlt} />
        </a>
        <nav className="ds-nav-desktop__links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} className="ds-nav-desktop__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <Cta variant="ghost" href={contactHref}>
          CONTACT
        </Cta>
      </div>
    </header>
  );
}
