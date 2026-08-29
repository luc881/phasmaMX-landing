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
    title: locale === "en" ? "Events — Phasma MX" : "Eventos — Phasma MX",
    description:
      locale === "en"
        ? "Photographic record of meetups, fairs and field outings."
        : "Registro fotográfico de encuentros, ferias y salidas de campo.",
  };
}

export default async function FotografiasEventosPage({
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
      eyebrow={es ? "Fotografías · Encuentros" : "Photography · Meetups"}
      title={es ? "Eventos" : "Events"}
      body={
        es
          ? [
              "El registro visual de ferias, charlas y salidas de campo del proyecto. Se publica después de cada evento, junto con la lista de especies observadas cuando la salida fue de campo.",
              "Esta sección está en desarrollo.",
            ]
          : [
              "The visual record of the project fairs, talks and field outings. Published after each event, together with the list of species observed when the outing was in the field.",
              "This section is in development.",
            ]
      }
      links={[
        {
          href: "/eventos",
          label: es ? "Eventos" : "Events",
          desc: es ? "Ver la agenda" : "See the calendar",
        },
        {
          href: "/expediciones",
          label: es ? "Expediciones" : "Expeditions",
          desc: es ? "Salidas de campo del equipo" : "Field outings by the team",
        },
      ]}
    />
  );
}
