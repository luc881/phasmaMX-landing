import { groq } from "next-sanity";

export const featuredSpeciesQuery = groq`
  *[_type == "species" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    scientificName,
    commonNameEs,
    commonNameEn,
    family,
    subfamily,
    geographicOrigin,
    conservationStatus,
    "slug": slug.current,
    mainImage {
      asset,
      alt,
      credit,
      hotspot,
      crop
    },
    presenceInMexico
  }
`;

export const latestArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) [0...4] {
    _id,
    titleEs,
    titleEn,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    excerptEn,
    mainImage {
      asset,
      alt,
      hotspot,
      crop
    },
    author-> {
      name,
      role
    }
  }
`;

export const speciesCatalogQuery = groq`
  *[_type == "species"] | order(scientificName asc) {
    _id,
    scientificName,
    commonNameEs,
    commonNameEn,
    family,
    subfamily,
    conservationStatus,
    "slug": slug.current,
    mainImage {
      asset,
      alt,
      hotspot,
      crop
    },
    presenceInMexico
  }
`;

export const speciesDetailQuery = groq`
  *[_type == "species" && slug.current == $slug][0] {
    _id,
    scientificName,
    commonNameEs,
    commonNameEn,
    family,
    subfamily,
    genus,
    geographicOrigin,
    presenceInMexico,
    description,
    descriptionEn,
    habitat,
    behavior,
    conservationStatus,
    gallery[] {
      asset,
      alt,
      credit,
      caption,
      hotspot,
      crop
    },
    mainImage {
      asset,
      alt,
      credit,
      hotspot,
      crop
    },
    references,
    publishedAt,
    author-> {
      name,
      role,
      bio,
      photo { asset }
    }
  }
`;

export const articleDetailQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    titleEs,
    titleEn,
    publishedAt,
    category,
    excerpt,
    excerptEn,
    bodyEs,
    bodyEn,
    tags,
    mainImage {
      asset,
      alt,
      credit,
      hotspot,
      crop
    },
    author-> {
      name,
      role,
      bio,
      photo { asset }
    },
    relatedSpecies[]-> {
      scientificName,
      commonNameEs,
      "slug": slug.current,
      mainImage { asset, alt }
    }
  }
`;
