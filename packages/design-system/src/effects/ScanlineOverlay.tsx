import "./ScanlineOverlay.css";

/**
 * Decorative CRT scanline overlay. Renders as an
 * absolutely-positioned, non-interactive overlay — place inside a `position: relative`
 * container (e.g. a BBS panel) so it fills that container. Commonly paired with
 * {@link VignetteOverlay} on the same wrapper.
 *
 * @public
 */
export function ScanlineOverlay() {
  return <div className="ds-scanline-overlay" aria-hidden="true" />;
}
