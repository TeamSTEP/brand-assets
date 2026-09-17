import type { ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GamepadIcon,
  HexagonIcon,
  PlayIcon,
} from "./icons/icons.js";
import "./Cta.css";

/**
 * `primary` is game-card-scoped (game-green); do not use it outside a game card.
 *
 * @public
 */
export type CtaVariant = "primary" | "secondary" | "contact" | "ghost" | "inspect" | "ambient";

/**
 * Leading platform/store mark; purpose arrows come from {@link CtaVariant}.
 *
 * @hatch
 *
 * @public
 */
export type CtaIcon = "hexagon" | "gamepad" | "download";

/**
 * Props for {@link Cta}.
 *
 * @public
 */
export interface CtaProps {
  /** Visual hierarchy and purpose icon — `primary` is for game-card demo-play contexts only. */
  variant: CtaVariant;
  /**
   * Leading platform/store/download mark. Do not use for purpose arrows (those come from
   * `variant`). Ignored when `variant` is `ambient` (ambient always leads with play).
   *
   * @hatch
   */
  icon?: CtaIcon;
  /** Text-only label — no Unicode glyphs; icons come from `variant` / `icon`. */
  children: ReactNode;
  /** When set, renders an `<a>` for navigation. */
  href?: string;
  /** When set (and `href` is omitted), renders a `<button>`. */
  onClick?: () => void;
}

function leadingHatchIcon(icon: CtaIcon): ReactNode {
  switch (icon) {
    case "hexagon":
      return <HexagonIcon />;
    case "gamepad":
      return <GamepadIcon />;
    case "download":
      return <ArrowDownIcon />;
  }
}

function ctaIcons(variant: CtaVariant, icon: CtaIcon | undefined): { leading: ReactNode; trailing: ReactNode } {
  if (variant === "ambient") {
    return { leading: <PlayIcon />, trailing: null };
  }

  const leading = icon ? leadingHatchIcon(icon) : null;
  if (variant === "contact") {
    return { leading, trailing: <ArrowRightIcon /> };
  }
  if (variant === "inspect") {
    return { leading, trailing: <ArrowUpRightIcon /> };
  }
  return { leading, trailing: null };
}

function chromeModifier(variant: CtaVariant): string {
  if (variant === "contact") {
    return "secondary";
  }
  if (variant === "inspect" || variant === "ambient") {
    return "ghost";
  }
  return variant;
}

/**
 * Branded CTA; renders `<a>` when `href` is set, otherwise `<button>`.
 *
 * @public
 */
export function Cta({ variant, icon, children, href, onClick }: CtaProps) {
  const className = `ds-cta ds-cta--${chromeModifier(variant)}`;
  const { leading, trailing } = ctaIcons(variant, icon);

  const content = (
    <>
      {leading ? (
        <span className="ds-cta__icon" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      {children}
      {trailing ? (
        <span className="ds-cta__icon" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
