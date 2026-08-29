export { metadata, viewport } from "next-sanity/studio";

/**
 * `/studio` cae fuera de `[locale]`, así que aporta su propio `<html>`/`<body>`
 * (igual que `not-found.tsx` en la raíz) — el layout raíz es de paso.
 *
 * `force-dynamic` saca esta ruta del prerender de `next build`: el Studio es
 * una SPA cliente que no tiene nada que hacer estático, y sin esto Next
 * intentaría generarla en build time, donde `NEXT_PUBLIC_SANITY_PROJECT_ID`
 * puede no existir (no hay `.env.local` en este repo).
 */
export const dynamic = "force-dynamic";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
