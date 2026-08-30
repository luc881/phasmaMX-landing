import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import FeaturedSpecies from "@/components/sections/FeaturedSpecies";
import PhasmidsIntro from "@/components/sections/PhasmidsIntro";
import LatestArticles from "@/components/sections/LatestArticles";
import DistributionMap from "@/components/sections/DistributionMap";
import CatalogCTA from "@/components/sections/CatalogCTA";
import SectionRule from "@/components/ui/SectionRule";
import TaxonMarquee from "@/components/ui/TaxonMarquee";
import { getFeaturedSpecies, getSpeciesCatalog } from "@/lib/content/species";
import { getArticlesIndex, getLatestArticles } from "@/lib/content/articles";
import { formatDate } from "@/lib/placeholder/articles";
import { MEXICO_STATES_WITH_RECORDS } from "@/lib/placeholder/distribution";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sections");

  const [featuredSpecies, catalog, latestArticles, articlesIndex] = await Promise.all([
    getFeaturedSpecies(),
    getSpeciesCatalog(),
    getLatestArticles(),
    getArticlesIndex(),
  ]);

  // Ninguna especie tiene `featured` marcado todavía: el contenido se cargó
  // desde el placeholder, que no tenía ese concepto. Sin este fallback la
  // sección quedaría en blanco, así que cae al catálogo recortado.
  const featured = featuredSpecies.length > 0 ? featuredSpecies : catalog.slice(0, 6);

  // Las reglas separadoras dicen algo que su sección no repite: el pulso del
  // archivo, la fecha real del último ingreso y la cobertura total.
  // `latestArticles` ya viene ordenado por fecha desc, así el primero es el más reciente.
  const lastEntry = latestArticles[0]?.publishedAt ?? new Date().toISOString();

  const totalRecords = MEXICO_STATES_WITH_RECORDS.reduce(
    (sum, state) => sum + state.count,
    0
  );

  return (
    <>
      <Hero />

      <div className="pt-16 lg:pt-20">
        <SectionRule
          label={t("archive_label")}
          value={t("archive_count", {
            species: catalog.length,
            articles: articlesIndex.length,
          })}
        />
      </div>

      <FeaturedSpecies species={featured} />
      <TaxonMarquee species={catalog} />
      <PhasmidsIntro />

      <SectionRule
        label={t("rule_updated_label")}
        value={formatDate(lastEntry, locale)}
      />

      <LatestArticles articles={latestArticles} />

      <SectionRule
        label={t("rule_coverage_label")}
        value={t("rule_coverage_value", {
          states: MEXICO_STATES_WITH_RECORDS.length,
          records: totalRecords,
        })}
      />

      <DistributionMap />
      <CatalogCTA />
    </>
  );
}
