"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STATUS_META, type ConservationStatus } from "@/lib/placeholder/species";
import type { SpeciesCard } from "@/lib/content/species";
import {
  UNASSIGNED_FAMILY,
  groupByFamily,
  sortSpecies,
  type SortKey,
} from "@/lib/catalog/grouping";
import SpeciesHoverPreview, {
  type SpeciesHoverPreviewHandle,
} from "./SpeciesHoverPreview";

const SORT_KEYS: SortKey[] = [
  "family",
  "catalogNum",
  "scientificName",
  "conservationStatus",
];

/**
 * Índice del catálogo: una tabla densa pensada para recorrer con la vista,
 * frente a la cuadrícula, que está pensada para mirar fotografías.
 *
 * Agrupa por familia porque es el eje real del dominio — el equivalente
 * científico a agrupar una bibliografía por año. Con el orden en "familia" los
 * grupos llevan su conteo; con cualquier otro criterio la lista se aplana,
 * porque mezclar agrupación y ordenación arbitraria confunde más que ayuda.
 */
export default function SpeciesIndex({
  species,
  locale,
}: {
  species: SpeciesCard[];
  locale: string;
}) {
  const t = useTranslations("catalog");
  const [sort, setSort] = useState<SortKey>("family");
  const previewRef = useRef<SpeciesHoverPreviewHandle>(null);

  const grouped = sort === "family";

  const groups = useMemo(
    () =>
      grouped
        ? groupByFamily(species)
        : [{ family: "", count: species.length, species: sortSpecies(species, sort) }],
    [species, sort, grouped]
  );

  const commonName = (s: SpeciesCard) =>
    (locale === "en" ? s.commonNameEn : s.commonNameEs) ??
    s.commonNameEs ??
    s.scientificName;

  return (
    <div>
      {/* Selector de orden */}
      <div className="container-site flex items-center gap-3 flex-wrap py-6">
        <span className="font-mono text-caption uppercase tracking-widest text-text3">
          {t("sort_label")}
        </span>
        {SORT_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            aria-pressed={sort === key}
            className={`border px-3 py-1.5 font-mono text-caption uppercase tracking-widest transition-colors duration-300 ${
              sort === key
                ? "border-gold text-gold"
                : "border-border text-text3 hover:border-border-2 hover:text-text1"
            }`}
          >
            {t(
              (
                {
                  family: "sort_family",
                  catalogNum: "sort_catalog",
                  scientificName: "sort_name",
                  conservationStatus: "sort_status",
                } as const
              )[key]
            )}
          </button>
        ))}
      </div>

      {/* No es pegajosa a propósito: encadenada bajo el header y la barra de
          filtros habría que cuadrar tres alturas a mano, y cualquier cambio de
          padding vuelve a solaparlas. Con la familia repetida en cada fila, el
          encabezado no hace falta a media tabla. */}
      <div className="border-y border-border">
        <div className="container-site grid grid-cols-[5.5rem_1fr] md:grid-cols-[5.5rem_minmax(0,1.4fr)_minmax(0,1fr)_9rem_3rem] gap-4 py-2.5 font-mono text-caption uppercase tracking-widest text-text3">
          <span>{t("col_catalog")}</span>
          <span>{t("col_species")}</span>
          <span className="hidden md:block">{t("col_common")}</span>
          <span className="hidden md:block">{t("col_family")}</span>
          <span className="hidden md:block text-right">{t("col_status")}</span>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.family || "all"}>
          {grouped && (
            <div className="container-site pt-10 pb-3">
              <h2 className="font-mono text-caption uppercase tracking-widest text-text2">
                {group.family === UNASSIGNED_FAMILY ? t("no_family") : group.family}{" "}
                <span className="text-gold-dim tabular-nums">({group.count})</span>
              </h2>
            </div>
          )}

          {group.species.map((s) => {
            const status = STATUS_META[s.conservationStatus as ConservationStatus];
            return (
              <Link
                key={s.id}
                href={`/especies/${s.slug}`}
                onMouseEnter={(e) =>
                  previewRef.current?.show(
                    {
                      src: s.image,
                      alt: `${s.scientificName} — ${commonName(s)}`,
                      catalogNum: s.catalogNum ?? undefined,
                      aspectRatio: s.aspectRatio,
                    },
                    e
                  )
                }
                onMouseLeave={() => previewRef.current?.hide()}
                className="group block border-b border-border/60 hover:bg-surface transition-colors duration-300"
              >
                <div className="container-site grid grid-cols-[5.5rem_1fr] md:grid-cols-[5.5rem_minmax(0,1.4fr)_minmax(0,1fr)_9rem_3rem] gap-4 items-baseline py-3">
                  <span className="catalog-number group-hover:text-gold-dim transition-colors duration-300">
                    {s.catalogNum ?? "—"}
                  </span>

                  <span className="font-mono text-mono-sm italic text-gold truncate">
                    {s.scientificName}
                  </span>

                  <span className="hidden md:block font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300 truncate">
                    {commonName(s)}
                  </span>

                  <span className="hidden md:block font-mono text-caption text-text3 truncate">
                    {s.family}
                  </span>

                  <span
                    className={`hidden md:block justify-self-end font-mono text-caption px-2 py-0.5 ${status.color} ${status.bg}`}
                    title={status.label}
                  >
                    {s.conservationStatus}
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      ))}

      <SpeciesHoverPreview ref={previewRef} />
    </div>
  );
}
