"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "@/components/ui/CountUp";
import Ornament from "@/components/ui/Ornament";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 3500, key: "stat_species_world" },
  { value: 120, key: "stat_species_mx" },
  { value: 40, key: "stat_endemic" },
];

export default function PhasmidsIntro() {
  const t = useTranslations("phasmids");
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax de imagen
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Reveal elementos en scroll
      gsap.utils.toArray<HTMLElement>(".intro-reveal").forEach((el: HTMLElement) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // Stats counter-style reveal
      gsap.utils.toArray<HTMLElement>(".stat-item").forEach((el: HTMLElement, i: number) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="phasmids-intro"
      ref={sectionRef}
      data-surface="paper"
      className="surface-paper py-16 md:py-24 lg:py-36"
    >
      <div className="container-site">
        {/* Label */}
        <p className="intro-reveal font-mono text-caption text-ink-3 uppercase tracking-widest mb-8 md:mb-16">
          Phasmatodea · Biología &amp; Ecología
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 items-start">
          {/* Texto editorial */}
          <div className="lg:col-span-6">
            <h2 className="intro-reveal font-display text-display-md font-light text-void mb-6 md:mb-8">
              {t("intro_title")}
            </h2>

            <p className="intro-reveal font-sans text-body-md md:text-body-lg text-ink-2 leading-relaxed mb-6">
              {t("intro_body")}
            </p>

            <p className="intro-reveal font-sans text-body-md text-ink-2 leading-relaxed mb-8 md:mb-12">
              {t("intro_body_2")}
            </p>

            {/* Pull quote */}
            <blockquote className="intro-reveal pull-quote text-void border-l-gold-dim mb-8 md:mb-12">
              Los fásmidos son el resultado de millones de años de coevolución
              con las plantas que los rodean — arquitectura viva.
            </blockquote>

            <Ornament tone="paper" className="intro-reveal mb-8 md:mb-12" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {STATS.map((stat) => (
                <div key={stat.key} className="stat-item">
                  <p className="font-display text-display-md font-light text-gold-dim mb-1">
                    <CountUp to={stat.value} prefix="+" />
                  </p>
                  <p className="font-mono text-caption text-ink-3 uppercase tracking-wide leading-tight">
                    {t(stat.key as any)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen editorial */}
          <div className="lg:col-span-6 relative">
            <div
              ref={imageRef}
              className="relative overflow-hidden will-change-transform"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&q=85&fit=crop&crop=center"
                alt="Bosque tropical — hábitat de fásmidos"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-void/5" />
            </div>

            {/* Caption científico */}
            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              {/* El pie describía una especie que la foto no muestra: es una
                  imagen de hábitat, no de espécimen. */}
              <p className="font-mono text-caption text-ink-3 italic sm:max-w-xs">
                Dosel tropical húmedo — hábitat típico de Phasmatodea
              </p>
              <p className="font-mono text-caption text-ink-3 sm:shrink-0">
                © Placeholder
              </p>
            </div>

            {/* Decorador de número */}
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-paper-border bg-paper flex items-center justify-center">
              <span className="font-mono text-caption text-ink-3">01</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
