import { setRequestLocale } from "next-intl/server";
import { BookMarked } from "lucide-react";
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
    title: locale === "en" ? "Phasmida of Mexico — Phasma MX" : "Phasmida de México — Phasma MX",
    description:
      locale === "en"
        ? "Bibliography on Phasmatodea of Mexico: descriptions, revisions and checklists."
        : "Bibliografía sobre Phasmatodea de México: descripciones, revisiones y listados.",
  };
}

export default async function PhasmidaDeMexicoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={BookMarked}
      eyebrow={es ? "Publicaciones · Bibliografía" : "Publications · Bibliography"}
      title={es ? "Phasmida de México" : "Phasmida of Mexico"}
      body={
        es
          ? [
              "La bibliografía existente sobre los fásmidos de México: descripciones originales, revisiones de género, listados estatales y notas de distribución, con su referencia completa y el enlace al documento cuando es de acceso abierto.",
              "El objetivo es que quien empiece a trabajar con un género mexicano encuentre en un solo lugar lo que ya se publicó sobre él.",
              "Esta sección está en desarrollo.",
            ]
          : [
              "The existing literature on the phasmids of Mexico: original descriptions, genus revisions, state checklists and distribution notes, with full references and a link to the document where it is open access.",
              "The aim is that anyone starting work on a Mexican genus finds in one place what has already been published about it.",
              "This section is in development.",
            ]
      }
      links={[
        {
          href: "/especies",
          label: es ? "Catálogo" : "Catalog",
          desc: es ? "Referencias por especie" : "References by species",
        },
        {
          href: "/publicaciones/propias",
          label: es ? "Propias" : "Our own",
          desc: es ? "Publicaciones del proyecto" : "Work from the project",
        },
      ]}
    />
  );
}
