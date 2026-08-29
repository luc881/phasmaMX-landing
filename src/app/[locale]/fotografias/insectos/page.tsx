import { setRequestLocale } from "next-intl/server";
import { Bug } from "lucide-react";
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
    title: locale === "en" ? "Insects — Phasma MX" : "Insectos — Phasma MX",
    description:
      locale === "en"
        ? "Specimen photography of Mexican and exotic phasmids."
        : "Fotografía de espécimen de fásmidos mexicanos y exóticos.",
  };
}

export default async function FotografiasInsectosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Bug}
      eyebrow={es ? "Fotografías · Espécimen" : "Photography · Specimen"}
      title={es ? "Insectos" : "Insects"}
      body={
        es
          ? [
              "Fotografía de espécimen: cuerpo completo, detalle de alas, cabeza y estructuras de la genitalia cuando el carácter es diagnóstico. La galería reunirá el material que hoy vive repartido en las fichas del catálogo.",
              "Esta sección está en desarrollo.",
            ]
          : [
              "Specimen photography: full body, wing detail, head and genitalia structures where the character is diagnostic. The gallery will gather material that today lives scattered across the catalog sheets.",
              "This section is in development.",
            ]
      }
      links={[
        {
          href: "/especies",
          label: es ? "Catálogo" : "Catalog",
          desc: es ? "Ver las fichas con galería" : "Species sheets with gallery",
        },
        {
          href: "/fotografias/eventos",
          label: es ? "Eventos" : "Events",
          desc: es ? "Registro de encuentros" : "Record of the meetups",
        },
      ]}
    />
  );
}
