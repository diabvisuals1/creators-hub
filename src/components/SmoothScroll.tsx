"use client";

import { useEffect } from "react";

/**
 * Global smooth-scroll for in-page anchor links (href="#section").
 * Intercepts clicks on any <a href="#..."> and animates the scroll with a
 * slow, eased motion instead of the instant browser jump. Accounts for the
 * sticky navbar height so sections aren't hidden underneath it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const NAV_OFFSET = 90; // sticky navbar height + breathing room
    const DURATION = 1100; // ms — slow & smooth

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let rafId = 0;

    const animateTo = (targetY: number, href: string) => {
      const startY = window.scrollY;
      const dist = targetY - startY;
      if (Math.abs(dist) < 2) return;
      const startT = performance.now();

      cancelAnimationFrame(rafId);
      const step = (now: number) => {
        const p = Math.min(1, (now - startT) / DURATION);
        window.scrollTo(0, startY + dist * easeInOutCubic(p));
        if (p < 1) {
          rafId = requestAnimationFrame(step);
        } else if (href) {
          history.replaceState(null, "", href);
        }
      };
      rafId = requestAnimationFrame(step);
    };

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = anchor.getAttribute("href") || "";
      // only handle pure in-page hashes ("#id" or "/#id")
      const hashIndex = url.indexOf("#");
      if (hashIndex < 0) return;
      const id = url.slice(hashIndex + 1);
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      const targetY =
        el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      animateTo(Math.max(0, targetY), `#${id}`);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
