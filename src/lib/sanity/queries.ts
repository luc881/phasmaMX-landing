import { groq } from "next-sanity";

/**
 * Las proyecciones devuelven deliberadamente la MISMA forma que las interfaces
 * de `src/lib/placeholder/` (`SpeciesPlaceholder`, `ArticlePlaceholder`), para
 * que conectar una página sea cambiar de dónde vienen los datos y no reescribir
 * el componente.
 *
 * Tres conversiones que el esquema de Sanity no puede evitar:
 *
 * 1. `coords` se guarda como `geopoint` (da selector de mapa en el Studio) pero
 *    `SpeciesMap` espera la tupla `[lng, lat]`. Se convierte aquí.
 * 2. `aspectRatio` no se almacena — se deriva de los metadatos del asset. Sale
 *    como número (0.75), no como el string "3/4" del placeholder; CSS acepta
 *    ambos en `aspect-ratio`.
 * 3. `presenceInMexico` es un objeto en Sanity y un booleano en el placeholder:
 *    se aplana a `presenceInMexico.present`.
 *
 * Divergencia que SÍ requiere trabajo en el componente: `description` es
 * Portable Text (array de bloques) en Sanity y string plano en el placeholder.
 * Al conectar la ficha de especie hace falta un renderer de Portable Text.
 */

/** Campos compartidos por las vistas de listado de especies. */
const SPECIES_CARD_FIELDS = /* groq */ `
  "id": _id,
  "slug": slug.current,
  scientificName,
  "author": taxonomicAuthor,
  year,
  commonNameEs,
  commonNameEn,
  family,
  subfamily,
  genus,
  order,
  catalogNum,
  conservationStatus,
  geographicOrigin,
  "presenceInMexico": coalesce(presenceInMexico.present, false),
  "mexicoStates": coalesce(mexicoStates, presenceInMexico.states, []),
  "image": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "aspectRatio": mainImage.asset->metadata.dimensions.aspectRatio,
  "tags": coalesce(tags, []),
  "tagsEn": coalesce(tagsEn, [])
`;

/** Localidades con las coordenadas ya en el orden que espera el mapa. */
const SPECIES_LOCATIONS = /* groq */ `
  "mexicoLocations": coalesce(mexicoLocations[]{
    municipality,
    state,
    "coords": [coords.lng, coords.lat],
    date,
    collector,
    note
  }, [])
`;

export const featuredSpeciesQuery = groq`
  *[_type == "species" && featured == true] | order(publishedAt desc) [0...6] {
    ${SPECIES_CARD_FIELDS}
  }
`;

export const speciesCatalogQuery = groq`
  *[_type == "species"] | order(scientificName asc) {
    ${SPECIES_CARD_FIELDS}
  }
`;

export const speciesDetailQuery = groq`
  *[_type == "species" && slug.current == $slug][0] {
    ${SPECIES_CARD_FIELDS},
    ${SPECIES_LOCATIONS},
    description,
    descriptionEn,
    habitat,
    behavior,
    "foodPlants": coalesce(foodPlants, []),
    "foodPlantsEn": coalesce(foodPlantsEn, []),
    females,
    femalesEn,
    males,
    malesEn,
    nymphs,
    nymphsEn,
    eggs,
    eggsEn,
    breeding,
    breedingEn,
    "gallery": coalesce(gallery[]{
      "src": asset->url,
      caption,
      credit,
      alt
    }, []),
    "references": coalesce(references, []),
    publishedAt,
    author-> {
      name,
      "role": coalesce(roleLabel, role),
      bio,
      initials,
      "photo": photo.asset->url
    }
  }
`;

/** Especies de la misma familia, para el bloque de relacionadas. */
export const relatedSpeciesQuery = groq`
  *[_type == "species" && family == $family && slug.current != $slug] | order(scientificName asc) [0...3] {
    ${SPECIES_CARD_FIELDS}
  }
`;

/** Campos compartidos por las vistas de listado de artículos. */
const ARTICLE_CARD_FIELDS = /* groq */ `
  "id": _id,
  "slug": slug.current,
  titleEs,
  titleEn,
  publishedAt,
  readingMinutes,
  category,
  excerpt,
  excerptEn,
  "image": mainImage.asset->url,
  "imageCaption": mainImage.caption,
  "tags": coalesce(tags, []),
  author-> {
    name,
    "role": coalesce(roleLabel, role),
    initials
  }
`;

export const latestArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) [0...4] {
    ${ARTICLE_CARD_FIELDS}
  }
`;

export const articlesIndexQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }
`;

export const articleDetailQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ${ARTICLE_CARD_FIELDS},
    bodyEs,
    bodyEn,
    author-> {
      name,
      "role": coalesce(roleLabel, role),
      bio,
      initials,
      "photo": photo.asset->url
    },
    "relatedSlugs": relatedArticles[]->slug.current,
    relatedSpecies[]-> {
      scientificName,
      commonNameEs,
      commonNameEn,
      "slug": slug.current,
      "image": mainImage.asset->url
    }
  }
`;

/** Índice reducido para el buscador global: solo lo que se filtra y se pinta. */
export const searchIndexQuery = groq`{
  "species": *[_type == "species"] | order(scientificName asc) {
    "slug": slug.current,
    scientificName,
    commonNameEs,
    commonNameEn,
    family,
    catalogNum,
    "tags": coalesce(tags, [])
  },
  "articles": *[_type == "article"] | order(publishedAt desc) {
    "slug": slug.current,
    titleEs,
    titleEn,
    category,
    publishedAt
  }
}`;

/** Todos los slugs, para `generateStaticParams` sin traerse el documento entero. */
export const speciesSlugsQuery = groq`*[_type == "species" && defined(slug.current)].slug.current`;
export const articleSlugsQuery = groq`*[_type == "article" && defined(slug.current)].slug.current`;
