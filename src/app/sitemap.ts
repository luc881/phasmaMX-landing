import type { MetadataRoute } from "next";
import { PLACEHOLDER_SPECIES } from "@/lib/placeholder/species";
import { PLACEHOLDER_ARTICLES } from "@/lib/placeholder/articles";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phasmamx.com";
const LOCALES = ["es", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages — [path, priority, changeFrequency]
  const staticRoutes: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1.0, "weekly"],
    ["/especies", 0.9, "weekly"],
    ["/articulos", 0.8, "weekly"],
    ["/acerca-de", 0.5, "monthly"],
  ];

  const staticEntries = staticRoutes.flatMap(([path, priority, changeFrequency]) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );

  // Species detail pages
  const speciesEntries = PLACEHOLDER_SPECIES.flatMap((species) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/especies/${species.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}/especies/${species.slug}`])
        ),
      },
    }))
  );

  // Article detail pages
  const articleEntries = PLACEHOLDER_ARTICLES.flatMap((article) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/articulos/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}/articulos/${article.slug}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...speciesEntries, ...articleEntries];
}
