import type { SpeciesCard } from "@/lib/content/species";
import type { ConservationStatus } from "@/lib/placeholder/species";

/**
 * Índice del catálogo, agrupado por familia taxonómica.
 * Lógica pura: sin React, sin DOM, sin fetch.
 */

export const UNASSIGNED_FAMILY = "Sin familia asignada";

export type SortKey = "family" | "catalogNum" | "scientificName" | "conservationStatus";

export interface FamilyGroup {
  family: string;
  count: number;
  species: SpeciesCard[];
}

/** Comparador es-MX: acentos y "ñ" en su sitio, y numérico para cosas como "MX-002" < "MX-010". */
const collator = new Intl.Collator("es", { sensitivity: "base", numeric: true });

/**
 * Orden de gravedad UICN, no alfabético: EX/CR es lo más grave, LC lo menos.
 * `ConservationStatus` (src/lib/placeholder/species.ts) no incluye "EX" (extinta) —
 * el dataset del proyecto no la usa — así que no aparece aquí.
 * DD y NE ("datos insuficientes" / "no evaluado") no son grados de amenaza:
 * van después de LC, empatados entre sí, y se desempatan por nombre científico.
 */
const CONSERVATION_SEVERITY: Record<ConservationStatus, number> = {
  CR: 0,
  EN: 1,
  VU: 2,
  NT: 3,
  LC: 4,
  DD: 5,
  NE: 5,
};

function normalizeFamily(family: string | null | undefined): string {
  const trimmed = family?.trim();
  return trimmed ? trimmed : UNASSIGNED_FAMILY;
}

/** Nulls siempre al final, sin importar el criterio. */
function compareNullableText(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return collator.compare(a, b);
}

export function compareSpecies(a: SpeciesCard, b: SpeciesCard, key: SortKey): number {
  switch (key) {
    case "catalogNum":
      return (
        compareNullableText(a.catalogNum, b.catalogNum) ||
        collator.compare(a.scientificName, b.scientificName)
      );
    case "conservationStatus": {
      const diff = CONSERVATION_SEVERITY[a.conservationStatus] - CONSERVATION_SEVERITY[b.conservationStatus];
      return diff !== 0 ? diff : collator.compare(a.scientificName, b.scientificName);
    }
    case "family":
      return (
        collator.compare(normalizeFamily(a.family), normalizeFamily(b.family)) ||
        collator.compare(a.scientificName, b.scientificName)
      );
    case "scientificName":
    default:
      return collator.compare(a.scientificName, b.scientificName);
  }
}

/** Copia ordenada (no muta el arreglo original). */
export function sortSpecies(species: SpeciesCard[], key: SortKey = "scientificName"): SpeciesCard[] {
  return [...species].sort((a, b) => compareSpecies(a, b, key));
}

/**
 * Agrupa por familia para el índice del catálogo.
 * Familias ordenadas alfabéticamente (es); "Sin familia asignada" siempre al
 * final y sin mezclarse con el resto, aunque alfabéticamente le tocaría antes.
 * `sortWithin` controla el orden de las especies dentro de cada grupo.
 */
export function groupByFamily(
  species: SpeciesCard[],
  sortWithin: SortKey = "scientificName",
): FamilyGroup[] {
  const byFamily = new Map<string, SpeciesCard[]>();

  for (const item of species) {
    const family = normalizeFamily(item.family);
    const bucket = byFamily.get(family);
    if (bucket) {
      bucket.push(item);
    } else {
      byFamily.set(family, [item]);
    }
  }

  const hasUnassigned = byFamily.has(UNASSIGNED_FAMILY);
  const families = [...byFamily.keys()]
    .filter((family) => family !== UNASSIGNED_FAMILY)
    .sort((a, b) => collator.compare(a, b));
  if (hasUnassigned) families.push(UNASSIGNED_FAMILY);

  return families.map((family) => {
    const groupSpecies = byFamily.get(family)!;
    return {
      family,
      count: groupSpecies.length,
      species: sortSpecies(groupSpecies, sortWithin),
    };
  });
}
