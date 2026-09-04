"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  /** Etiqueta a la izquierda de la regla. */
  label: string;
  /** Dato a la derecha: un conteo real, no decoración. */
  value?: string;
};

/**
 * Separador de etiqueta de espécimen: LABEL ————————— VALOR.
 * La línea se dibuja de izquierda a derecha al entrar en viewport.
 */
export default function SectionRule({ label, value }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: ref.current, start: "top 92%" };

      gsap.from(".section-rule-line", {
        scaleX: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: trigger,
      });

      gsap.from(".section-rule-text", {
        opacity: 0,
        y: 8,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: trigger,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="container-site">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <span className="section-rule-text font-mono text-caption uppercase tracking-widest text-text3 sm:shrink-0">
          {label}
        </span>
        <span className="section-rule-line h-px w-full origin-left bg-border sm:flex-1" />
        {value && (
          <span className="section-rule-text font-mono text-caption uppercase tracking-widest text-gold tabular-nums sm:shrink-0">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
