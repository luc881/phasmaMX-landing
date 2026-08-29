import { setRequestLocale } from "next-intl/server";
import { BookOpen } from "lucide-react";
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
    title:
      locale === "en" ? "Publications — Phasma MX" : "Publicaciones — Phasma MX",
    description:
      locale === "en"
        ? "Scientific literature on Phasmatodea of Mexico, and original work from the Phasma MX team."
        : "Literatura científica sobre Phasmatodea de México y trabajo original del equipo de Phasma MX.",
  };
}

export default async function PublicacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={BookOpen}
      eyebrow={
        es ? "Phasma MX · Literatura científica" : "Phasma MX · Scientific literature"
      }
      title={es ? "Publicaciones" : "Publications"}
      body={
        es
          ? [
              "Dos cuerpos distintos de trabajo. Por un lado, la bibliografía que ya existe sobre los fásmidos de México, reunida y citada. Por otro, lo que publique el propio equipo conforme salga a revisión.",
              "La divulgación en formato de artículo vive aparte, en el archivo de artículos.",
            ]
          : [
              "Two distinct bodies of work. On one side, the existing literature on the phasmids of Mexico, gathered and cited. On the other, what the team itself publishes as it goes out for review.",
              "Outreach in article form lives separately, in the article archive.",
            ]
      }
      links={[
        {
          href: "/publicaciones/phasmida-de-mexico",
          label: es ? "Bibliografía" : "Bibliography",
          desc: es ? "Phasmida de México" : "Phasmida of Mexico",
        },
        {
          href: "/publicaciones/propias",
          label: es ? "Propias" : "Our own",
          desc: es ? "Trabajo del equipo" : "Work from the team",
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
