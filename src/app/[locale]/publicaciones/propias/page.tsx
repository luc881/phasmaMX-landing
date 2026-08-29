import { setRequestLocale } from "next-intl/server";
import { FileText } from "lucide-react";
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
    title: locale === "en" ? "Our publications — Phasma MX" : "Publicaciones propias — Phasma MX",
    description:
      locale === "en"
        ? "Original work published by the Phasma MX team."
        : "Trabajo original publicado por el equipo de Phasma MX.",
  };
}

export default async function PublicacionesPropiasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={FileText}
      eyebrow={es ? "Publicaciones · Phasma MX" : "Publications · Phasma MX"}
      title={es ? "Publicaciones propias" : "Our publications"}
      body={
        es
          ? [
              "El trabajo original del proyecto: notas de distribución, registros nuevos para México y descripciones, conforme se vayan publicando y con su cita formal.",
              "Aún no hay material publicado en esta sección. Se abrirá con la primera nota que salga a revisión.",
            ]
          : [
              "The project original work: distribution notes, new records for Mexico and descriptions, as they are published and with their formal citation.",
              "Nothing is published in this section yet. It opens with the first note that goes out for review.",
            ]
      }
      links={[
        {
          href: "/publicaciones/phasmida-de-mexico",
          label: es ? "Bibliografía" : "Bibliography",
          desc: es ? "Phasmida de México" : "Phasmida of Mexico",
        },
        {
          href: "/articulos",
          label: es ? "Artículos" : "Articles",
          desc: es ? "Divulgación del archivo" : "Outreach from the archive",
        },
      ]}
    />
  );
}
