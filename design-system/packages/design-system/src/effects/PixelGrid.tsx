import "./PixelGrid.css";

/**
 * Decorative pixel-grid background layer (teamstep-landing-spec.md §2.4). Renders as an
 * absolutely-positioned, non-interactive overlay — place inside a `position: relative`
 * container (e.g. the Hero section) so it fills that container.
 *
 * @public
 */
export function PixelGrid() {
  return <div className="ds-pixel-grid" aria-hidden="true" />;
}
