import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phasmamx.com";

/**
 * La indexación está cerrada salvo que se abra explícitamente.
 *
 * El valor por defecto es deliberado: olvidar la variable deja el sitio fuera
 * de Google, que se arregla en un minuto; el olvido contrario deja indexado
 * contenido provisional, y desindexar cuesta semanas. Mientras las fichas se
 * ilustren con fotografía de relleno, esto se queda cerrado.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/", "/studio"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
