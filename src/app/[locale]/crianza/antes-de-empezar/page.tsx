import { setRequestLocale } from "next-intl/server";
import { ClipboardCheck } from "lucide-react";
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
    title: locale === "en" ? "Before you start — Phasma MX" : "Antes de empezar — Phasma MX",
    description:
      locale === "en"
        ? "What to weigh up before getting your first phasmid."
        : "Qué evaluar antes de conseguir el primer fásmido.",
  };
}

export default async function AntesDeEmpezarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={ClipboardCheck}
      eyebrow={es ? "Crianza · Paso 1 de 4" : "Breeding · Step 1 of 4"}
      title={es ? "Antes de empezar" : "Before you start"}
      body={
        es
          ? [
              "Antes del primer ejemplar hay cuatro cosas que resolver: la situación legal de la especie, el espacio y el tiempo que exige, si tendrás planta hospedera fresca durante todo el año, y qué harás con la descendencia.",
              "La mayoría de los cultivos que fracasan lo hacen por quedarse sin alimento en invierno, no por falta de cuidados. Conviene elegir una especie cuya planta hospedera crezca cerca y en tu clima.",
              "Esta sección está en desarrollo. Mientras tanto, las fichas del catálogo indican planta hospedera, hábitat y notas de cría de cada especie.",
            ]
          : [
              "Four things to settle before your first specimen: the legal status of the species, the space and time it demands, whether you will have fresh host plant year round, and what you will do with the offspring.",
              "Most cultures that fail run out of food in winter rather than out of care. Pick a species whose host plant grows nearby and in your climate.",
              "This section is in development. In the meantime, the catalog sheets list host plant, habitat and breeding notes for each species.",
            ]
      }
      links={[
        {
          href: "/crianza/el-terrario",
          label: es ? "Paso 2" : "Step 2",
          desc: es ? "El terrario" : "The terrarium",
        },
        {
          href: "/especies",
          label: es ? "Catálogo" : "Catalog",
          desc: es ? "Ver notas de cría por especie" : "Breeding notes by species",
        },
      ]}
    />
  );
}
