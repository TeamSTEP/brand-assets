import "./DialogueBox.css";

/** @public */
export interface DialogueBoxProps {
  avatarSrc: string;
  avatarAlt: string;
  text: string;
}

/**
 * NPC-style dialogue box for the Manifesto section,
 * with the studio logo mark as the speaker avatar. This is the static shell only — the
 * spec's typewriter-on-first-scroll effect is a scroll-triggered animation that belongs in
 * a hook (`useTypewriter`, per the architecture proposal §4), added in a later pass once
 * interactive components are in scope. Renders the full text immediately.
 *
 * @public
 */
export function DialogueBox({ avatarSrc, avatarAlt, text }: DialogueBoxProps) {
  return (
    <div className="ds-dialogue-box">
      <img className="ds-dialogue-box__avatar" src={avatarSrc} alt={avatarAlt} />
      <p className="ds-dialogue-box__text">{text}</p>
    </div>
  );
}
