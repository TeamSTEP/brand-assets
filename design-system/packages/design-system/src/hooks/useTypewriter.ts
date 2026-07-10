import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

/**
 * Options for {@link useTypewriter}.
 *
 * @public
 */
export interface UseTypewriterOptions {
  /** When false, shows the full string immediately. */
  enabled?: boolean;
  /** Milliseconds per character. */
  speed?: number;
}

/**
 * Reveals `text` one character at a time. Respects `prefers-reduced-motion` internally.
 *
 * @public
 */
export function useTypewriter(
  text: string,
  { enabled = true, speed = 28 }: UseTypewriterOptions = {},
): string {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visibleCount, setVisibleCount] = useState(() =>
    !enabled || prefersReducedMotion ? text.length : 0,
  );

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      setVisibleCount(text.length);
      return;
    }

    setVisibleCount(0);
    if (text.length === 0) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [enabled, prefersReducedMotion, speed, text]);

  return text.slice(0, visibleCount);
}
