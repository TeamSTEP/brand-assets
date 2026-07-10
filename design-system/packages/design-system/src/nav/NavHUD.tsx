import { useEffect, useState } from "react";
import "./NavHUD.css";

/**
 * One item in the mobile {@link NavHUD}.
 *
 * @public
 */
export interface NavHUDItem {
  /** Short label (e.g. `GAMES`). */
  label: string;
  /** `id` of the page section to observe for the active state. */
  sectionId: string;
}

/**
 * Props for {@link NavHUD}.
 *
 * @public
 */
export interface NavHUDProps {
  /** HUD items in display order. */
  items: NavHUDItem[];
}

/**
 * Mobile bottom HUD with active-section highlighting via `IntersectionObserver`.
 *
 * @public
 */
export function NavHUD({ items }: NavHUDProps) {
  const [activeSectionId, setActiveSectionId] = useState(items[0]?.sectionId ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.sectionId))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="ds-nav-hud" aria-label="Section navigation">
      <ul className="ds-nav-hud__list">
        {items.map((item) => {
          const isActive = item.sectionId === activeSectionId;
          return (
            <li key={item.sectionId} className="ds-nav-hud__item">
              <a
                className={`ds-nav-hud__link${isActive ? " ds-nav-hud__link--active" : ""}`}
                href={`#${item.sectionId}`}
              >
                {isActive ? <span className="ds-nav-hud__dot" aria-hidden="true" /> : null}
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
