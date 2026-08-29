import { setRequestLocale } from "next-intl/server";
import { Egg } from "lucide-react";
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
    title: locale === "en" ? "Incubation — Phasma MX" : "Incubación — Phasma MX",
    description:
      locale === "en"
        ? "Substrate, humidity and hatching times for eggs."
        : "Sustrato, humedad y tiempos de eclosión de los huevos.",
  };
}

export default async function IncubacionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Egg}
      eyebrow={es ? "Crianza · Paso 4 de 4" : "Breeding · Step 4 of 4"}
      title={es ? "Incubación" : "Incubation"}
      body={
        es
          ? [
              "Los huevos se separan del sustrato del terrario y se incuban aparte, sobre vermiculita o papel apenas húmedo, en un recipiente con algo de ventilación. Demasiada agua los pudre; demasiado seca los colapsa.",
              "Los tiempos varían muchísimo entre especies: de dos meses a más de un año. Un huevo que no ha eclosionado no es un huevo muerto, y conviene no descartar una tanda antes de tiempo.",
              "Esta sección está en desarrollo.",
            ]
          : [
              "Eggs are separated from the terrarium substrate and incubated apart, on vermiculite or barely damp paper, in a container with some ventilation. Too much water rots them; too dry collapses them.",
              "Timings vary enormously between species: from two months to over a year. An egg that has not hatched is not a dead egg, and it pays not to discard a batch too early.",
              "This section is in development.",
            ]
      }
      links={[
        {
          href: "/crianza",
          label: es ? "Crianza" : "Breeding",
          desc: es ? "Volver al índice de la guía" : "Back to the guide index",
        },
        {
          href: "/contacto",
          label: es ? "Contacto" : "Contact",
          desc: es ? "Compartir datos de cultivo" : "Share your culture data",
        },
      ]}
    />
  );
}
