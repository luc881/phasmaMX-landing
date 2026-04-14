import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, MapPin, BookOpen, Leaf, Bug, FlaskConical, Thermometer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PLACEHOLDER_SPECIES, STATUS_META, type ConservationStatus } from "@/lib/placeholder/species";
import SpeciesGallery from "@/components/species/SpeciesGallery";
import SpeciesMap from "@/components/species/SpeciesMap";

export function generateStaticParams() {
  const locales = ["es", "en"];
  const slugs = PLACEHOLDER_SPECIES.map((s) => s.slug);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const species = PLACEHOLDER_SPECIES.find((s) => s.slug === slug);
  if (!species) return { title: "Especie no encontrada — Phasma MX" };
  const commonName = locale === "en" && species.commonNameEn ? species.commonNameEn : species.commonNameEs;
  return {
    title: `${species.scientificName} — Phasma MX`,
    description: `${commonName}. ${species.description.slice(0, 120)}`,
  };
}

export default async function SpeciesDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const species = PLACEHOLDER_SPECIES.find((s) => s.slug === slug);
  if (!species) notFound();

  const t = await getTranslations({ locale, namespace: "species_detail" });
  const statusMeta = STATUS_META[species.conservationStatus as ConservationStatus];
  const commonName = locale === "en" && species.commonNameEn ? species.commonNameEn : species.commonNameEs;

  const relatedSpecies = PLACEHOLDER_SPECIES.filter(
    (s) => s.family === species.family && s.id !== species.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        <Image
          src={species.image}
          alt={`${species.scientificName} — ${commonName}`}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/60 via-transparent to-transparent" />

        {/* Back link */}
        <Link
          href="/especies"
          className="absolute top-24 left-6 lg:left-16 flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-300 z-10 bg-void/60 px-3 py-2 backdrop-blur-sm"
        >
          <ArrowLeft size={13} />
          {t("back")}
        </Link>

        {/* Catalog number */}
        <div className="absolute top-24 right-6 lg:right-16 z-10">
          <p className="font-mono text-caption text-text3 tracking-widest">{species.catalogNum}</p>
        </div>

        {/* Hero content */}
        <div className="relative z-10 container-site pb-16">
          <div className="max-w-3xl">
            <span className="taxonomy-badge mb-4 inline-block">
              {species.order} · {species.family}
            </span>
            <h1 className="font-display text-display-xl font-light text-text1 italic mb-3">
              {species.scientificName}
            </h1>
            <p className="font-sans text-body-xl text-text2 mb-2">
              {commonName}
            </p>
            <p className="font-mono text-caption text-text3">
              {species.author}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ── LEFT: content sections ── */}
          <div className="lg:col-span-7 space-y-16">

            {/* Description */}
            <Section icon={<Bug size={16} />} label={t("description")}>
              <p className="font-sans text-body-lg text-text2 leading-relaxed">
                {species.description}
              </p>
            </Section>

            {/* Morphology */}
            <Section icon={<FlaskConical size={16} />} label={t("morphology")}>
              <div className="space-y-8">
                <MorphCard title={t("females")} content={species.females} />
                <MorphCard title={t("males")} content={species.males} />
                <MorphCard title={t("nymphs")} content={species.nymphs} />
                <MorphCard title={t("eggs")} content={species.eggs} />
              </div>
            </Section>

            {/* Habitat */}
            <Section icon={<Leaf size={16} />} label={t("habitat")}>
              <p className="font-sans text-body-lg text-text2 leading-relaxed mb-6">
                {species.habitat}
              </p>
              <p className="font-sans text-body-md text-text2 leading-relaxed">
                {species.behavior}
              </p>
            </Section>

            {/* Distribution Map */}
            {species.mexicoLocations && species.mexicoLocations.length > 0 && (
              <Section icon={<MapPin size={16} />} label={t("records_label")}>
                <SpeciesMap
                  locations={species.mexicoLocations}
                  highlightedStates={species.mexicoStates}
                  scientificName={species.scientificName}
                />
              </Section>
            )}

            {/* Food plants */}
            <Section icon={<Leaf size={16} />} label={t("food_plants")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {species.foodPlants.map((plant, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 border border-border bg-surface"
                  >
                    <span className="font-mono text-caption text-gold mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-body-md text-text2">{plant}</span>
                  </div>
                ))}
              </div>
              <p className="font-mono text-caption text-text3 mt-3">
                {t("food_plants_note")}
              </p>
            </Section>

            {/* Breeding */}
            <Section icon={<Thermometer size={16} />} label={t("breeding")}>
              <div className="border border-border bg-surface p-6">
                <p className="font-sans text-body-md text-text2 leading-relaxed">
                  {species.breeding}
                </p>
              </div>
            </Section>

            {/* Gallery */}
            {species.gallery.length > 0 && (
              <Section icon={null} label={t("gallery")}>
                <SpeciesGallery images={species.gallery} />
              </Section>
            )}

            {/* References */}
            <Section icon={<BookOpen size={16} />} label={t("bibliography")}>
              <ol className="space-y-3">
                {species.references.map((ref, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-caption text-gold shrink-0 mt-0.5">
                      [{i + 1}]
                    </span>
                    <p className="font-mono text-caption text-text2 leading-relaxed">{ref}</p>
                  </li>
                ))}
              </ol>
            </Section>
          </div>

          {/* ── RIGHT: taxonomy sidebar ── */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Taxonomy card */}
              <div className="border border-border bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-mono text-caption text-text3 uppercase tracking-widest">
                    {t("taxonomy_label")}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {[
                    ["Orden", species.order],
                    ["Familia", species.family],
                    ["Subfamilia", species.subfamily],
                    ["Género", species.genus],
                    ["Especie", species.scientificName.split(" ").slice(1).join(" ")],
                    ["Autor", species.author],
                    ["Año", String(species.year)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between px-6 py-3">
                      <span className="font-mono text-caption text-text3 uppercase tracking-wide">
                        {label}
                      </span>
                      <span className="font-sans text-body-md text-text1 text-right max-w-[55%]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conservation status */}
              <div className="border border-border bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-mono text-caption text-text3 uppercase tracking-widest">
                    {t("conservation_label")}
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-display-sm font-light px-4 py-2 ${statusMeta.color} ${statusMeta.bg}`}
                    >
                      {species.conservationStatus}
                    </span>
                    <span className="font-sans text-body-md text-text2">
                      {statusMeta.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Geographic distribution */}
              <div className="border border-border bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-mono text-caption text-text3 uppercase tracking-widest">
                    {t("distribution_label")}
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                    <p className="font-sans text-body-md text-text2">{species.geographicOrigin}</p>
                  </div>
                  {species.presenceInMexico && species.mexicoStates.length > 0 && (
                    <div>
                      <p className="font-mono text-caption text-text3 uppercase tracking-wide mb-3">
                        {t("records_label")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {species.mexicoStates.map((state) => (
                          <span
                            key={state}
                            className="font-mono text-caption text-lichen border border-lichen/30 px-2 py-1"
                          >
                            {state}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!species.presenceInMexico && (
                    <p className="font-mono text-caption text-text3 italic">
                      {t("no_records")}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="border border-border bg-surface px-6 py-5">
                <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
                  {t("tags_label")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {species.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-caption text-text2 border border-border px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related species */}
              <div className="border border-border bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-mono text-caption text-text3 uppercase tracking-widest">
                    {t("related_label")}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {relatedSpecies.map((rel) => {
                    const relName = locale === "en" && rel.commonNameEn ? rel.commonNameEn : rel.commonNameEs;
                    return (
                      <Link
                        key={rel.id}
                        href={`/especies/${rel.slug}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-void transition-colors duration-300 group"
                      >
                        <div className="relative w-14 h-14 shrink-0 overflow-hidden">
                          <Image
                            src={rel.image}
                            alt={rel.scientificName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-400"
                          />
                        </div>
                        <div>
                          <p className="font-mono text-caption text-gold italic">{rel.scientificName}</p>
                          <p className="font-sans text-caption text-text3">{relName}</p>
                        </div>
                      </Link>
                    );
                  })}
                  {relatedSpecies.length === 0 && (
                    <p className="px-6 py-4 font-mono text-caption text-text3 italic">
                      {t("no_related")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        {icon && <span className="text-gold">{icon}</span>}
        <h2 className="font-mono text-caption text-text3 uppercase tracking-widest">
          {label}
        </h2>
      </div>
      {children}
    </div>
  );
}

function MorphCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="border-l-2 border-gold pl-6">
      <p className="font-mono text-caption text-gold uppercase tracking-widest mb-2">{title}</p>
      <p className="font-sans text-body-md text-text2 leading-relaxed">{content}</p>
    </div>
  );
}
