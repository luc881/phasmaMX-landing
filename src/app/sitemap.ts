import type { MetadataRoute } from "next";
import { getSpeciesSlugs } from "@/lib/content/species";
import { getArticleSlugs } from "@/lib/content/articles";

/**
 * `||` y no `??`: una variable declarada pero vacía en el panel del host deja
 * `BASE_URL` en "" y el sitemap sale con URLs relativas (`<loc>/es</loc>`),
 * que Google rechaza. Vercel expone el dominio de producción por su cuenta,
 * así que en el caso normal no hay que configurar nada.
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://phasmamx.com");
const LOCALES = ["es", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // Los slugs son lo único que expone el índice de Sanity; no traemos fecha de
  // publicación por artículo aquí (sería una query aparte). Usamos "now" para
  // todo el contenido, igual que las rutas estáticas de abajo — un sitemap no
  // necesita fechas exactas, solo señal de que existe y una prioridad/frecuencia.
  const [speciesSlugs, articleSlugs] = await Promise.all([
    getSpeciesSlugs(),
    getArticleSlugs(),
  ]);

  // Static pages — [path, priority, changeFrequency]
  const staticRoutes: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1.0, "weekly"],
    ["/especies", 0.9, "weekly"],
    ["/articulos", 0.8, "weekly"],
    ["/publicaciones", 0.7, "monthly"],
    ["/publicaciones/phasmida-de-mexico", 0.6, "monthly"],
    ["/publicaciones/propias", 0.6, "monthly"],
    ["/crianza", 0.7, "monthly"],
    ["/crianza/antes-de-empezar", 0.6, "monthly"],
    ["/crianza/el-terrario", 0.6, "monthly"],
    ["/crianza/alimentacion", 0.6, "monthly"],
    ["/crianza/incubacion", 0.6, "monthly"],
    ["/fotografias", 0.7, "monthly"],
    ["/fotografias/insectos", 0.6, "monthly"],
    ["/fotografias/eventos", 0.6, "monthly"],
    ["/eventos", 0.7, "weekly"],
    ["/expediciones", 0.6, "monthly"],
    ["/acerca-de", 0.5, "monthly"],
    ["/colaborar", 0.5, "monthly"],
    ["/contacto", 0.5, "monthly"],
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
  const speciesEntries = speciesSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/especies/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}/especies/${slug}`])
        ),
      },
    }))
  );

  // Article detail pages
  const articleEntries = articleSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/articulos/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}/articulos/${slug}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...speciesEntries, ...articleEntries];
}
