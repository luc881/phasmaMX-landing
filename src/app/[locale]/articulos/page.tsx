import { setRequestLocale, getTranslations } from "next-intl/server";
import ArticlesGrid from "@/components/articles/ArticlesGrid";
import { getArticlesIndex } from "@/lib/content/articles";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles_page" });
  return {
    title: `${t("title_start")}${t("title_em")} — Phasma MX`,
    description: t("description"),
  };
}

export default async function ArticulosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "articles_page" });

  const articles = await getArticlesIndex();

  // Derivadas del contenido publicado, como en /especies: evita cifras
  // hardcodeadas ("10+", "6", "4") que se desincronizan del catálogo real.
  const categoryCount = new Set(articles.map((a) => a.category)).size;
  const authorCount = new Set(articles.map((a) => a.author?.name).filter(Boolean)).size;

  return (
    <div className="min-h-screen">
      {/* ── Page header ── */}
      <header className="border-b border-border">
        <div className="container-site pt-32 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
                {t("label")}
              </p>
              <h1 className="font-display text-display-lg font-light text-text1 mb-5">
                {t("title_start")}
                <em className="italic text-gold" style={{ fontStyle: "italic" }}>
                  {t("title_em")}
                </em>
              </h1>
              <p className="font-sans text-body-lg text-text2 leading-relaxed max-w-xl">
                {t("description")}
              </p>
            </div>

            {/* Stat blocks */}
            <div className="lg:col-span-5 flex flex-wrap gap-8 lg:justify-end">
              {[
                [String(articles.length), t("stat_articles")],
                [String(categoryCount), t("stat_categories")],
                [String(authorCount), t("stat_authors")],
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
      <ArticlesGrid articles={articles} />
    </div>
  );
}
