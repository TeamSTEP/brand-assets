import { useEffect, type RefObject } from "react";
import { animate } from "motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

/**
 * Gentle idle float on a logo mark ring. Respects `prefers-reduced-motion` internally.
 *
 * @public
 */
export function useIdleFloat<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true,
): void {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const controls = animate(
      element,
      { y: [0, -10, 0] },
      { duration: 4, ease: "easeInOut", repeat: Infinity },
    );

    return () => controls.stop();
  }, [enabled, prefersReducedMotion, ref]);
}
