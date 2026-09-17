import "./ScanlineOverlay.css";

/**
 * Absolute CRT scanline overlay; pair with {@link VignetteOverlay} in a relative container.
 *
 * @public
 */
export function ScanlineOverlay() {
  return <div className="ds-scanline-overlay" aria-hidden="true" />;
}
