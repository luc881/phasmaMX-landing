import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, MapPin, BookOpen, Leaf, Bug, FlaskConical, Thermometer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { STATUS_META, type ConservationStatus } from "@/lib/placeholder/species";
import {
  getSpeciesBySlug,
  getRelatedSpecies,
  getSpeciesSlugs,
  type SpeciesDetail,
} from "@/lib/content/species";
import type { PortableTextBlock } from "@portabletext/types";
import ProseBlocks from "@/components/ui/ProseBlocks";
import SpeciesGallery from "@/components/species/SpeciesGallery";
import SpeciesMap from "@/components/species/SpeciesMap";

export async function generateStaticParams() {
  const slugs = await getSpeciesSlugs();
  const locales = ["es", "en"];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

/** Aplana Portable Text a texto plano, solo para metadatos (<meta description>). */
function plainText(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks?.length) return "";
  return blocks
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((c) => ("text" in c ? c.text ?? "" : "")).join("")
        : ""
    )
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) return { title: "Especie no encontrada — Phasma MX" };
  const commonName =
    (locale === "en" ? species.commonNameEn : species.commonNameEs) ?? species.commonNameEs ?? species.scientificName;
  const description =
    locale === "en" && species.descriptionEn?.length ? species.descriptionEn : species.description;
  return {
    title: `${species.scientificName} — Phasma MX`,
    description: `${commonName}. ${plainText(description).slice(0, 120)}`,
  };
}

