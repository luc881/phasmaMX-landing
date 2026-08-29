import { setRequestLocale } from "next-intl/server";
import { Handshake } from "lucide-react";
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
    title: locale === "en" ? "Collaborate — Phasma MX" : "Colaborar — Phasma MX",
    description:
      locale === "en"
        ? "How to contribute to the Phasma MX archive."
        : "Cómo contribuir al archivo de Phasma MX.",
  };
}

export default async function ColaborarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Handshake}
      eyebrow={es ? "Phasma MX · Contribuir" : "Phasma MX · Contribute"}
      title={es ? "Colaborar" : "Collaborate"}
      body={
        es
          ? [
              "El archivo crece con cada registro. Sirven fotografías de campo con localidad y fecha, datos de cultivo de una especie, referencias bibliográficas que falten, correcciones taxonómicas y traducciones.",
              "Todo aporte se acredita a su autor en la ficha donde aparece.",
            ]
          : [
              "The archive grows with every record. Useful contributions include field photographs with locality and date, culture data for a species, missing bibliographic references, taxonomic corrections and translations.",
              "Every contribution is credited to its author on the sheet where it appears.",
            ]
      }
      links={[
        {
          href: "/contacto",
          label: es ? "Contacto" : "Contact",
          desc: es ? "Escribir al equipo" : "Write to the team",
        },
        {
          href: "/especies",
          label: es ? "Catálogo" : "Catalog",
          desc: es ? "Ver qué está documentado" : "See what is documented",
        },
      ]}
    />
  );
}
