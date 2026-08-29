import { setRequestLocale } from "next-intl/server";
import { CalendarDays } from "lucide-react";
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
        ? "Meetups, fairs and field outings from Phasma MX."
        : "Encuentros, ferias y salidas de campo de Phasma MX.",
  };
}

export default async function EventosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={CalendarDays}
      eyebrow={es ? "Phasma MX · Agenda" : "Phasma MX · Calendar"}
      title={es ? "Eventos" : "Events"}
      body={
        es
          ? [
              "Encuentros, ferias de entomología, charlas y salidas de campo donde Phasma MX participa o convoca. La agenda abre en cuanto se confirmen las primeras fechas.",
              "Cada evento pasado deja su registro fotográfico y, cuando aplica, los datos de colecta que alimentaron el catálogo.",
            ]
          : [
              "Meetups, entomology fairs, talks and field outings where Phasma MX takes part or convenes. The calendar opens as soon as the first dates are confirmed.",
              "Every past event leaves behind its photographic record and, where relevant, the collection data that fed the catalog.",
            ]
      }
      links={[
        {
          href: "/expediciones",
          label: es ? "Expediciones" : "Expeditions",
          desc: es ? "Salidas de campo del equipo" : "Field outings by the team",
        },
        {
          href: "/fotografias/eventos",
          label: es ? "Fotografías" : "Photography",
          desc: es ? "Registro visual de los encuentros" : "Visual record of the meetups",
        },
        {
          href: "/contacto",
          label: es ? "Contacto" : "Contact",
          desc: es ? "Proponer un evento" : "Propose an event",
        },
      ]}
    />
  );
}
