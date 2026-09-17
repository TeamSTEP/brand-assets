import { useEffect, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

/**
 * Options for {@link useInView}.
 *
 * @public
 */
export interface UseInViewOptions {
  /** Fire only the first time the element enters the viewport. */
  once?: boolean;
  /** Passed to `IntersectionObserver` (`rootMargin`). */
  rootMargin?: string;
  /** Passed to `IntersectionObserver` (`threshold`). */
  threshold?: number | number[];
}

/**
 * Scroll-triggered visibility; returns `true` immediately under reduced motion.
 *
 * @public
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = false, rootMargin = "0px", threshold = 0.2 }: UseInViewOptions = {},
): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isInView, setIsInView] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, prefersReducedMotion, ref, rootMargin, threshold]);

  return isInView;
}
