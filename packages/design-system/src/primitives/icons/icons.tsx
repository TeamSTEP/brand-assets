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

/**
 * Bluesky butterfly mark.
 *
 * @public
 */
export function BlueskyIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M3.5 4.5c1.8 1.4 3.2 3.4 4.5 5.6 1.3-2.2 2.7-4.2 4.5-5.6-1.2 2.8-2.4 5.1-3.2 7.1H6.7C5.9 9.6 4.7 7.3 3.5 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * YouTube play-in-screen mark.
 *
 * @public
 */
export function YoutubeIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M2.5 5.2c0-.9.7-1.7 1.6-1.7h7.8c.9 0 1.6.8 1.6 1.7v5.6c0 .9-.7 1.7-1.6 1.7H4.1c-.9 0-1.6-.8-1.6-1.7V5.2Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M7 5.8v4.4l3.5-2.2L7 5.8Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Reddit alien mark.
 *
 * @public
 */
export function RedditIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="8" cy="9" r="4.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="6.4" cy="8.6" r="0.7" fill="currentColor" />
      <circle cx="9.6" cy="8.6" r="0.7" fill="currentColor" />
      <path
        d="M8 4.2V3M10.8 4.6A1.2 1.2 0 1 0 9.5 3.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
      <path
        d="M6.2 10.4c.5.5 1.1.8 1.8.8s1.3-.3 1.8-.8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

/**
 * Steam network mark.
 *
 * @public
 */
export function SteamIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="10.2" cy="5.8" r="2.4" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10.2" cy="5.8" r="0.85" fill="currentColor" />
      <path
        d="M3.2 11.2 7.4 9.2l1.4-2.4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx="4.2" cy="11.5" r="1.6" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/**
 * Discord mark.
 *
 * @public
 */
export function DiscordIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M5.2 4.2c.7-.3 1.4-.5 2.2-.6h1.2c.8.1 1.5.3 2.2.6l.8 2.4c.5.2 1 .4 1.4.7l-.4 1.4c-.3 1.1-.8 2-1.4 2.8-.6.2-1.3.4-2 .5l-.8-1.1c-.3.1-.6.1-.9.1s-.6 0-.9-.1l-.8 1.1c-.7-.1-1.4-.3-2-.5-.6-.8-1.1-1.7-1.4-2.8L3 7.3c.4-.3.9-.5 1.4-.7l.8-2.4Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <circle cx="6.4" cy="8.2" r="0.7" fill="currentColor" />
      <circle cx="9.6" cy="8.2" r="0.7" fill="currentColor" />
    </svg>
  );
}

/**
 * Closed icon set for {@link BBSTab} leading glyphs.
 *
 * @public
 */
export type BBSTabIconName = "bluesky" | "youtube" | "reddit" | "steam" | "discord";

/**
 * Closed-set glyph for a {@link BBSTab}.
 *
 * @public
 */
export function BBSTabIcon({ name }: { name: BBSTabIconName }) {
  switch (name) {
    case "bluesky":
      return <BlueskyIcon />;
    case "youtube":
      return <YoutubeIcon />;
    case "reddit":
      return <RedditIcon />;
    case "steam":
      return <SteamIcon />;
    case "discord":
      return <DiscordIcon />;
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}
