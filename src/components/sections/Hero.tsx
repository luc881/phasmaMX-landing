"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(imageRef.current, {
        scale: 1.08,
        duration: 2,
        ease: "expo.out",
      })
        .from(
          labelRef.current,
          { opacity: 0, y: 20, duration: 1 },
          "-=1.2"
        )
        .from(
          titleRef.current,
          { opacity: 0, y: 80, skewY: 1.5, duration: 1.6, ease: "expo.out" },
          "-=0.8"
        )
        .from(
          taglineRef.current,
          { opacity: 0, y: 30, duration: 1 },
          "-=0.8"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 20, duration: 0.8 },
          "-=0.6"
        );

      // Parallax en scroll
      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById("featured-species");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-end overflow-hidden"
    >
      {/* Imagen protagonista */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=85&fit=crop"
          alt="Insecto palo sobre rama — Phasmatodea"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradientes de oscurecimiento */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/30 to-void/98" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-void/20 to-transparent" />

      {/* Contenido sobre la imagen */}
      <div className="relative z-10 w-full container-site pb-20 lg:pb-28">
        <div className="max-w-4xl">
          {/* Label taxonómico */}
          <p
            ref={labelRef}
            className="taxonomy-badge mb-6"
            style={{ backgroundColor: "rgba(10,10,10,0.6)" }}
          >
            Orden Phasmatodea · México &amp; América Latina
          </p>

          {/* Título display */}
          <h1
            ref={titleRef}
            className="font-display text-display-xl font-light text-text1 text-balance mb-6 opacity-0"
            style={{ opacity: 1 }}
          >
            El archivo{" "}
            <em className="italic text-gold not-italic" style={{ fontStyle: "italic" }}>
              definitivo
            </em>{" "}
            de los<br />
            insectos palo
          </h1>

          {/* Tagline bilingüe */}
          <p
            ref={taglineRef}
            className="font-sans text-body-lg max-w-xl mb-10 leading-relaxed"
            style={{ color: "rgba(240,235,224,0.80)" }}
          >
            {t("hero.tagline")}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex items-center gap-6 opacity-0" style={{ opacity: 1 }}>
            <a href="/es/especies" className="btn-primary">
              {t("hero.cta")}
            </a>
            <a href="#phasmids-intro" className="btn-outline">
              Qué son los fásmidos
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 right-8 lg:right-16 flex flex-col items-center gap-2 text-text3 hover:text-gold transition-colors duration-400 z-10"
        aria-label="Desplazar hacia abajo"
      >
        <span className="font-mono text-caption uppercase tracking-widest rotate-90 mb-2">
          {t("hero.scroll")}
        </span>
        <ArrowDown size={16} strokeWidth={1.5} />
      </button>

      {/* Número de catálogo decorativo */}
      <div className="absolute top-24 right-8 lg:right-16 z-10">
        <p className="font-mono text-caption text-text3 tracking-widest writing-mode-vertical">
          CAT-001 · PHASMATODEA
        </p>
      </div>
    </section>
  );
}
