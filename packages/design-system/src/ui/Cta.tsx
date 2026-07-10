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
 * Props for {@link Cta}.
 *
 * @public
 */
export interface CtaProps {
  /** Visual hierarchy — `primary` is for game-card demo-play contexts only. */
  variant: CtaVariant;
  /** Button or link label. */
  children: ReactNode;
  /** When set, renders an `<a>` for navigation. */
  href?: string;
  /** When set (and `href` is omitted), renders a `<button>`. */
  onClick?: () => void;
}

/**
 * Branded call-to-action control. Renders `<a>` when `href` is set, otherwise `<button>`.
 *
 * @public
 */
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
