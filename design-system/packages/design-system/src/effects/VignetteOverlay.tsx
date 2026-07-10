import "./VignetteOverlay.css";

/**
 * Decorative radial vignette overlay (teamstep-landing-spec.md §2.4). Renders as an
 * absolutely-positioned, non-interactive overlay — place inside a `position: relative`
 * container so it fills that container. Commonly paired with {@link ScanlineOverlay}
 * on the same wrapper.
 *
 * @public
 */
export function VignetteOverlay() {
  return <div className="ds-vignette-overlay" aria-hidden="true" />;
}
