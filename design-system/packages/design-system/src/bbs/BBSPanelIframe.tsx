import { ScanlineOverlay } from "../effects/ScanlineOverlay.js";
import { VignetteOverlay } from "../effects/VignetteOverlay.js";
import "./BBSPanelIframe.css";

/** @public */
export interface BBSPanelIframeProps {
  serverId: string;
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
