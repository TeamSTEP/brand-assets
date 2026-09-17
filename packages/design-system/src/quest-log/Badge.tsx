import "./Badge.css";

/**
 * Closed badge meanings — label, color, and pulse derive from the variant alone.
 *
 * @public
 */
export type BadgeVariant =
  | "main-quest"
  | "side-quest"
  | "legacy"
  | "in-development"
  | "released"
  | "prototype"
  | "portfolio";

const LABEL: Record<BadgeVariant, string> = {
  "main-quest": "MAIN QUEST",
  "side-quest": "SIDE QUEST",
  legacy: "LEGACY",
  "in-development": "IN DEVELOPMENT",
  released: "RELEASED",
  prototype: "PROTOTYPE",
  portfolio: "PORTFOLIO",
};

const PULSES: Record<BadgeVariant, boolean> = {
  "main-quest": true,
  "side-quest": false,
  legacy: false,
  "in-development": true,
  released: false,
  prototype: false,
  portfolio: false,
};

/**
 * Props for {@link Badge}.
 *
 * @public
 */
export interface BadgeProps {
  /** Which badge meaning to render (label, color, and pulse are derived from this). */
  variant: BadgeVariant;
}

/**
 * Quest Log / portfolio status badge. Label, color, and pulse are derived from `variant`.
 *
 * @public
 */
export function Badge({ variant }: BadgeProps) {
  return (
    <span className={`ds-badge ds-badge--${variant}`}>
      {PULSES[variant] && <span className="ds-badge__dot" aria-hidden="true" />}
      {LABEL[variant]}
    </span>
  );
}
