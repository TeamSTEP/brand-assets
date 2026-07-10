import type { ReactNode } from "react";
import "./Cta.css";

/**
 * CTA hierarchy. "primary" is scoped to game-card demo-play
 * contexts (it reuses the game-green token, which the brand rules restrict to game-card
 * scope) — don't reach for "primary" outside a game card just because it's the boldest
 * option. "secondary" is for wishlist/coming-soon-style actions. "ghost" is the default for
 * everything else (archive cards, inspect triggers, secondary links).
 *
 * @public
 */
export type CtaVariant = "primary" | "secondary" | "ghost";

/**
 * Pass exactly one of `href` (renders an <a>, for navigation) or `onClick` (renders a
 * <button>, for in-page interaction) — not a discriminated union because that shape defeats
 * Storybook/CSF's args typing for this component. Passing both or neither isn't a
 * brand-safety issue (unlike variant), just a usage mistake, so it isn't worth the friction.
 *
 * @public
 */
export interface CtaProps {
  variant: CtaVariant;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

/** @public */
export function Cta({ variant, children, href, onClick }: CtaProps) {
  const className = `ds-cta ds-cta--${variant}`;

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
