import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — Phasma MX",
    default: "Phasma MX — Archivo de Phasmatodea en México y América Latina",
  },
  description:
    "El archivo científico de referencia sobre insectos palo (Phasmatodea) en México y América Latina. Catálogo de especies, artículos de divulgación y expediciones de campo.",
  keywords: ["phasmatodea", "insecto palo", "fásmidos", "México", "entomología", "biología"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Phasma MX",
  },
};

/**
 * Layout raíz de paso.
 *
 * `<html>` y `<body>` viven en `[locale]/layout.tsx`, no aquí: este layout se
 * renderiza por encima del segmento `[locale]`, así que la única forma de
 * conocer el idioma sería `getLocale()`, que lee cabeceras de la petición. Eso
 * marca todo el árbol como dinámico y en Next 16 dejaba el sitio entero sin
 * prerenderizar (87 páginas SSG → 0). Tomando el locale de `params` en
 * `[locale]` el render vuelve a ser estático.
 *
 * `not-found.tsx` de raíz cae fuera de `[locale]`, así que aporta su propio
 * `<html>`/`<body>`.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
