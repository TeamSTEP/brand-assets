import { CloseIcon, PlayIcon } from "./icons/icons.js";
import "./IconButton.css";

/**
 * `sm` plain glyph; `lg` circular chrome with a 44px touch target.
 *
 * @public
 */
export type IconButtonSize = "sm" | "lg";

/**
 * Built-in glyph for {@link IconButton}.
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
 * Icon-only button with a required accessible name.
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
