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
 * Static services shell; `onInspect` opens a separate panel.
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
        <Cta variant="inspect" onClick={onInspect}>
          INSPECT ITEM
        </Cta>
      </div>
    </Card>
  );
}
