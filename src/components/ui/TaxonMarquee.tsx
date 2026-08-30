import type { SpeciesCard } from "@/lib/content/species";

/**
 * Banda de cajón de colección: los binomios del archivo desfilando con su
 * número de catálogo. Sin JS — animación CSS, pausa al hover, se detiene con
 * `prefers-reduced-motion`. Decorativa: el contenido ya vive en el catálogo.
 *
 * Abre el pliego claro: aquí el sitio cambia de tinta sobre negro a tinta
 * sobre papel. `data-surface` lo lee el header para invertir su color.
 */
export default function TaxonMarquee({
  species,
}: {
  species: Pick<SpeciesCard, "scientificName" | "catalogNum">[];
}) {
  const specimens = species.map((s) => ({
    // Un puñado de fichas aún no tiene número de catálogo asignado.
    num: s.catalogNum ?? "—",
    name: s.scientificName,
  }));

  return (
    <div
      aria-hidden="true"
      data-surface="paper"
      className="surface-paper group relative overflow-hidden border-b border-paper-border py-8 lg:py-10"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-baseline">
            {specimens.map((s, i) => (
              <span
                key={`${copy}-${i}-${s.name}`}
                className="flex items-baseline gap-4 px-8 lg:px-10"
              >
                <span className="catalog-number shrink-0 text-ink-3">{s.num}</span>
                <span className="whitespace-nowrap font-display text-display-sm font-light italic text-void">
                  {s.name}
                </span>
                <span className="h-1 w-1 shrink-0 rotate-45 bg-gold-dim" />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Difuminado en los cantos para que la banda entre y salga del pliego */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-paper to-transparent lg:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-paper to-transparent lg:w-32" />
    </div>
  );
}
