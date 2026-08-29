import { setRequestLocale } from "next-intl/server";
import { Leaf } from "lucide-react";
import SectionPage from "@/components/ui/SectionPage";

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
    title: locale === "en" ? "Feeding — Phasma MX" : "Alimentación — Phasma MX",
    description:
      locale === "en"
        ? "Host plants and how to keep the cutting fresh."
        : "Plantas hospederas y cómo mantener el ramo fresco.",
  };
}

export default async function AlimentacionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Leaf}
      eyebrow={es ? "Crianza · Paso 3 de 4" : "Breeding · Step 3 of 4"}
      title={es ? "Alimentación" : "Feeding"}
      body={
        es
          ? [
              "Casi ninguna especie acepta una planta que no sea la suya. Zarzamora, roble, eucalipto y guayaba cubren buena parte de las especies en cultivo, pero la lista correcta es siempre la de la ficha de la especie.",
              "El ramo se mantiene en agua con la boca del frasco tapada, para que ninguna ninfa caiga dentro y se ahogue. Nunca uses follaje de plantas fumigadas ni de la orilla de una carretera: los residuos de insecticida matan una colonia entera en días.",
              "Esta sección está en desarrollo.",
            ]
          : [
              "Almost no species accepts a plant other than its own. Bramble, oak, eucalyptus and guava cover a good share of the species in culture, but the correct list is always the one on the species sheet.",
              "Keep the cutting in water with the jar mouth covered, so no nymph falls in and drowns. Never use foliage from sprayed plants or from a roadside: insecticide residue kills an entire colony in days.",
              "This section is in development.",
            ]
      }
      links={[
        {
          href: "/crianza/incubacion",
          label: es ? "Paso 4" : "Step 4",
          desc: es ? "Incubación" : "Incubation",
        },
        {
          href: "/especies",
          label: es ? "Catálogo" : "Catalog",
          desc: es ? "Plantas hospederas por especie" : "Host plants by species",
        },
      ]}
    />
  );
}
