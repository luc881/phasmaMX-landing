import { setRequestLocale } from "next-intl/server";
import ArticlesGrid from "@/components/articles/ArticlesGrid";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export const metadata = {
  title: "Artículos — Phasma MX",
  description: "Expediciones, taxonomía, divulgación y terrariofilia sobre Phasmatodea en México y América Latina.",
};

export default async function ArticulosPage({
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
        <div className="container-site pt-32 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
                Phasma MX · Publicaciones y divulgación
              </p>
              <h1 className="font-display text-display-lg font-light text-text1 mb-5">
                Ar
                <em className="italic text-gold" style={{ fontStyle: "italic" }}>
                  tículos
                </em>
              </h1>
              <p className="font-sans text-body-lg text-text2 leading-relaxed max-w-xl">
                Expediciones de campo, revisiones taxonómicas, perfiles de especie y guías
                de cría. Una ventana al trabajo científico y la divulgación sobre
                Phasmatodea en México y América Latina.
              </p>
            </div>

            {/* Stat blocks */}
            <div className="lg:col-span-5 flex flex-wrap gap-8 lg:justify-end">
              {[
                ["10+", "Artículos"],
                ["6", "Categorías"],
                ["4", "Autores"],
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

      {/* ── Articles grid with filter tabs ── */}
      <ArticlesGrid />
    </div>
  );
}
