import type { ReactNode } from "react";
import "./Card.css";

/**
 * Card radius scale.
 *
 * @public
 */
export type CardSize = "sm" | "md" | "lg";

/**
 * Accent hatch: color plus border geometry, not a color-only override.
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
 * Token-driven card surface with optional game accent hatch.
 *
 * @public
 */
export function Card({ size, accent = "none", children }: CardProps) {
  return (
    <div className={`ds-card ds-card--${size} ds-card--accent-${accent}`}>{children}</div>
  );
}
