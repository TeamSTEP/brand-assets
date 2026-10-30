import "./StaticNoiseOverlay.css";

/**
 * Absolute CRT static-noise overlay; pair with a relative container.
 * Flickers unless the visitor prefers reduced motion.
 *
 * @public
 */
export function StaticNoiseOverlay() {
  return <div className="ds-static-noise-overlay" aria-hidden="true" />;
}
