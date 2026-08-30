import { sanityClient, sanityFetch } from "@/lib/sanity/client";
import {
  featuredSpeciesQuery,
  relatedSpeciesQuery,
  speciesCatalogQuery,
  speciesDetailQuery,
  speciesSlugsQuery,
} from "@/lib/sanity/queries";
import type { PortableTextBlock } from "@portabletext/types";
import type { ConservationStatus, SpeciesLocation } from "@/lib/placeholder/species";

/**
 * Lo que devuelve `SPECIES_CARD_FIELDS` de las consultas GROQ: el subconjunto
 * que pintan las vistas de listado (catálogo, destacadas, buscador).
 *
 * Casi calca a `SpeciesPlaceholder`, con dos diferencias que vienen de Sanity:
 * `aspectRatio` llega como número (0.75) porque sale de los metadatos del
 * asset, no como el string "3/4"; CSS acepta ambos. Y `image` puede faltar si
 * la ficha aún no tiene fotografía.
 */
export type SpeciesCard = {
  id: string;
  slug: string;
  scientificName: string;
  author: string | null;
  year: number | null;
  commonNameEs: string | null;
  commonNameEn: string | null;
  family: string;
  subfamily: string | null;
  genus: string | null;
  order: string | null;
  catalogNum: string | null;
  conservationStatus: ConservationStatus;
  geographicOrigin: string | null;
  presenceInMexico: boolean;
  nativeToMexico: boolean | null;
  mexicoStates: string[];
  image: string | null;
  imageAlt: string | null;
  aspectRatio: number | null;
  tags: string[];
  psgNumber: string | null;
};

/** Etiqueta de caché que purga `/api/revalidate` al publicar una especie. */
export const SPECIES_TAG = "sanity:species";

export function getSpeciesCatalog() {
  return sanityFetch<SpeciesCard[]>({
    query: speciesCatalogQuery,
    tags: [SPECIES_TAG],
  });
}

/**
 * Los slugs se piden con el cliente plano, NO con `sanityFetch`: ese helper
 * consulta `draftMode()`, y Next prohíbe las APIs dinámicas dentro de
 * `generateStaticParams` — con él ambas rutas `[slug]` devuelven 500 y el
 * prerender se cae. Aquí no hace falta perspectiva de borrador: la lista de
 * rutas a generar es siempre la del contenido publicado.
 */
export function getSpeciesSlugs() {
  return sanityClient.fetch<string[]>(speciesSlugsQuery, {}, {
    next: { tags: [SPECIES_TAG] },
  });
}

/** Lo que añade `speciesDetailQuery` sobre la tarjeta, para la ficha completa. */
export type SpeciesDetail = SpeciesCard & {
  mexicoLocations: SpeciesLocation[];
  description: PortableTextBlock[] | null;
  descriptionEn: PortableTextBlock[] | null;
  habitat: string | null;
  behavior: string | null;
  tribe: string | null;
  synonyms: string[];
  typeLocality: string | null;
  bodyLengthFemaleMm: number | null;
  bodyLengthMaleMm: number | null;
  parthenogenetic: boolean | null;
  rearingDifficulty: "easy" | "moderate" | "hard" | "unknown" | null;
  incubationMonthsMin: number | null;
  incubationMonthsMax: number | null;
  foodPlants: string[];
  foodPlantsEn: string[];
  females: string | null;
  femalesEn: string | null;
  males: string | null;
  malesEn: string | null;
  nymphs: string | null;
  nymphsEn: string | null;
  eggs: string | null;
  eggsEn: string | null;
  breeding: string | null;
  breedingEn: string | null;
  gallery: { src: string; caption: string | null; credit: string | null; alt: string | null }[];
  references: string[];
  publishedAt: string | null;
  /** Quien redactó la ficha. La autoría taxonómica es `author`, heredado de SpeciesCard. */
  curator: {
    name: string;
    roleLabel: string | null;
    bio: string | null;
    initials: string | null;
    photo: string | null;
  } | null;
};

export function getFeaturedSpecies() {
  return sanityFetch<SpeciesCard[]>({
    query: featuredSpeciesQuery,
    tags: [SPECIES_TAG],
  });
}

export function getSpeciesBySlug(slug: string) {
  return sanityFetch<SpeciesDetail | null>({
    query: speciesDetailQuery,
    params: { slug },
    tags: [SPECIES_TAG, `${SPECIES_TAG}:${slug}`],
  });
}

/** Otras especies de la misma familia, para el bloque de relacionadas. */
export function getRelatedSpecies(family: string, slug: string) {
  return sanityFetch<SpeciesCard[]>({
    query: relatedSpeciesQuery,
    params: { family, slug },
    tags: [SPECIES_TAG],
  });
}
