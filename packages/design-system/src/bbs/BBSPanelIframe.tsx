import { ScanlineOverlay } from "../effects/ScanlineOverlay.js";
import { VignetteOverlay } from "../effects/VignetteOverlay.js";
import "./BBSPanelIframe.css";

/**
 * Props for {@link BBSPanelIframe}.
 *
 * @public
 */
export interface BBSPanelIframeProps {
  /** Discord server ID for the widget embed. */
  serverId: string;
  /** Accessible title for the iframe. */
  title: string;
}

/**
 * Discord widget panel with brand filter + overlays. Verify Safari rendering manually before
 * release (§4 B3).
 *
 * @public
 */
export function BBSPanelIframe({ serverId, title }: BBSPanelIframeProps) {
  return (
    <div className="ds-bbs-panel-iframe">
      <iframe
        className="ds-bbs-panel-iframe__frame"
        src={`https://discord.com/widget?id=${serverId}&theme=dark`}
        title={title}
        loading="lazy"
      />
      <ScanlineOverlay />
      <VignetteOverlay />
    </div>
  );
}
