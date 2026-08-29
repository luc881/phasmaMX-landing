"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  to: number;
  prefix?: string;
  className?: string;
};

// Separador de millar fijo ("3,500") para que ES y EN lean igual que el
// archivo impreso; el número renderiza ya completo en el servidor y sólo
// entonces se anima hacia atrás.
const format = (n: number) => n.toLocaleString("en-US");

export default function CountUp({ to, prefix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value: to,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = prefix + format(Math.round(counter.value));
        },
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    }, el);

    return () => ctx.revert();
  }, [to, prefix]);

  return (
    <span ref={ref} className={className}>
      {prefix + format(to)}
    </span>
  );
}
