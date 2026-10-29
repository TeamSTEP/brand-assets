import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ScanlineOverlay } from "../effects/ScanlineOverlay.js";
import { VignetteOverlay } from "../effects/VignetteOverlay.js";
import { BBSTabIcon, type BBSTabIconName } from "../primitives/icons/icons.js";
import "./BBSTerminal.css";

export type { BBSTabIconName } from "../primitives/icons/icons.js";

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
   * Optional leading glyph from the closed icon set.
   */
  icon?: BBSTabIconName;
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
  /**
   * Visible active-tab title (and accessible name for the tab list / panel).
   * Update this when the active tab changes (typically the active tab's desktop label).
   */
  tabListLabel: string;
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
  tabListLabel,
  tabs,
  activeTabId,
  onTabChange,
  children,
}: BBSTerminalProps) {
  const reactId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const initial = tabs.findIndex((tab) => tab.id === activeTabId);
    return initial >= 0 ? initial : 0;
  });

  useEffect(() => {
    const selectedIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    if (selectedIndex >= 0) {
      setFocusedIndex(selectedIndex);
    }
  }, [activeTabId, tabs]);

  const focusTabAt = useCallback(
    (index: number) => {
      const next = ((index % tabs.length) + tabs.length) % tabs.length;
      setFocusedIndex(next);
      tabRefs.current[next]?.focus();
    },
    [tabs.length],
  );

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTabAt(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTabAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTabAt(0);
        break;
      case "End":
        event.preventDefault();
        focusTabAt(tabs.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onTabChange(tabs[index]?.id ?? activeTabId);
        break;
      default:
        break;
    }
  };

  const panelId = `${reactId}-panel`;
  const headingId = `${reactId}-heading`;
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const activeTabDomId = activeTab ? `${reactId}-tab-${activeTab.id}` : undefined;

  return (
    <div className="ds-bbs-terminal">
      <div className="ds-bbs-terminal__top">
        <span className="ds-bbs-terminal__dot" aria-hidden="true" />
        <span className="ds-bbs-terminal__dot" aria-hidden="true" />
        <span className="ds-bbs-terminal__dot" aria-hidden="true" />
        <p className="ds-bbs-terminal__title">{title}</p>
      </div>
      <div className="ds-bbs-terminal__tabs" role="tablist" aria-labelledby={headingId}>
        {tabs.map((tab, index) => {
          const selected = tab.id === activeTabId;
          const tabDomId = `${reactId}-tab-${tab.id}`;
          const badgeModifier = tab.badge ? ` ds-bbs-terminal__tab--${tab.badge}` : "";
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={tabDomId}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={index === focusedIndex ? 0 : -1}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className={`ds-bbs-terminal__tab${badgeModifier}${
                selected ? " ds-bbs-terminal__tab--active" : ""
              }`}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              onFocus={() => setFocusedIndex(index)}
            >
              {tab.icon ? <BBSTabIcon name={tab.icon} /> : null}
              <span className="ds-bbs-terminal__tab-desktop">{tab.desktopLabel}</span>
              <span className="ds-bbs-terminal__tab-mobile">{tab.mobileLabel}</span>
            </button>
          );
        })}
      </div>
      <h2 className="ds-bbs-terminal__panel-title" id={headingId}>
        {tabListLabel}
      </h2>
      <div
        className="ds-bbs-terminal__body"
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${headingId}${activeTabDomId ? ` ${activeTabDomId}` : ""}`}
      >
        {children}
        <ScanlineOverlay />
        <VignetteOverlay />
      </div>
    </div>
  );
}
