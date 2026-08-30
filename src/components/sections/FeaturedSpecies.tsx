"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import type { SpeciesCard as Species } from "@/lib/content/species";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedSpecies({ species: allSpecies }: { species: Species[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
        },
      });

      const cards = gridRef.current?.querySelectorAll(".specimen-card");
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          scale: 0.96,
          y: 40,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="featured-species"
      ref={sectionRef}
      className="py-24 lg:py-36"
    >
      <div className="container-site">
        {/* Section header */}
        <div ref={titleRef} className="flex items-end justify-between mb-16 gap-8">
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
              {t("featured_species.label")}
            </p>
            <h2 className="font-display text-display-md font-light text-text1">
              {t("sections.featured_species")}
            </h2>
          </div>
          <Link
            href="/especies"
            className="hidden md:flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-400 tracking-widest uppercase shrink-0"
          >
            {t("featured_species.view_catalog")}
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Species grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
        >
          {allSpecies.map((species, index) => (
            <SpecimenCard
              key={species.id}
              species={species}
              index={index}
              locale={locale}
              viewLabel={t("species_card.view")}
            />
          ))}
        </div>

        {/* CTA mobile */}
        <div className="mt-10 md:hidden text-center">
          <Link href="/especies" className="btn-outline">
            {t("featured_species.view_catalog")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function SpecimenCard({
  species,
  index,
  locale,
  viewLabel,
}: {
  species: Species;
  index: number;
  locale: string;
  viewLabel: string;
}) {
  // El inglés casi nunca está cargado todavía: cae al español antes que dejar hueco.
  const commonName =
    (locale === "en" ? species.commonNameEn : null) ??
    species.commonNameEs ??
    species.scientificName;

  return (
    <Link
      href={`/especies/${species.slug}`}
      className="specimen-card group relative flex flex-col bg-void overflow-hidden"
    >
      {/* Full-bleed image */}
      <div className="specimen-image w-full">
        {species.image ? (
          <Image
            src={species.image}
            alt={species.imageAlt ?? `${species.scientificName} — ${commonName}`}
            width={600}
            height={900}
            className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <span className="font-mono text-caption text-text3 uppercase tracking-widest">
              Sin fotografía
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      </div>

      {/* Top metadata */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="catalog-number">{species.catalogNum}</span>
        <span className="font-mono text-caption text-text3 tracking-wide">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-mono text-mono-sm text-gold mb-1 tracking-wide italic">
          {species.scientificName}
        </p>
        <h3 className="font-display text-display-sm font-light text-text1 mb-3 leading-tight">
          {commonName}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <span className="font-mono text-caption text-text3">{species.family}</span>
          <span className="font-mono text-caption text-text3">·</span>
          <span className="font-mono text-caption text-text3">{species.geographicOrigin}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-600 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <span className="font-sans text-caption text-text2 uppercase tracking-widest">
            {viewLabel}
          </span>
          <ArrowUpRight size={12} className="text-gold" />
        </div>
      </div>
    </Link>
  );
}
