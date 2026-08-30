"use client";

import { useCallback, useEffect, useRef } from "react";

interface ScrollWaveOptions {
  /** Max horizontal offset in px, reached once scroll speed hits `maxVelocity`. Default 24. */
  amplitude?: number;
  /** Sine wavelength in px — bigger = a gentler, more spread-out curve. Default 320. */
  wavelength?: number;
  /** Scroll speed in px/ms at which the wave saturates to full amplitude. Default 2.2 (~2200px/s, a brisk flick). */
  maxVelocity?: number;
}

const VELOCITY_DECAY = 0.9; // per-frame decay of measured speed once scroll events stop arriving (the inertia tail)
const AMP_SMOOTH = 0.18; // per-frame lerp toward the target amplitude; kills jitter from bursty scroll events
const STOP_EPSILON = 0.05; // px — below this we park the rAF loop instead of ticking forever at ~0
const OBSERVER_MARGIN = "200px 0px"; // pre-activate rows just before they enter the viewport

/**
 * Horizontal "flag wave" over a long list of rows, driven by scroll speed.
 * Idle = rows aligned (offset 0). Fast scroll = a sine curve across the visible rows
 * that eases back to 0 the moment scrolling stops.
 *
 * Usage:
 *   const registerRow = useScrollWave();
 *   ...
 *   {species.map((s) => (
 *     <Link key={s.id} href={...} ref={registerRow}>...</Link>
 *   ))}
 *
 * Writes `transform` directly on the DOM nodes inside a rAF loop — no React state,
 * no re-renders. Only rows currently near the viewport (via IntersectionObserver) are
 * touched per frame, so cost stays flat regardless of list length.
 */
export function useScrollWave(options: ScrollWaveOptions = {}) {
  const optsRef = useRef<Required<ScrollWaveOptions>>({
    amplitude: options.amplitude ?? 24,
    wavelength: options.wavelength ?? 320,
    maxVelocity: options.maxVelocity ?? 2.2,
  });
  optsRef.current = {
    amplitude: options.amplitude ?? 24,
    wavelength: options.wavelength ?? 320,
    maxVelocity: options.maxVelocity ?? 2.2,
  };

  const reducedRef = useRef<boolean | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleRows = useRef<Set<HTMLElement>>(new Set());

  const velocity = useRef(0);
  const amplitude = useRef(0);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const rafId = useRef<number | null>(null);
  const running = useRef(false);

  // Lazy singletons: safe to call from a ref callback that fires before any effect runs.
  const isReduced = useCallback(() => {
    if (reducedRef.current === null) {
      reducedRef.current =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // ponytail: checked once at mount, no live-toggle listener — matches how
      // this repo's other GSAP effects treat the setting. Add a "change" listener
      // if a user toggling the OS setting mid-session without reload matters.
    }
    return reducedRef.current;
  }, []);

  const getObserver = useCallback(() => {
    if (!observerRef.current && !isReduced()) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              visibleRows.current.add(el);
              el.style.willChange = "transform";
            } else {
              visibleRows.current.delete(el);
              el.style.willChange = "";
              el.style.transform = "";
            }
          }
        },
        { rootMargin: OBSERVER_MARGIN }
      );
    }
    return observerRef.current;
  }, [isReduced]);

  useEffect(() => {
    if (isReduced() || typeof window === "undefined") return;

    lastY.current = window.scrollY;
    lastT.current = performance.now();

    function tick() {
      const { amplitude: maxAmplitude, wavelength, maxVelocity } = optsRef.current;

      velocity.current *= VELOCITY_DECAY;
      const target =
        Math.min(Math.abs(velocity.current) / maxVelocity, 1) * maxAmplitude;
      amplitude.current += (target - amplitude.current) * AMP_SMOOTH;

      if (amplitude.current < STOP_EPSILON && target < STOP_EPSILON) {
        for (const el of visibleRows.current) el.style.transform = "translateX(0px)";
        amplitude.current = 0;
        running.current = false;
        rafId.current = null;
        return;
      }

      for (const el of visibleRows.current) {
        const centerY = el.getBoundingClientRect().top + el.offsetHeight / 2;
        const offset = amplitude.current * Math.sin(centerY / wavelength);
        el.style.transform = `translateX(${offset.toFixed(2)}px)`;
      }

      rafId.current = requestAnimationFrame(tick);
    }

    function onScroll() {
      const y = window.scrollY;
      const t = performance.now();
      const dt = t - lastT.current || 16;
      velocity.current = (y - lastY.current) / dt;
      lastY.current = y;
      lastT.current = t;

      if (!running.current) {
        running.current = true;
        rafId.current = requestAnimationFrame(tick);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      running.current = false;
      observerRef.current?.disconnect();
      for (const el of visibleRows.current) {
        el.style.transform = "";
        el.style.willChange = "";
      }
      visibleRows.current.clear();
    };
  }, [isReduced]);

  const registerRow = useCallback(
    (el: HTMLElement | null) => {
      if (!el || isReduced()) return;
      getObserver()?.observe(el);
      return () => {
        observerRef.current?.unobserve(el);
        visibleRows.current.delete(el);
        el.style.transform = "";
        el.style.willChange = "";
      };
    },
    [isReduced, getObserver]
  );

  return registerRow;
}
