"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, X, ArrowUpRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PLACEHOLDER_SPECIES,
  FAMILIES,
  STATUS_META,
  type SpeciesPlaceholder,
  type ConservationStatus,
} from "@/lib/placeholder/species";

gsap.registerPlugin(ScrollTrigger);

type OriginKey = "all" | "native" | "exotic" | "central" | "south" | "asia" | "australia" | "europe";

const ORIGIN_KEYS: OriginKey[] = ["all", "native", "exotic", "central", "south", "asia", "australia", "europe"];
const STATUS_KEYS = ["", "LC", "NT", "VU", "EN", "CR", "NE", "DD"];

function matchOrigin(species: SpeciesPlaceholder, filter: OriginKey): boolean {
  if (filter === "all") return true;
  if (filter === "native") return species.presenceInMexico;
  if (filter === "exotic") return !species.presenceInMexico;
  const geo = species.geographicOrigin.toLowerCase();
  if (filter === "central") return geo.includes("centroamérica") || geo.includes("panamá") || geo.includes("chiapas");
  if (filter === "south") return geo.includes("chile") || geo.includes("argentina") || geo.includes("brasil");
  if (filter === "asia") return geo.includes("malasia") || geo.includes("india") || geo.includes("asiático") || geo.includes("singapur");
  if (filter === "australia") return geo.includes("australia");
  if (filter === "europe") return geo.includes("europa") || geo.includes("mediterránea");
  return true;
}

export default function CatalogGrid() {
  const t = useTranslations("catalog.filters");
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [origin, setOrigin] = useState<OriginKey>("all");
  const [status, setStatus] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const originLabel = (key: OriginKey) => {
    const map: Record<OriginKey, Parameters<typeof t>[0]> = {
      all:       "origin_all",
      native:    "origin_native",
      exotic:    "origin_exotic",
      central:   "origin_central",
      south:     "origin_south",
      asia:      "origin_asia",
      australia: "origin_australia",
      europe:    "origin_europe",
    };
    return t(map[key]);
  };

  const filtered = useMemo(() => {
    return PLACEHOLDER_SPECIES.filter((s) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        s.scientificName.toLowerCase().includes(q) ||
        s.commonNameEs.toLowerCase().includes(q) ||
        (s.commonNameEn?.toLowerCase().includes(q) ?? false) ||
        s.family.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchFamily = !family || s.family === family;
      const matchOriginF = matchOrigin(s, origin);
      const matchStatus = !status || s.conservationStatus === status;
      return matchQ && matchFamily && matchOriginF && matchStatus;
    });
  }, [query, family, origin, status]);

  const hasFilters = query || family || origin !== "all" || status;

  function clearFilters() {
    setQuery("");
    setFamily("");
    setOrigin("all");
    setStatus("");
  }

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".catalog-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }
    );
  }, [filtered]);

  // Build family options (exclude first element which is "Todas las familias")
  const familyOptions = [
    { value: "", label: t("all_families") },
    ...FAMILIES.slice(1).map((f) => ({ value: f, label: f })),
  ];

  const originOptions = ORIGIN_KEYS.map((key) => ({
    value: key,
    label: originLabel(key),
  }));

  const statusOptions = STATUS_KEYS.map((s) => ({
    value: s,
    label: s === "" ? t("all_statuses") : s,
  }));

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-30 bg-void/95 backdrop-blur-sm border-b border-border">
        <div className="container-site py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-52">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface border border-border pl-9 pr-4 py-2.5 font-mono text-caption text-text1 placeholder-text3 focus:outline-none focus:border-gold transition-colors duration-300"
              />
            </div>

            {/* Toggle filters */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 font-mono text-caption uppercase tracking-widest px-4 py-2.5 border transition-colors duration-300 ${
                filtersOpen ? "border-gold text-gold" : "border-border text-text2 hover:border-border-2 hover:text-text1"
              }`}
            >
              <SlidersHorizontal size={13} />
              {t("filters_btn")}
            </button>

            {/* Count */}
            <p className="font-mono text-caption text-text3 ml-auto shrink-0">
              <span className="text-gold">{filtered.length}</span>
              {" "}{t("count_of", { total: PLACEHOLDER_SPECIES.length })}
            </p>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 font-mono text-caption text-text3 hover:text-gold transition-colors duration-300"
              >
                <X size={12} />
                {t("clear")}
              </button>
            )}
          </div>

          {/* Expanded filters */}
          {filtersOpen && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
              <Select
                label={t("family_label")}
                value={family}
                options={familyOptions}
                onChange={setFamily}
              />
              <Select
                label={t("origin_label")}
                value={origin}
                options={originOptions}
                onChange={(v) => setOrigin(v as OriginKey)}
              />
              <Select
                label={t("status_label")}
                value={status}
                options={statusOptions}
                onChange={setStatus}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Masonry grid ── */}
      {filtered.length === 0 ? (
        <div className="container-site py-32 text-center">
          <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
            {t("no_results_label")}
          </p>
          <p className="font-display text-display-sm font-light text-text2">
            {t("no_results_desc")}
          </p>
          <button onClick={clearFilters} className="mt-8 btn-outline">
            {t("view_all_btn")}
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-px bg-border">
          {filtered.map((species) => (
            <SpeciesCard key={species.id} species={species} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpeciesCard({ species, locale }: { species: SpeciesPlaceholder; locale: string }) {
  const statusMeta = STATUS_META[species.conservationStatus as ConservationStatus];
  const commonName = locale === "en" && species.commonNameEn ? species.commonNameEn : species.commonNameEs;

  return (
    <Link
      href={`/especies/${species.slug}`}
      className="catalog-card group block break-inside-avoid bg-void relative overflow-hidden"
      style={{ aspectRatio: species.aspectRatio }}
    >
      <Image
        src={species.image}
        alt={`${species.scientificName} — ${commonName}`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top metadata */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="catalog-number">{species.catalogNum}</span>
        <span className={`font-mono text-caption px-2 py-0.5 ${statusMeta.color} ${statusMeta.bg}`}>
          {species.conservationStatus}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-mono text-mono-sm text-gold italic tracking-wide mb-1">
          {species.scientificName}
        </p>
        <h3 className="font-display text-display-sm font-light text-text1 leading-tight mb-3">
          {commonName}
        </h3>

        <div className="overflow-hidden">
          <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
              <span className="font-mono text-caption text-text3">{species.family}</span>
              <span className="font-mono text-caption text-text3">·</span>
              <span className="font-mono text-caption text-text3">{species.geographicOrigin}</span>
            </div>
            {species.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block font-mono text-caption text-text3 border border-border px-2 py-0.5 mr-1 mb-1"
              >
                {tag}
              </span>
            ))}
            <div className="flex items-center gap-2 mt-3">
              <span className="font-mono text-caption text-text2 uppercase tracking-widest">
                <ViewLabel locale={locale} />
              </span>
              <ArrowUpRight size={12} className="text-gold" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ViewLabel({ locale }: { locale: string }) {
  const t = useTranslations("catalog.card");
  return <>{t("view")}</>;
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-caption text-text3 uppercase tracking-widest px-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface border border-border px-3 py-2 font-mono text-caption text-text1 focus:outline-none focus:border-gold transition-colors duration-300 appearance-none pr-8 cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23606050' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
