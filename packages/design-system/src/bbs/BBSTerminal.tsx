import type { ReactNode } from "react";
import { ScanlineOverlay } from "../effects/ScanlineOverlay.js";
import { VignetteOverlay } from "../effects/VignetteOverlay.js";
import "./BBSTerminal.css";

/**
 * Live-data badge shown on a BBS tab (`api` or Discord `widget`).
 *
 * @public
 */
export type BBSTabBadge = "api" | "widget";

/**
 * One tab in {@link BBSTerminal}.
 *
 * @public
 */
export interface BBSTab {
  /** Unique tab id passed to `onTabChange`. */
  id: string;
  /** Desktop label (e.g. `Bluesky`). */
  desktopLabel: string;
  /** Short mobile label (e.g. `BSKY`). */
  mobileLabel: string;
  /**
   * Optional API/WIDGET chrome badge. Omit for quiet terminal tabs (hybrid-boot v3).
   */
  badge?: BBSTabBadge;
}

/**
 * Props for {@link BBSTerminal}.
 *
 * @public
 */
export interface BBSTerminalProps {
  /** Title bar text. */
  title: string;
  /** Tab definitions (labels + optional badge type). */
  tabs: BBSTab[];
  /** Id of the currently selected tab. */
  activeTabId: string;
  /** Called when the visitor selects a different tab. */
  onTabChange: (tabId: string) => void;
  /** Panel content rendered below the tab bar. */
  children: ReactNode;
}

/**
 * BBS terminal chrome; quiet when tabs omit `badge`.
 *
 * @public
 */
export function BBSTerminal({
  title,
  tabs,
  activeTabId,
  onTabChange,
  children,
}: BBSTerminalProps) {
  return (
    <div className="ds-bbs-terminal">
      <div className="ds-bbs-terminal__top">
        <span className="ds-bbs-terminal__dot" aria-hidden="true" />
        <span className="ds-bbs-terminal__dot" aria-hidden="true" />
        <span className="ds-bbs-terminal__dot" aria-hidden="true" />
        <p className="ds-bbs-terminal__title">{title}</p>
      </div>
      <div className="ds-bbs-terminal__tabs" role="tablist" aria-label="Social feed platforms">
        {tabs.map((tab) => {
          const selected = tab.id === activeTabId;
          const badgeModifier = tab.badge ? ` ds-bbs-terminal__tab--${tab.badge}` : "";
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`ds-bbs-terminal__tab${badgeModifier}${
                selected ? " ds-bbs-terminal__tab--active" : ""
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="ds-bbs-terminal__tab-desktop">{tab.desktopLabel}</span>
              <span className="ds-bbs-terminal__tab-mobile">{tab.mobileLabel}</span>
            </button>
          );
        })}
      </div>
      <div className="ds-bbs-terminal__body">
        {children}
        <ScanlineOverlay />
        <VignetteOverlay />
      </div>
    </div>
  );
}
