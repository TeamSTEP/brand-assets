import { useEffect, useRef } from "react";
import { Card } from "../primitives/Card.js";
import { Cta } from "../primitives/Cta.js";
import { IconButton } from "../primitives/IconButton.js";
import "./ServiceInspectPanel.css";

/**
 * Props for {@link ServiceInspectPanel}.
 *
 * @public
 */
export interface ServiceInspectPanelProps {
  /** Whether the panel is open. */
  open: boolean;
  /** Called when the panel should close (escape, backdrop click, or close button). */
  onClose: () => void;
  /** Service title shown in the panel header. */
  title: string;
  /** Full service description. */
  description: string;
  /** Destination for the GET IN TOUCH CTA. */
  contactHref: string;
}

/**
 * Branded inspect overlay for the Services section — slide-up panel on desktop, bottom sheet
 * on mobile. `ServiceCard` calls `onInspect`; the consumer owns `open` / `onClose` state.
 *
 * @public
 */
export function ServiceInspectPanel({
  open,
  onClose,
  title,
  description,
  contactHref,
}: ServiceInspectPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="ds-service-inspect-panel"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="ds-service-inspect-panel__sheet">
        <Card size="md">
          <IconButton size="sm" aria-label="Close inspect panel" onClick={onClose}>
            ×
          </IconButton>
          <h2 className="ds-service-inspect-panel__title">{title}</h2>
          <p className="ds-service-inspect-panel__description">{description}</p>
          <Cta variant="secondary" href={contactHref}>
            GET IN TOUCH →
          </Cta>
        </Card>
      </div>
    </dialog>
  );
}
