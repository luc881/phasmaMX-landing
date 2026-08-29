import { setRequestLocale } from "next-intl/server";
import { Box } from "lucide-react";
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
    title: locale === "en" ? "The terrarium — Phasma MX" : "El terrario — Phasma MX",
    description:
      locale === "en"
        ? "Height, ventilation, humidity and substrate for phasmids."
        : "Altura, ventilación, humedad y sustrato para fásmidos.",
  };
}

export default async function ElTerrarioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Box}
      eyebrow={es ? "Crianza · Paso 2 de 4" : "Breeding · Step 2 of 4"}
      title={es ? "El terrario" : "The terrarium"}
      body={
        es
          ? [
              "La altura importa más que el volumen. Un fásmido cuelga para mudar y necesita al menos tres veces su longitud de espacio libre por debajo del punto de agarre; si no lo tiene, la muda sale deformada y suele costarle una pata.",
              "El otro factor crítico es la ventilación cruzada: malla en la tapa y en al menos un costado. Un terrario de vidrio cerrado acumula condensación y con ella hongos, que matan más colonias que cualquier depredador.",
              "Esta sección está en desarrollo.",
            ]
          : [
              "Height matters more than volume. A phasmid hangs to molt and needs at least three times its body length of clear space below the grip point; without it the molt comes out deformed and usually costs the animal a leg.",
              "The other critical factor is cross ventilation: mesh on the lid and on at least one side. A sealed glass terrarium builds up condensation and with it fungus, which kills more colonies than any predator.",
              "This section is in development.",
            ]
      }
      links={[
        {
          href: "/crianza/alimentacion",
          label: es ? "Paso 3" : "Step 3",
          desc: es ? "Alimentación" : "Feeding",
        },
        {
          href: "/crianza/antes-de-empezar",
          label: es ? "Paso 1" : "Step 1",
          desc: es ? "Antes de empezar" : "Before you start",
        },
      ]}
    />
  );
}
