import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return {
    title: `${t("title_start")} ${t("title_em")} — Phasma MX`,
    description: t("description"),
  };
}

export default async function EspeciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "catalog" });

  return (
    <div className="min-h-screen">
      {/* ── Page header ── */}
      <header className="border-b border-border">
        <div className="container-site pt-32 pb-16">
          <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
            {t("label")}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="font-display text-display-lg font-light text-text1 mb-4">
                {t("title_start")}{" "}
                <em className="italic text-gold" style={{ fontStyle: "italic" }}>
                  {t("title_em")}
                </em>
              </h1>
              <p className="font-sans text-body-lg text-text2 max-w-2xl leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 shrink-0">
              {[
                ["240+", t("stat_species")],
                ["120+", t("stat_native")],
                ["6", t("stat_families")],
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
            {t("contribute_label")}
          </p>
          <h2 className="font-display text-display-sm font-light text-text1 mb-6">
            {t("contribute_title")}
          </h2>
          <p className="font-sans text-body-md text-text2 max-w-lg mx-auto mb-8">
            {t("contribute_body")}
          </p>
          <Link href="/colaborar" className="btn-outline">
            {t("contribute_btn")}
          </Link>
        </div>
      </section>
    </div>
  );
}
