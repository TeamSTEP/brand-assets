import type { ReactNode } from "react";
import { Cta } from "../ui/Cta.js";
import "./ServiceCard.css";

/** @public */
export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
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
    <div className="ds-service-card">
      <div className="ds-service-card__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="ds-service-card__title">{title}</h3>
      <p className="ds-service-card__description">{description}</p>
      <Cta variant="ghost" onClick={onInspect}>
        INSPECT ITEM ↗
      </Cta>
    </div>
  );
}
