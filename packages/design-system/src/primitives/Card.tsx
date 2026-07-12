import type { ReactNode } from "react";
import "./Card.css";

/**
 * Card surface size — maps to `--radius-card-sm`, `--radius-card-md`, and
 * `--radius-card-lg` respectively.
 *
 * @public
 */
export type CardSize = "sm" | "md" | "lg";

/**
 * Border accent geometry for card surfaces. Encodes both color and border shape — not
 * just a color override.
 *
 * @hatch
 *
 * @public
 */
export type CardAccent = "none" | "game-border" | "game-top";

/**
 * Props for {@link Card}.
 *
 * @public
 */
export interface CardProps {
  /** Surface size controlling asymmetric border-radius. */
  size: CardSize;
  /**
   * Border accent treatment. Defaults to `none` (standard 1px default border).
   *
   * @hatch
   */
  accent?: CardAccent;
  /** Unconstrained card content — layout primitives own styling props, not content shape. */
  children: ReactNode;
}

/**
 * Branded card surface primitive. Renders a single `div` with token-driven background,
 * border, and asymmetric radius. No `as` prop in v1 — every current consumer uses `div`;
 * revisit if a semantic element need arises.
 *
 * @public
 */
export function Card({ size, accent = "none", children }: CardProps) {
  return (
    <div className={`ds-card ds-card--${size} ds-card--accent-${accent}`}>{children}</div>
  );
}
