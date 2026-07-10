import { useEffect, useRef } from "react";
import { Cta } from "../ui/Cta.js";
import "./ServiceInspectPanel.css";

/** @public */
export interface ServiceInspectPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
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
        <button
          type="button"
          className="ds-service-inspect-panel__close"
          aria-label="Close inspect panel"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="ds-service-inspect-panel__title">{title}</h2>
        <p className="ds-service-inspect-panel__description">{description}</p>
        <Cta variant="secondary" href={contactHref}>
          GET IN TOUCH →
        </Cta>
      </div>
    </dialog>
  );
}
