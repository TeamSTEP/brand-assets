import type { ReactNode } from "react";
import { Badge } from "./Badge.js";
import { PlatformAccess } from "./PlatformAccess.js";
import type { PlatformEntry } from "./PlatformAccess.js";
import "./GameCardFeatured.css";

/**
 * Props for {@link GameCardFeatured}.
 *
 * @public
 */
export interface GameCardFeaturedProps {
  /** Game title. */
  title: string;
  /** Subtitle shown above the title. */
  subtitle: string;
  /** Longer description paragraph. */
  description: string;
  /** Key art / video slot — pass {@link VideoFacade} or a plain poster `<img>`. */
  media: ReactNode;
  /** Platform entries driving PlatformAccess and the in-development badge. */
  platforms: PlatformEntry[];
}

/**
 * The single main-quest featured card (teamstep-landing-spec.md §3 Section 02 Quest Log;
 * §5.4 status → visual mapping) — always "MAIN QUEST", never a status prop, since this
 * component only ever renders the one main-quest game. The "IN DEVELOPMENT" badge isn't a
 * separate prop either: it's derived from `platforms` (true when a "full" tier entry isn't
 * yet available), so it can't drift out of sync with the platform data driving
 * PlatformAccess right below it.
 *
 * @public
 */
export function GameCardFeatured({ title, subtitle, description, media, platforms }: GameCardFeaturedProps) {
  const inDevelopment = platforms.some((entry) => entry.tier === "full" && !entry.available);

  return (
    <div className="ds-game-card-featured">
      <div className="ds-game-card-featured__header">
        <Badge variant="main-quest" />
        {inDevelopment && <Badge variant="in-development" />}
      </div>
      <div className="ds-game-card-featured__body">
        <div className="ds-game-card-featured__media">{media}</div>
        <div className="ds-game-card-featured__content">
          <div className="ds-game-card-featured__subtitle">{subtitle}</div>
          <h2 className="ds-game-card-featured__title">{title}</h2>
          <p className="ds-game-card-featured__description">{description}</p>
          <PlatformAccess platforms={platforms} />
        </div>
      </div>
    </div>
  );
}
