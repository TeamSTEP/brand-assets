import "./VignetteOverlay.css";

/**
 * Decorative radial vignette overlay. Renders as an
 * absolutely-positioned, non-interactive overlay — place inside a `position: relative`
 * container so it fills that container. Commonly paired with {@link ScanlineOverlay}
 * on the same wrapper.
 *
 * @public
 */
export function VignetteOverlay() {
  return <div className="ds-vignette-overlay" aria-hidden="true" />;
}
