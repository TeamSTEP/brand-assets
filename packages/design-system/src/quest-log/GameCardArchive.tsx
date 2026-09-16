import type { CtaIcon } from "../primitives/Cta.js";
import type { BadgeVariant } from "./Badge.js";
import { Badge } from "./Badge.js";
import { Card } from "../primitives/Card.js";
import { Cta } from "../primitives/Cta.js";
import "./GameCardArchive.css";

/**
 * Quest Log compact-card phases. Subset of {@link BadgeVariant}.
 *
 * @public
 */
export type GameCardArchiveStatus = Extract<BadgeVariant, "legacy" | "released" | "prototype">;

/**
 * CTA link on a Quest Log compact game card.
 *
 * @public
 */
export interface GameCardArchiveCta {
  /**
   * Leading content mark — required because compact rows don't carry `platform`/`tier`.
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
  /** Phase badge (`released`, `prototype`, or `legacy`). */
  status: GameCardArchiveStatus;
  /** Poster thumbnail URL. */
  posterSrc: string;
  /** Accessible alt text for the poster. */
  posterAlt: string;
  /** Single CTA for the row (ghost for legacy; primary/secondary via caller choice of icon + ghost). */
  cta: GameCardArchiveCta;
}

/**
 * Compact Quest Log card for non-featured originals. Opacity and border accent derive from
 * `status` — legacy is dimmed; released/prototype stay full opacity.
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
  const ctaVariant = status === "prototype" ? "secondary" : status === "released" ? "primary" : "ghost";

  return (
    <Card size="sm">
      <div className={`ds-game-card-archive__layout ds-game-card-archive__layout--${status}`}>
        <img className="ds-game-card-archive__thumb" src={posterSrc} alt={posterAlt} />
        <div className="ds-game-card-archive__body">
          <Badge variant={status} />
          <h3 className="ds-game-card-archive__title">{title}</h3>
          <p className="ds-game-card-archive__description">{description}</p>
          <Cta variant={ctaVariant} icon={cta.icon} href={cta.url}>
            {cta.label}
          </Cta>
        </div>
      </div>
    </Card>
  );
}
