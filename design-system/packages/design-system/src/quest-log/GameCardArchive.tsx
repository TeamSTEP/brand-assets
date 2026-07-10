import type { BadgeVariant } from "./Badge.js";
import { Badge } from "./Badge.js";
import { Cta } from "../ui/Cta.js";
import "./GameCardArchive.css";

/**
 * Archive-row games only use two of Badge's four variants — reusing the literal subset
 * (instead of a separate union) keeps this type from drifting out of sync with Badge.
 *
 * @public
 */
export type GameCardArchiveStatus = Extract<BadgeVariant, "legacy" | "side-quest">;

/** @public */
export interface GameCardArchiveCta {
  label: string;
  url: string;
}

/** @public */
export interface GameCardArchiveProps {
  title: string;
  description: string;
  status: GameCardArchiveStatus;
  posterSrc: string;
  posterAlt: string;
  cta: GameCardArchiveCta;
}

/**
 * Archive-row game card. Used for "legacy" and "side-quest" games — "main-quest" uses
 * GameCardFeatured instead. Opacity (60% for legacy, 100% for side-quest) is derived from
 * `status`, matching the spec's mapping table; there's no separate opacity prop to
 * override it into an off-brand combination.
 *
 * @public
 */
export function GameCardArchive({
  title,
  description,
  status,
  posterSrc,
  posterAlt,
  cta,
}: GameCardArchiveProps) {
  return (
    <div className={`ds-game-card-archive ds-game-card-archive--${status}`}>
      <img className="ds-game-card-archive__thumb" src={posterSrc} alt={posterAlt} />
      <div className="ds-game-card-archive__body">
        <Badge variant={status} />
        <h3 className="ds-game-card-archive__title">{title}</h3>
        <p className="ds-game-card-archive__description">{description}</p>
        <Cta variant="ghost" href={cta.url}>
          {cta.label}
        </Cta>
      </div>
    </div>
  );
}
