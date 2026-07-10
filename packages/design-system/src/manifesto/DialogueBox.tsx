import { useRef } from "react";
import { useInView } from "../hooks/useInView.js";
import { useTypewriter } from "../hooks/useTypewriter.js";
import "./DialogueBox.css";

/**
 * Props for {@link DialogueBox}.
 *
 * @public
 */
export interface DialogueBoxProps {
  /** Avatar image URL (typically the studio logo mark). */
  avatarSrc: string;
  /** Accessible alt text for the avatar. */
  avatarAlt: string;
  /** Dialogue body text. */
  text: string;
  /** Typewriter-on-first-view. Defaults to `true`; reduced motion shows full text immediately. */
  animated?: boolean;
}

/**
 * NPC-style dialogue box for the Manifesto section. Typewriter reveal triggers on first
 * scroll into view when `animated` is true (the default).
 *
 * @public
 */
export function DialogueBox({
  avatarSrc,
  avatarAlt,
  text,
  animated = true,
}: DialogueBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(boxRef, { once: true, threshold: 0.35 });
  const displayedText = useTypewriter(text, { enabled: animated && isInView });

  return (
    <div ref={boxRef} className="ds-dialogue-box">
      <img className="ds-dialogue-box__avatar" src={avatarSrc} alt={avatarAlt} />
      <p className="ds-dialogue-box__text">{displayedText}</p>
    </div>
  );
}
