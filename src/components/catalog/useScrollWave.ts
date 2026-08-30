"use client";

import { useCallback, useEffect, useRef } from "react";

interface ScrollWaveOptions {
  /** Desplazamiento máximo en px, justo sobre la línea. Por defecto 70. */
  amplitude?: number;
  /** Distancia vertical, en px, a la que el efecto ya se ha extinguido. Por defecto 300. */
  radius?: number;
  /** Dónde cae la línea marcada, como fracción del alto de la ventana. Por defecto 0.42. */
  lineRatio?: number;
}

const OBSERVER_MARGIN = "300px 0px";

/**
 * Lente de lectura: una línea fija de la ventana empuja hacia la derecha las
 * filas que pasan por delante, con una campana que se extingue arriba y abajo.
 * La línea no se mueve con el contenido — deja marcado el punto de lectura
 * mientras las filas desfilan por él.
 *
 * Depende de la POSICIÓN, no de la velocidad: la deformación se mantiene con el
 * scroll parado. Una versión por velocidad se deshace al soltar y produce un
 * "temblor" general en vez de una marca estable.
 *
 * Uso:
 *   const registerRow = useScrollWave();
 *   {species.map((s) => <Link key={s.id} ref={registerRow} ...>)}
 *
 * Escribe `transform` directamente en el DOM: ni estado de React ni re-renders.
 * Un IntersectionObserver mantiene el coste plano — solo se tocan las filas
 * cercanas a la ventana, da igual si la lista tiene cientos.
 */
export function useScrollWave(options: ScrollWaveOptions = {}) {
  const opts = useRef({ amplitude: 70, radius: 300, lineRatio: 0.42 });
  opts.current = {
    amplitude: options.amplitude ?? 70,
    radius: options.radius ?? 300,
    lineRatio: options.lineRatio ?? 0.42,
  };

  const activeRef = useRef<Set<HTMLElement>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const frameRef = useRef<number | null>(null);
  const reducedRef = useRef<boolean | null>(null);

  const isReduced = () => {
    if (reducedRef.current === null) {
      reducedRef.current =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return reducedRef.current;
  };

  const paint = useCallback(() => {
    frameRef.current = null;
    const { amplitude, radius, lineRatio } = opts.current;
    const lineY = window.innerHeight * lineRatio;

    for (const el of activeRef.current) {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - lineY);

      // Coseno alzado: vale 1 sobre la línea y llega a 0 en el borde del radio
      // con pendiente nula, así no se ve un corte donde termina el efecto.
      const falloff =
        distance >= radius
          ? 0
          : 0.5 * (1 + Math.cos((Math.PI * distance) / radius));

      el.style.transform = `translate3d(${(amplitude * falloff).toFixed(2)}px,0,0)`;
    }
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(paint);
  }, [paint]);

  const registerRow = useCallback(
    (el: HTMLElement | null) => {
      if (!el || isReduced()) return;

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const node = entry.target as HTMLElement;
              if (entry.isIntersecting) {
                activeRef.current.add(node);
                node.style.willChange = "transform";
              } else {
                activeRef.current.delete(node);
                node.style.willChange = "";
                node.style.transform = "";
              }
            }
            schedule();
          },
          { rootMargin: OBSERVER_MARGIN }
        );
      }

      observerRef.current.observe(el);
      schedule();

      // React 19: el retorno del callback-ref es su limpieza.
      return () => {
        observerRef.current?.unobserve(el);
        activeRef.current.delete(el);
        el.style.transform = "";
        el.style.willChange = "";
      };
    },
    [schedule]
  );

  useEffect(() => {
    if (isReduced()) return;

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      observerRef.current?.disconnect();
      observerRef.current = null;
      for (const el of activeRef.current) {
        el.style.transform = "";
        el.style.willChange = "";
      }
      activeRef.current.clear();
    };
  }, [schedule]);

  return registerRow;
}
