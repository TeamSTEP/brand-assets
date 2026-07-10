import "./Badge.css";

/**
 * Closed set of badge meanings used across the Quest Log.
 * "main-quest" and "in-development" pulse; "side-quest" and "legacy" are static. Label text
 * and color are derived entirely from the variant — there is no separate label/color prop,
 * so a caller can't introduce an off-brand combination.
 */
export type BadgeVariant = "main-quest" | "side-quest" | "legacy" | "in-development";

const LABEL: Record<BadgeVariant, string> = {
  "main-quest": "MAIN QUEST",
  "side-quest": "SIDE QUEST",
  legacy: "LEGACY",
  "in-development": "IN DEVELOPMENT",
};

const PULSES: Record<BadgeVariant, boolean> = {
  "main-quest": true,
  "side-quest": false,
  legacy: false,
  "in-development": true,
};

/** @public */
export interface BadgeProps {
  variant: BadgeVariant;
}

/** @public */
export function Badge({ variant }: BadgeProps) {
  return (
    <span className={`ds-badge ds-badge--${variant}`}>
      {PULSES[variant] && <span className="ds-badge__dot" aria-hidden="true" />}
      {LABEL[variant]}
    </span>
  );
}
