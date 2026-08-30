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
 * 3. En la ficha, `author` es la AUTORIDAD TAXONÓMICA (string, "Sinéty, 1901")
 *    y quien redactó la ficha va aparte en `curator`. Compartían clave y el
 *    objeto pisaba al string, dejando la autoría taxonómica inalcanzable.
 * 4. `presenceInMexico` es un booleano en ambos lados; `nativeToMexico` va
 *    aparte porque una especie puede estar presente sin ser nativa.
 *
 * Divergencia que SÍ requiere trabajo en el componente: `description` es
 * Portable Text (array de bloques) en Sanity y string plano en el placeholder.
 * Al conectar la ficha de especie hace falta un renderer de Portable Text.
 */

/**
 * Sanity redimensiona y recodifica en su CDN, así que no tiene sentido darle a
 * Next el original completo solo para que lo encoja.
 *
 * Dos cosas medidas sobre una foto real del catálogo (800×1200, 122 KB JPEG),
 * las dos contraintuitivas:
 *
 * 1. `q` es obligatorio. Sin él, la conversión a WebP sale a calidad alta y
 *    puede pesar MÁS que el original. Con `q=75` baja a 63 KB.
 * 2. Sanity SÍ reescala hacia arriba. Pedir `w=1600` sobre un original de
 *    800px lo agranda hasta 128 KB en vez de recortarlo. Por eso las imágenes
 *    grandes van sin `w`: se sirven a su resolución nativa y Next genera desde
 *    ahí. El `w` se reserva para lo que se pinta pequeño de verdad.
 */
const img = (path: string, width?: number) =>
  /* groq */ `${path}.asset->url + "?${width ? `w=${width}&` : ""}auto=format&q=75"`;

/** Portable Text con los assets de las imágenes ya resueltos a URL. */
const PROSE = (field: string) => /* groq */ `
  "${field}": ${field}[]{
    ...,
    _type == "image" => { ..., "asset": asset->{ url } }
  }
`;

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
  "presenceInMexico": coalesce(presenceInMexico, false),
  nativeToMexico,
  "mexicoStates": coalesce(mexicoStates, []),
  "image": ${img("mainImage")},
  "imageAlt": mainImage.alt,
  "aspectRatio": mainImage.asset->metadata.dimensions.aspectRatio,
  "tags": coalesce(tags, []),
  psgNumber
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
    ${PROSE("description")},
    ${PROSE("descriptionEn")},
    habitat,
    behavior,
    tribe,
    "synonyms": coalesce(synonyms, []),
    typeLocality,
    bodyLengthFemaleMm,
    bodyLengthMaleMm,
    parthenogenetic,
    rearingDifficulty,
    incubationMonthsMin,
    incubationMonthsMax,
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
      "src": ${img("@")},
      caption,
      credit,
      alt
    }, []),
    "references": coalesce(references, []),
    publishedAt,
    "curator": author-> {
      name,
      roleLabel,
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
  "image": ${img("mainImage")},
  "imageCaption": mainImage.caption,
  "tags": coalesce(tags, []),
  author-> {
    name,
    roleLabel,
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
    ${PROSE("bodyEs")},
    ${PROSE("bodyEn")},
    author-> {
      name,
      roleLabel,
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
      "image": ${img("mainImage", 400)}
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
    psgNumber,
    "tags": coalesce(tags, []),
    "image": ${img("mainImage", 160)}
  },
  "articles": *[_type == "article"] | order(publishedAt desc) {
    "slug": slug.current,
    titleEs,
    titleEn,
    category,
    publishedAt,
    readingMinutes,
    excerpt,
    excerptEn,
    "tags": coalesce(tags, []),
    "image": ${img("mainImage", 160)}
  }
}`;

/** Todos los slugs, para `generateStaticParams` sin traerse el documento entero. */
export const speciesSlugsQuery = groq`*[_type == "species" && defined(slug.current)].slug.current`;
export const articleSlugsQuery = groq`*[_type == "article" && defined(slug.current)].slug.current`;