export default async function SpeciesDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const species = await getSpeciesBySlug(slug);
  if (!species) notFound();

  const t = await getTranslations({ locale, namespace: "species_detail" });
  const statusMeta = STATUS_META[species.conservationStatus as ConservationStatus] ?? STATUS_META.NE;
  const commonName =
    (locale === "en" ? species.commonNameEn : species.commonNameEs) ?? species.commonNameEs ?? species.scientificName;

  const relatedSpecies = await getRelatedSpecies(species.family, slug);

  const isEn = locale === "en";
  const description = isEn && species.descriptionEn?.length ? species.descriptionEn : species.description;
  const foodPlants = isEn && species.foodPlantsEn.length > 0 ? species.foodPlantsEn : species.foodPlants;
  const females = (isEn && species.femalesEn) || species.females;
  const males = (isEn && species.malesEn) || species.males;
  const nymphs = (isEn && species.nymphsEn) || species.nymphs;
  const eggs = (isEn && species.eggsEn) || species.eggs;
  const breeding = (isEn && species.breedingEn) || species.breeding;

  const gallery = species.gallery.map((img) => ({
    src: img.src,
    caption: img.caption ?? img.alt ?? "",
    credit: img.credit ?? "",
  }));

  const rearingLabel: Record<NonNullable<SpeciesDetail["rearingDifficulty"]>, string> = {
    easy: t("rearing_easy"),
    moderate: t("rearing_moderate"),
    hard: t("rearing_hard"),
    unknown: t("rearing_unknown"),
  };

  const incubationRange =
    species.incubationMonthsMin || species.incubationMonthsMax
      ? [species.incubationMonthsMin, species.incubationMonthsMax].filter(Boolean).join("–")
      : null;

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        {species.image ? (
          <Image
            src={species.image}
            alt={species.imageAlt ?? `${species.scientificName} — ${commonName}`}
            fill
            priority
            quality={90}
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <span className="font-mono text-caption text-text3 uppercase tracking-widest">
              {t("no_image")}
            </span>
          </div>
        )}
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

        {/* Catalog number / PSG number */}
        <div className="absolute top-24 right-6 lg:right-16 z-10 text-right space-y-1">
          {species.catalogNum && (
            <p className="font-mono text-caption text-text3 tracking-widest">{species.catalogNum}</p>
          )}
          {species.psgNumber && (
            <p className="font-mono text-caption text-gold tracking-widest">PSG {species.psgNumber}</p>
          )}
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
              {[species.author, species.year].filter(Boolean).join(", ")}
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
              {description?.length ? (
                <ProseBlocks value={description} />
              ) : (
                <p className="font-sans text-body-lg text-text3 italic">{t("no_description")}</p>
              )}
            </Section>

            {/* Morphology */}
            <Section icon={<FlaskConical size={16} />} label={t("morphology")}>
              <div className="space-y-8">
                {females && (
                  <MorphCard
                    title={t("females")}
                    lengthMm={species.bodyLengthFemaleMm}
                    content={females}
                  />
                )}
                {males && (
                  <MorphCard
                    title={t("males")}
                    lengthMm={species.bodyLengthMaleMm}
                    content={males}
                  />
                )}
                {nymphs && <MorphCard title={t("nymphs")} content={nymphs} />}
                {eggs && <MorphCard title={t("eggs")} content={eggs} />}
              </div>
            </Section>

            {/* Habitat */}
            {(species.habitat || species.behavior) && (
              <Section icon={<Leaf size={16} />} label={t("habitat")}>
                {species.habitat && (
                  <p className="font-sans text-body-lg text-text2 leading-relaxed mb-6">
                    {species.habitat}
                  </p>
                )}
                {species.behavior && (
                  <p className="font-sans text-body-md text-text2 leading-relaxed">
                    {species.behavior}
                  </p>
                )}
              </Section>
            )}

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
            {foodPlants.length > 0 && (
              <Section icon={<Leaf size={16} />} label={t("food_plants")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {foodPlants.map((plant, i) => (
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
            )}

            {/* Breeding */}
            {(breeding || species.rearingDifficulty || species.parthenogenetic !== null || incubationRange) && (
              <Section icon={<Thermometer size={16} />} label={t("breeding")}>
                <div className="border border-border bg-surface p-6 space-y-6">
                  {breeding && (
                    <p className="font-sans text-body-md text-text2 leading-relaxed">
                      {breeding}
                    </p>
                  )}

                  {(species.rearingDifficulty || species.parthenogenetic !== null || incubationRange) && (
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                      {species.rearingDifficulty && (
                        <Fact label={t("rearing_difficulty")} value={rearingLabel[species.rearingDifficulty]} />
                      )}
                      {species.parthenogenetic !== null && (
                        <Fact
                          label={t("parthenogenetic_label")}
                          value={species.parthenogenetic ? t("parthenogenetic_yes") : t("parthenogenetic_no")}
                        />
                      )}
                      {incubationRange && (
                        <Fact label={t("incubation_label")} value={`${incubationRange} ${t("months_unit")}`} />
                      )}
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <Section icon={null} label={t("gallery")}>
                <SpeciesGallery images={gallery} />
              </Section>
            )}

            {/* References */}
            {species.references.length > 0 && (
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
            )}
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
                  {(
                    [
                      ["Orden", species.order],
                      ["Familia", species.family],
                      ["Subfamilia", species.subfamily],
                      species.tribe ? ["Tribu", species.tribe] : null,
                      ["Género", species.genus],
                      ["Especie", species.scientificName.split(" ").slice(1).join(" ")],
                      ["Autor", species.author],
                      ["Año", species.year ? String(species.year) : null],
                      species.synonyms.length > 0 ? ["Sinónimos", species.synonyms.join(", ")] : null,
                      species.typeLocality ? ["Localidad tipo", species.typeLocality] : null,
                    ] as ([string, string | null] | null)[]
                  )
                    .filter((row): row is [string, string] => !!row && !!row[1])
                    .map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 px-6 py-3">
                        <span className="font-mono text-caption text-text3 uppercase tracking-wide shrink-0">
                          {label}
                        </span>
                        <span className="font-sans text-body-md text-text1 text-right max-w-[65%]">
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
              {species.tags.length > 0 && (
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
              )}

              {/* Related species */}
              <div className="border border-border bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-mono text-caption text-text3 uppercase tracking-widest">
                    {t("related_label")}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {relatedSpecies.map((rel) => {
                    const relName =
                      (isEn ? rel.commonNameEn : rel.commonNameEs) ?? rel.commonNameEs ?? rel.scientificName;
                    return (
                      <Link
                        key={rel.id}
                        href={`/especies/${rel.slug}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-void transition-colors duration-300 group"
                      >
                        <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-surface">
                          {rel.image && (
                            <Image
                              src={rel.image}
                              alt={rel.scientificName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-400"
                            />
                          )}
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

function MorphCard({
  title,
  content,
  lengthMm,
}: {
  title: string;
  content: string;
  lengthMm?: number | null;
}) {
  return (
    <div className="border-l-2 border-gold pl-6">
      <p className="font-mono text-caption text-gold uppercase tracking-widest mb-2">
        {title}
        {lengthMm ? <span className="text-text3 normal-case"> · {lengthMm} mm</span> : null}
      </p>
      <p className="font-sans text-body-md text-text2 leading-relaxed">{content}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border px-3 py-2">
      <p className="font-mono text-caption text-text3 uppercase tracking-wide">{label}</p>
      <p className="font-sans text-body-md text-text1">{value}</p>
    </div>
  );
}
