import type { CtaIcon } from "../primitives/Cta.js";
import type { BadgeVariant } from "./Badge.js";
import { Badge } from "./Badge.js";
import { Card } from "../primitives/Card.js";
import { Cta } from "../primitives/Cta.js";
import "./GameCardArchive.css";

/**
 * Archive-row games only use two of Badge's four variants — reusing the literal subset
 * (instead of a separate union) keeps this type from drifting out of sync with Badge.
 *
 * @public
 */
export type GameCardArchiveStatus = Extract<BadgeVariant, "legacy" | "side-quest">;

/**
 * CTA link on an archive game card.
 *
 * @public
 */
export interface GameCardArchiveCta {
  /**
   * Leading content mark — required because archive rows don't carry `platform`/`tier`.
   * Label text must not include glyphs.
   */
  icon: CtaIcon;
  /** Button label text — text only, no Unicode glyphs. */
  label: string;
  /** Destination URL. */
  url: string;
}

/**
 * Props for {@link GameCardArchive}.
 *
 * @public
 */
export interface GameCardArchiveProps {
  /** Game title. */
  title: string;
  /** Short description. */
  description: string;
  /** Archive-row badge variant (`legacy` or `side-quest`). */
  status: GameCardArchiveStatus;
  /** Poster thumbnail URL. */
  posterSrc: string;
  /** Accessible alt text for the poster. */
  posterAlt: string;
  /** Single ghost CTA for the archive row. */
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
    <Card size="sm">
      <div className={`ds-game-card-archive__layout ds-game-card-archive__layout--${status}`}>
        <img className="ds-game-card-archive__thumb" src={posterSrc} alt={posterAlt} />
        <div className="ds-game-card-archive__body">
          <Badge variant={status} />
          <h3 className="ds-game-card-archive__title">{title}</h3>
          <p className="ds-game-card-archive__description">{description}</p>
          <Cta variant="ghost" icon={cta.icon} href={cta.url}>
            {cta.label}
          </Cta>
        </div>
      </div>
    </Card>
  );
}
