import "./Icon.css";

const iconProps = {
  className: "ds-icon",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
  focusable: false as const,
};

/**
 * Right-triangle play mark (replaces ▶).
 *
 * @public
 */
export function PlayIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 3.5v9l8-4.5-8-4.5Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Right arrow (replaces →).
 *
 * @public
 */
export function ArrowRightIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M3 8h9M8.5 4.5 12.5 8l-4 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * External / inspect arrow (replaces ↗).
 *
 * @public
 */
export function ArrowUpRightIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * Download arrow (replaces ↓).
 *
 * @public
 */
export function ArrowDownIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M8 3v9M4.5 8.5 8 12l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * Close mark (replaces ×).
 *
 * @public
 */
export function CloseIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

/**
 * Store / Steam-style hexagon mark (replaces ⬡).
 *
 * @public
 */
export function HexagonIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M8 1.75 13.25 4.75v6.5L8 14.25 2.75 11.25v-6.5L8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * Coming-soon star (replaces ★).
 *
 * @public
 */
export function StarIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M8 1.5l1.7 3.7 4 .4-3 2.7.9 3.9L8 10.2l-3.6 2 0.9-3.9-3-2.7 4-.4L8 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Browser / itch play mark (replaces 🎮).
 *
 * @public
 */
export function GamepadIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M2.5 6.5h11a2 2 0 0 1 2 2v2a2.5 2.5 0 0 1-2.5 2.5h-1.2l-1.1-1.5H5.3L4.2 13H3A2.5 2.5 0 0 1 .5 10.5v-2a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8.25v3M3 9.75h3M10.25 9.25h.01M12 9.25h.01"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
