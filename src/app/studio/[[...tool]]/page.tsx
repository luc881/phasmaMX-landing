"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * El Studio es una SPA de cliente y esta directiva es obligatoria, no
 * cosmética: sin ella `sanity.config.ts` entra en el grafo de Server
 * Component, donde Turbopack resuelve `swr` por su condición `react-server`
 * — un stub sin export default — y el build revienta con
 * "Export default doesn't exist in target module" apuntando a `useSWR`.
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
