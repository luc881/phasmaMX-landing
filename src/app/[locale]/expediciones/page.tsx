import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Compass } from "lucide-react";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Expeditions — Phasma MX" : "Expediciones — Phasma MX",
    description:
      locale === "en"
        ? "Field expeditions of the Phasma MX team. Coming soon."
        : "Expediciones de campo del equipo Phasma MX. Próximamente.",
  };
}

export default async function ExpedicionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <div className="min-h-screen flex items-center">
      <div className="container-site py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Decorative icon */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="w-32 h-32 border border-border flex items-center justify-center">
              <Compass size={48} strokeWidth={0.75} className="text-gold opacity-60" />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
              Phasma MX · {es ? "En desarrollo" : "In development"}
            </p>

            <div className="h-px bg-gold w-16 mb-8" />

            <h1 className="font-display text-display-lg font-light text-text1 mb-6">
              {es ? "Expediciones" : "Expeditions"}
            </h1>

            <p className="font-sans text-body-lg text-text2 leading-relaxed max-w-xl mb-4">
              {es
                ? "Esta sección documentará las expediciones de campo del equipo Phasma MX: rutas, registros fotográficos, hallazgos y datos de colecta en tiempo real."
                : "This section will document Phasma MX field expeditions: routes, photographic records, findings and collection data in real time."}
            </p>
            <p className="font-sans text-body-md text-text2 leading-relaxed max-w-xl mb-12">
              {es
                ? "Mientras tanto, los registros de expediciones previas están integrados en las fichas de cada especie."
                : "In the meantime, previous expedition records are integrated into each species sheet."}
            </p>

            {/* Links */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/especies"
                className="flex items-center gap-3 border border-border px-6 py-4 hover:border-gold hover:bg-surface transition-all duration-300 group"
              >
                <div>
                  <p className="font-mono text-caption text-gold uppercase tracking-widest mb-0.5">
                    {es ? "Catálogo" : "Catalog"}
                  </p>
                  <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                    {es ? "Ver las especies documentadas" : "Browse documented species"}
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0 ml-auto" />
              </Link>

              <Link
                href="/articulos"
                className="flex items-center gap-3 border border-border px-6 py-4 hover:border-gold hover:bg-surface transition-all duration-300 group"
              >
                <div>
                  <p className="font-mono text-caption text-gold uppercase tracking-widest mb-0.5">
                    {es ? "Artículos" : "Articles"}
                  </p>
                  <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                    {es ? "Leer reportes de expedición" : "Read expedition reports"}
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0 ml-auto" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
