import type { ReactNode } from "react";
import "./IconButton.css";

/**
 * Icon-only button sizing. `sm` is a plain glyph control (close buttons); `lg` is a
 * circular chrome control with a minimum 44px touch target (play overlays).
 *
 * @public
 */
export type IconButtonSize = "sm" | "lg";

/**
 * Props for {@link IconButton}.
 *
 * @public
 */
export interface IconButtonProps {
  /** Single-glyph icon content (caller-supplied character or element). */
  children: ReactNode;
  /** Required accessible name — icon buttons have no visible label. */
  "aria-label": string;
  /** Click handler. */
  onClick: () => void;
  /** Visual size and chrome treatment. Defaults to `sm`. */
  size?: IconButtonSize;
}

/**
 * Icon-only action button with a shared unstyled reset. No `href` variant — these are
 * always actions, never navigation.
 *
 * @public
 */
export function IconButton({ children, "aria-label": ariaLabel, onClick, size = "sm" }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`ds-icon-button ds-icon-button--${size}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
