import type { ReactNode } from "react";
import { Card } from "../primitives/Card.js";
import { Cta } from "../primitives/Cta.js";
import "./ServiceCard.css";

/**
 * Props for {@link ServiceCard}.
 *
 * @public
 */
export interface ServiceCardProps {
  /** Service icon slot (caller-supplied SVG or image). */
  icon: ReactNode;
  /** Service name. */
  title: string;
  /** Short card description. */
  description: string;
  /** Called when the visitor clicks INSPECT ITEM — open {@link ServiceInspectPanel} in the consumer. */
  onInspect: () => void;
}

/**
 * Inventory card for the Services section. This is
 * the static shell only — clicking "INSPECT ITEM ↗" calls `onInspect`, but the slide-up
 * modal / bottom-sheet it's meant to open is a separate component this card doesn't know
 * about, keeping the card decoupled from any one interaction implementation.
 *
 * @public
 */
export function ServiceCard({ icon, title, description, onInspect }: ServiceCardProps) {
  return (
    <Card size="sm">
      <div className="ds-service-card__layout">
        <div className="ds-service-card__icon" aria-hidden="true">
          {icon}
        </div>
        <h3 className="ds-service-card__title">{title}</h3>
        <p className="ds-service-card__description">{description}</p>
        <Cta variant="ghost" onClick={onInspect}>
          INSPECT ITEM ↗
        </Cta>
      </div>
    </Card>
  );
}
