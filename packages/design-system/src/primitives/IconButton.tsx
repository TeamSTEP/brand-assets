import { CloseIcon, PlayIcon } from "./icons/icons.js";
import "./IconButton.css";

/**
 * Icon-only button sizing. `sm` is a plain glyph control (close buttons); `lg` is a
 * circular chrome control with a minimum 44px touch target (play overlays).
 *
 * @public
 */
export type IconButtonSize = "sm" | "lg";

/**
 * Closed icon set for {@link IconButton}. Callers never pass Unicode glyphs.
 *
 * @public
 */
export type IconButtonIcon = "close" | "play";

/**
 * Props for {@link IconButton}.
 *
 * @public
 */
export interface IconButtonProps {
  /** Built-in icon — `close` (×) or `play` (▶). */
  icon: IconButtonIcon;
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
export function IconButton({ icon, "aria-label": ariaLabel, onClick, size = "sm" }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`ds-icon-button ds-icon-button--${size}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className="ds-icon-button__icon" aria-hidden="true">
        {icon === "close" ? <CloseIcon /> : <PlayIcon />}
      </span>
    </button>
  );
}
