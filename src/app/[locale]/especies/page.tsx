import { setRequestLocale } from "next-intl/server";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export const metadata = {
  title: "Catálogo de especies — Phasma MX",
  description: "Archivo sistemático de Phasmatodea: especies nativas, exóticas y endémicas con fichas taxonómicas completas.",
};

export default async function EspeciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      {/* ── Page header ── */}
      <header className="border-b border-border">
        <div className="container-site pt-32 pb-16">
          <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
            Phasmatodea · Catálogo sistemático
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="font-display text-display-lg font-light text-text1 mb-4">
                Catálogo de{" "}
                <em className="italic text-gold" style={{ fontStyle: "italic" }}>
                  especies
                </em>
              </h1>
              <p className="font-sans text-body-lg text-text2 max-w-2xl leading-relaxed">
                Registro sistemático de fásmidos con fichas taxonómicas, fotografías de campo
                y referencias bibliográficas. Incluye especies nativas de México, exóticas de
                interés científico y taxa endémicos.
              </p>
            </div>

            {/* Stats rápidos */}
            <div className="flex gap-8 shrink-0">
              {[
                ["240+", "Especies"],
                ["120+", "Nativas MX"],
                ["6", "Familias"],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="font-display text-display-md font-light text-gold">{val}</p>
                  <p className="font-mono text-caption text-text3 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Catalog grid with filters ── */}
      <CatalogGrid />

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border">
        <div className="container-site py-20 text-center">
          <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
            ¿Conoces una especie no registrada?
          </p>
          <h2 className="font-display text-display-sm font-light text-text1 mb-6">
            Contribuye al archivo
          </h2>
          <p className="font-sans text-body-md text-text2 max-w-lg mx-auto mb-8">
            Si tienes registros fotográficos, datos de campo o publicaciones sobre fásmidos
            en México o América Latina, contáctanos para colaborar.
          </p>
          <a href="/es/colaborar" className="btn-outline">
            Cómo colaborar
          </a>
        </div>
      </section>
    </div>
  );
}
