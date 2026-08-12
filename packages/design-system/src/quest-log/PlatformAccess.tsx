import { Card } from "../primitives/Card.js";
import type { CtaIcon } from "../primitives/Cta.js";
import { Cta } from "../primitives/Cta.js";
import { PlayIcon, StarIcon } from "../primitives/icons/icons.js";
import "./PlatformAccess.css";

/**
 * Supported game-store / browser platform identifiers for {@link PlatformAccess}.
 *
 * @public
 */
export type Platform = "steam" | "itch" | "gog" | "epic" | "browser";

/**
 * Access tier for a platform entry (demo, full game, free, or DLC).
 *
 * @public
 */
export type PlatformTier = "demo" | "full" | "free" | "dlc";

/**
 * Mirrors the shape of the Content Collection's `platforms` field as a plain type (no Zod
 * dependency in the library) — a mapper in the consuming app converts the real
 * `CollectionEntry<'games'>` platform entries into this shape.
 *
 * @public
 */
export interface PlatformEntry {
  /** Store or distribution channel. */
  platform: Platform;
  /** Release tier (demo, full, free, dlc). */
  tier: PlatformTier;
  /**
   * CTA label shown on the pill — text only, no Unicode glyphs. Leading icons are derived
   * from `platform` + `tier`.
   */
  label: string;
  /** Destination URL for the CTA. */
  url: string;
  /** When false, renders in the Coming Soon section. */
  available: boolean;
}

/**
 * Props for {@link PlatformAccess}.
 *
 * @public
 */
export interface PlatformAccessProps {
  /** Platform entries to split into Playable Now / Coming Soon. */
  platforms: PlatformEntry[];
}

function platformLeadingIcon(platform: Platform, tier: PlatformTier): CtaIcon {
  if (platform === "steam" || platform === "gog" || platform === "epic") {
    return "hexagon";
  }
  if (platform === "browser") {
    return "gamepad";
  }
  // itch
  return tier === "free" ? "download" : "gamepad";
}

/**
 * Splits `platforms` into "Playable Now" (green, primary CTA) and "Coming Soon" (amber,
 * secondary CTA) — each section hides entirely when its side of the split is empty, and the
 * whole panel renders nothing when both are empty. No empty-state placeholder is shown; an
 * empty panel communicates nothing a caller couldn't already tell from not rendering it.
 *
 * @public
 */
export function PlatformAccess({ platforms }: PlatformAccessProps) {
  const available = platforms.filter((entry) => entry.available);
  const coming = platforms.filter((entry) => !entry.available);

  if (available.length === 0 && coming.length === 0) {
    return null;
  }

  return (
    <Card size="sm" accent="game-border">
      <div className="ds-platform-access__layout">
        <div className="ds-platform-access__header">{"// PLATFORM ACCESS"}</div>
        {available.length > 0 && (
          <div className="ds-platform-access__section">
            <div className="ds-platform-access__label ds-platform-access__label--now">
              <span className="ds-platform-access__label-icon" aria-hidden="true">
                <PlayIcon />
              </span>
              PLAYABLE NOW
            </div>
            <div className="ds-platform-access__pills">
              {available.map((entry) => (
                <Cta
                  key={entry.url}
                  variant="primary"
                  icon={platformLeadingIcon(entry.platform, entry.tier)}
                  href={entry.url}
                >
                  {entry.label}
                </Cta>
              ))}
            </div>
          </div>
        )}
        {available.length > 0 && coming.length > 0 && <div className="ds-platform-access__divider" />}
        {coming.length > 0 && (
          <div className="ds-platform-access__section">
            <div className="ds-platform-access__label ds-platform-access__label--soon">
              <span className="ds-platform-access__label-icon" aria-hidden="true">
                <StarIcon />
              </span>
              COMING SOON
            </div>
            <div className="ds-platform-access__pills">
              {coming.map((entry) => (
                <Cta
                  key={entry.url}
                  variant="secondary"
                  icon={platformLeadingIcon(entry.platform, entry.tier)}
                  href={entry.url}
                >
                  {entry.label}
                </Cta>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
