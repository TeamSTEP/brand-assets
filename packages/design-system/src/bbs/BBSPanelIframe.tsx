import { ScanlineOverlay } from "../effects/ScanlineOverlay.js";
import { VignetteOverlay } from "../effects/VignetteOverlay.js";
import "./BBSPanelIframe.css";

/**
 * Props for {@link BBSPanelIframe}.
 *
 * @public
 */
export interface BBSPanelIframeProps {
  /** Absolute embed URL (e.g. Discord widget, SteamDB). Built by the consumer. */
  src: string;
  /** Accessible title for the iframe. */
  title: string;
}

/**
 * Terminal-styled iframe panel for any embed URL.
 *
 * @public
 */
export function BBSPanelIframe({ src, title }: BBSPanelIframeProps) {
  return (
    <div className="ds-bbs-panel-iframe">
      <iframe className="ds-bbs-panel-iframe__frame" src={src} title={title} loading="lazy" />
      <ScanlineOverlay />
      <VignetteOverlay />
    </div>
  );
}
