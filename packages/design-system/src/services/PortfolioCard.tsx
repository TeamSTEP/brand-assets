import { Badge } from "../quest-log/Badge.js";
import { Card } from "../primitives/Card.js";
import { Cta } from "../primitives/Cta.js";
import "./PortfolioCard.css";

/**
 * Props for {@link PortfolioCard}.
 *
 * @public
 */
export interface PortfolioCardProps {
  /** Project title. */
  title: string;
  /** Client or partner name. */
  client: string;
  /** Project year. */
  year: number;
  /** Short description. */
  description: string;
  /** Case study art URL. */
  posterSrc: string;
  /** Accessible alt text for the poster. */
  posterAlt: string;
  /** Case study / external URL. */
  caseHref: string;
}

/**
 * Client/commission portfolio card — teal chrome only; never game-world accents.
 *
 * @public
 */
export function PortfolioCard({
  title,
  client,
  year,
  description,
  posterSrc,
  posterAlt,
  caseHref,
}: PortfolioCardProps) {
  return (
    <Card size="md">
      <article className="ds-portfolio-card">
        <img className="ds-portfolio-card__thumb" src={posterSrc} alt={posterAlt} />
        <Badge variant="portfolio" />
        <p className="ds-portfolio-card__client">
          {client} · {year}
        </p>
        <h3 className="ds-portfolio-card__title">{title}</h3>
        <p className="ds-portfolio-card__description">{description}</p>
        <Cta variant="inspect" href={caseHref}>
          View case
        </Cta>
      </article>
    </Card>
  );
}
