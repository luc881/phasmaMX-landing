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
import { PLACEHOLDER_SPECIES } from "@/lib/placeholder/species";
import { PLACEHOLDER_ARTICLES, formatDate } from "@/lib/placeholder/articles";
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

  // Las reglas separadoras dicen algo que su sección no repite: el pulso del
  // archivo, la fecha real del último ingreso y la cobertura total.
  const lastEntry = PLACEHOLDER_ARTICLES.reduce((a, b) =>
    a.publishedAt > b.publishedAt ? a : b
  ).publishedAt;

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
            species: PLACEHOLDER_SPECIES.length,
            articles: PLACEHOLDER_ARTICLES.length,
          })}
        />
      </div>

      <FeaturedSpecies />
      <TaxonMarquee />
      <PhasmidsIntro />

      <SectionRule
        label={t("rule_updated_label")}
        value={formatDate(lastEntry, locale)}
      />

      <LatestArticles />

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
