import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import FeaturedSpecies from "@/components/sections/FeaturedSpecies";
import PhasmidsIntro from "@/components/sections/PhasmidsIntro";
import LatestArticles from "@/components/sections/LatestArticles";
import DistributionMap from "@/components/sections/DistributionMap";
import CatalogCTA from "@/components/sections/CatalogCTA";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturedSpecies />
      <PhasmidsIntro />
      <LatestArticles />
      <DistributionMap />
      <CatalogCTA />
    </>
  );
}
