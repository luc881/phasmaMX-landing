"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_SPECIES = [
  {
    id: "1",
    scientificName: "Carausius morosus",
    commonNameEs: "Insecto palo indio",
    commonNameEn: "Indian Stick Insect",
    family: "Diapheromeridae",
    conservationStatus: "LC",
    slug: "carausius-morosus",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&fit=crop&crop=center",
    catalogNum: "CAT-001",
    origin: "India · Sri Lanka",
  },
  {
    id: "2",
    scientificName: "Bacillus rossius",
    commonNameEs: "Insecto palo mediterráneo",
    commonNameEn: "Mediterranean Stick Insect",
    family: "Bacillidae",
    conservationStatus: "LC",
    slug: "bacillus-rossius",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80&fit=crop&crop=center",
    catalogNum: "CAT-002",
    origin: "Mediterranean Europe",
  },
  {
    id: "3",
    scientificName: "Eurycantha calcarata",
    commonNameEs: "Insecto palo espinoso gigante",
    commonNameEn: "Giant Spiny Stick Insect",
    family: "Phasmatidae",
    conservationStatus: "LC",
    slug: "eurycantha-calcarata",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&fit=crop&crop=center",
    catalogNum: "CAT-003",
    origin: "New Guinea",
  },
  {
    id: "4",
    scientificName: "Extatosoma tiaratum",
    commonNameEs: "Insecto palo australiano",
    commonNameEn: "Australian Stick Insect",
    family: "Phasmatidae",
    conservationStatus: "LC",
    slug: "extatosoma-tiaratum",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80&fit=crop&crop=center",
    catalogNum: "CAT-004",
    origin: "Australia",
  },
  {
    id: "5",
    scientificName: "Heteropteryx dilatata",
    commonNameEs: "Ninfa de la jungla malaya",
    commonNameEn: "Malayan Jungle Nymph",
    family: "Heteropterygidae",
    conservationStatus: "LC",
    slug: "heteropteryx-dilatata",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80&fit=crop&crop=center",
    catalogNum: "CAT-005",
    origin: "Malaysia · Borneo",
  },
  {
    id: "6",
    scientificName: "Phyllium giganteum",
    commonNameEs: "Insecto hoja gigante de Malasia",
    commonNameEn: "Giant Malaysian Leaf Insect",
    family: "Phylliidae",
    conservationStatus: "NE",
    slug: "phyllium-giganteum",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&fit=crop&crop=center",
    catalogNum: "CAT-006",
    origin: "Peninsular Malaysia",
  },
];

export default function FeaturedSpecies() {
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
          {PLACEHOLDER_SPECIES.map((species, index) => (
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
  species: (typeof PLACEHOLDER_SPECIES)[0];
  index: number;
  locale: string;
  viewLabel: string;
}) {
  const commonName = locale === "en" ? species.commonNameEn : species.commonNameEs;

  return (
    <Link
      href={`/especies/${species.slug}`}
      className="specimen-card group relative flex flex-col bg-void overflow-hidden"
    >
      {/* Full-bleed image */}
      <div className="specimen-image w-full">
        <Image
          src={species.image}
          alt={`${species.scientificName} — ${commonName}`}
          width={600}
          height={900}
          className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-[1.04]"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
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
          <span className="font-mono text-caption text-text3">{species.origin}</span>
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
