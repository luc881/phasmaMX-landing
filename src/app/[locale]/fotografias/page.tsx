import { setRequestLocale } from "next-intl/server";
import { Camera } from "lucide-react";
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
    title: locale === "en" ? "Photography — Phasma MX" : "Fotografías — Phasma MX",
    description:
      locale === "en"
        ? "Photographic archive of phasmids and of the project events."
        : "Archivo fotográfico de fásmidos y de los eventos del proyecto.",
  };
}

export default async function FotografiasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Camera}
      eyebrow={es ? "Phasma MX · Archivo visual" : "Phasma MX · Visual archive"}
      title={es ? "Fotografías" : "Photography"}
      body={
        es
          ? [
              "El archivo visual se divide en dos: la fotografía de espécimen, que documenta morfología y sirve de referencia para el catálogo, y el registro de los encuentros y salidas del proyecto.",
              "Toda imagen lleva su crédito y, cuando existe, la localidad y la fecha de captura.",
            ]
          : [
              "The visual archive splits in two: specimen photography, which documents morphology and backs the catalog, and the record of the project meetups and outings.",
              "Every image carries its credit and, where available, the locality and date of capture.",
            ]
      }
      links={[
        {
          href: "/fotografias/insectos",
          label: es ? "Insectos" : "Insects",
          desc: es ? "Fotografía de espécimen" : "Specimen photography",
        },
        {
          href: "/fotografias/eventos",
          label: es ? "Eventos" : "Events",
          desc: es ? "Encuentros y salidas" : "Meetups and outings",
        },
      ]}
    />
  );
}
