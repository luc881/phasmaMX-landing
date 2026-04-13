"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "+3,500", key: "stat_species_world" },
  { value: "+120", key: "stat_species_mx" },
  { value: "+40", key: "stat_endemic" },
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
      className="py-24 lg:py-36 border-t border-border"
    >
      <div className="container-site">
        {/* Label */}
        <p className="intro-reveal font-mono text-caption text-text3 uppercase tracking-widest mb-16">
          Phasmatodea · Biología &amp; Ecología
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Texto editorial */}
          <div className="lg:col-span-6">
            <h2 className="intro-reveal font-display text-display-md font-light text-text1 mb-8">
              {t("intro_title")}
            </h2>

            <p className="intro-reveal font-sans text-body-lg text-text2 leading-relaxed mb-6">
              {t("intro_body")}
            </p>

            <p className="intro-reveal font-sans text-body-md text-text2 leading-relaxed mb-12">
              {t("intro_body_2")}
            </p>

            {/* Pull quote */}
            <blockquote className="intro-reveal pull-quote mb-12">
              Los fásmidos son el resultado de millones de años de coevolución
              con las plantas que los rodean — arquitectura viva.
            </blockquote>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {STATS.map((stat) => (
                <div key={stat.key} className="stat-item">
                  <p className="font-display text-display-md font-light text-gold mb-1">
                    {stat.value}
                  </p>
                  <p className="font-mono text-caption text-text3 uppercase tracking-wide leading-tight">
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
              <div className="absolute inset-0 bg-void/10" />
            </div>

            {/* Caption científico */}
            <div className="mt-4 flex items-start justify-between">
              <p className="font-mono text-caption text-text3 italic max-w-xs">
                Carausius morosus en estado de catalepsia diurna
              </p>
              <p className="font-mono text-caption text-text3 shrink-0">
                © Placeholder
              </p>
            </div>

            {/* Decorador de número */}
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-border flex items-center justify-center">
              <span className="font-mono text-caption text-text3">01</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
