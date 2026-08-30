import { sanityClient, sanityFetch } from "@/lib/sanity/client";
import {
  articleDetailQuery,
  articleSlugsQuery,
  articlesIndexQuery,
  latestArticlesQuery,
  searchIndexQuery,
} from "@/lib/sanity/queries";
import type { PortableTextBlock } from "@portabletext/types";
import type { ArticleCategory } from "@/lib/placeholder/articles";

export type ArticleAuthorRef = {
  name: string;
  roleLabel: string | null;
  initials: string | null;
  bio?: string | null;
  photo?: string | null;
};

/** Lo que devuelve `ARTICLE_CARD_FIELDS`: las vistas de listado. */
export type ArticleCard = {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string | null;
  publishedAt: string;
  readingMinutes: number | null;
  category: ArticleCategory;
  excerpt: string | null;
  excerptEn: string | null;
  image: string | null;
  imageCaption: string | null;
  tags: string[];
  author: ArticleAuthorRef | null;
};

export type ArticleDetail = ArticleCard & {
  bodyEs: PortableTextBlock[] | null;
  bodyEn: PortableTextBlock[] | null;
  relatedSlugs: string[] | null;
  relatedSpecies:
    | {
        scientificName: string;
        commonNameEs: string | null;
        commonNameEn: string | null;
        slug: string;
        image: string | null;
      }[]
    | null;
};

/** Etiqueta de caché que purga `/api/revalidate` al publicar un artículo. */
export const ARTICLE_TAG = "sanity:article";

export function getLatestArticles() {
  return sanityFetch<ArticleCard[]>({
    query: latestArticlesQuery,
    tags: [ARTICLE_TAG],
  });
}

export function getArticlesIndex() {
  return sanityFetch<ArticleCard[]>({
    query: articlesIndexQuery,
    tags: [ARTICLE_TAG],
  });
}

export function getArticleBySlug(slug: string) {
  return sanityFetch<ArticleDetail | null>({
    query: articleDetailQuery,
    params: { slug },
    tags: [ARTICLE_TAG, `${ARTICLE_TAG}:${slug}`],
  });
}

/**
 * Los slugs se piden con el cliente plano, NO con `sanityFetch`: ese helper
 * consulta `draftMode()`, y Next prohíbe las APIs dinámicas dentro de
 * `generateStaticParams` — con él ambas rutas `[slug]` devuelven 500 y el
 * prerender se cae. Aquí no hace falta perspectiva de borrador: la lista de
 * rutas a generar es siempre la del contenido publicado.
 */
export function getArticleSlugs() {
  return sanityClient.fetch<string[]>(articleSlugsQuery, {}, {
    next: { tags: [ARTICLE_TAG] },
  });
}

/** Índice reducido para el buscador global: species + articles en una consulta. */
export type SearchIndex = {
  species: {
    slug: string;
    scientificName: string;
    commonNameEs: string | null;
    commonNameEn: string | null;
    family: string;
    catalogNum: string | null;
    psgNumber: string | null;
    tags: string[];
    image: string | null;
  }[];
  articles: {
    slug: string;
    titleEs: string;
    titleEn: string | null;
    category: ArticleCategory;
    publishedAt: string;
    readingMinutes: number | null;
    excerpt: string | null;
    excerptEn: string | null;
    tags: string[];
    image: string | null;
  }[];
};

export function getSearchIndex() {
  return sanityFetch<SearchIndex>({
    query: searchIndexQuery,
    tags: [ARTICLE_TAG, "sanity:species"],
  });
}
