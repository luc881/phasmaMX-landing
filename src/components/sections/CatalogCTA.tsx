"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight, BookOpen } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CatalogCTA() {
  const t = useTranslations("cta");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cta-reveal").forEach((el: HTMLElement) => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 border-t border-border">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface border border-border overflow-hidden">
          {/* Imagen lateral */}
          <div className="lg:col-span-5 relative overflow-hidden" style={{ minHeight: 360 }}>
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85&fit=crop&crop=center"
              alt="Catálogo de especies — Phasma MX"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface lg:bg-gradient-to-r" />
          </div>

          {/* Contenido */}
          <div className="lg:col-span-7 flex flex-col justify-center p-10 lg:p-16">
            <p className="cta-reveal font-mono text-caption text-gold uppercase tracking-widest mb-6">
              Phasmatodea · Catálogo sistemático
            </p>
            <h2 className="cta-reveal font-display text-display-md font-light text-text1 mb-6 text-balance">
              {t("catalog_title")}
            </h2>
            <p className="cta-reveal font-sans text-body-lg text-text2 leading-relaxed mb-10 max-w-lg">
              {t("catalog_body")}
            </p>

            {/* Stats rápidos */}
            <div className="cta-reveal flex gap-8 mb-10">
              {[
                ["Nativas", "120+"],
                ["Exóticas", "80+"],
                ["Endémicas", "40+"],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="font-display text-display-sm font-light text-gold mb-1">{val}</p>
                  <p className="font-mono text-caption text-text3 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="cta-reveal flex flex-wrap gap-4">
              <Link href="/es/especies" className="btn-primary">
                {t("catalog_btn")}
                <ArrowUpRight size={14} />
              </Link>
              <Link href="/es/publicaciones" className="btn-outline">
                <BookOpen size={14} />
                {t("publications_btn")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
