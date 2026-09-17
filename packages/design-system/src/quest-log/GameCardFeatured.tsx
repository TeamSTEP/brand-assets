import type { ReactNode } from "react";
import { Badge } from "./Badge.js";
import { Card } from "../primitives/Card.js";
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
 * Main-quest featured card; IN DEVELOPMENT badge derives from pending `full` platforms.
 *
 * @deprecated Prefer {@link FeaturedStage} for the hybrid-boot v3 conversion stage.
 *
 * @public
 */
export function GameCardFeatured({ title, subtitle, description, media, platforms }: GameCardFeaturedProps) {
  const inDevelopment = platforms.some((entry) => entry.tier === "full" && !entry.available);

  return (
    <Card size="lg" accent="game-top">
      <div className="ds-game-card-featured__layout">
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
    </Card>
  );
}
