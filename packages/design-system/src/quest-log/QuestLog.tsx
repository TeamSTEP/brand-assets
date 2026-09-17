import type { GameCardArchiveProps } from "./GameCardArchive.js";
import { GameCardArchive } from "./GameCardArchive.js";
import "./QuestLog.css";

/**
 * One phase group inside {@link QuestLog}.
 *
 * @public
 */
export interface QuestLogGroup {
  /** Phase key — used for layout hooks; label is display copy. */
  phase: "released" | "prototype" | "legacy";
  /** Group heading (e.g. "Released"). */
  label: string;
  /** Cards in this group. Empty arrays are omitted by {@link QuestLog}. */
  items: GameCardArchiveProps[];
}

/**
 * Props for {@link QuestLog}.
 *
 * @public
 */
export interface QuestLogProps {
  /** Section heading. */
  heading: string;
  /** Optional supporting sentence. */
  lede?: string;
  /** Phase groups; empty `items` groups are not rendered. */
  groups: QuestLogGroup[];
}

/**
 * Quest Log board of compact cards; empty groups are omitted.
 *
 * @public
 */
export function QuestLog({ heading, lede, groups }: QuestLogProps) {
  const visible = groups.filter((group) => group.items.length > 0);

  return (
    <section className="ds-quest-log">
      <div className="ds-quest-log__inner">
        <h2 className="ds-quest-log__heading">{heading}</h2>
        {lede ? <p className="ds-quest-log__lede">{lede}</p> : null}
        {visible.map((group) => (
          <div key={group.phase} className="ds-quest-log__group">
            <p className="ds-quest-log__group-label">{group.label}</p>
            <div
              className={
                group.phase === "legacy"
                  ? "ds-quest-log__grid ds-quest-log__grid--stack"
                  : "ds-quest-log__grid"
              }
            >
              {group.items.map((item) => (
                <GameCardArchive key={`${group.phase}-${item.title}`} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
