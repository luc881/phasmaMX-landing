import { setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
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
    title: locale === "en" ? "Contact — Phasma MX" : "Contacto — Phasma MX",
    description:
      locale === "en"
        ? "How to reach the Phasma MX team."
        : "Cómo contactar al equipo de Phasma MX.",
  };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Mail}
      eyebrow={es ? "Phasma MX · Escríbenos" : "Phasma MX · Get in touch"}
      title={es ? "Contacto" : "Contact"}
      body={
        es
          ? [
              "Escríbenos si tienes registros fotográficos, datos de campo o una publicación que deba entrar al archivo; si quieres proponer un evento; o si detectaste un error en una ficha. No hace falta ser investigador: cualquier observación documentada tiene valor.",
              "Los canales de contacto se publican aquí en cuanto queden definidos.",
            ]
          : [
              "Write to us if you have photographic records, field data or a publication that belongs in the archive; if you want to propose an event; or if you spotted an error in a sheet. You do not need to be a researcher: any documented observation has value.",
              "Contact channels will be published here as soon as they are settled.",
            ]
      }
      links={[
        {
          href: "/colaborar",
          label: es ? "Colaborar" : "Collaborate",
          desc: es ? "Formas de contribuir al archivo" : "Ways to contribute to the archive",
        },
        {
          href: "/acerca-de",
          label: es ? "Acerca de" : "About",
          desc: es ? "Quién está detrás del proyecto" : "Who is behind the project",
        },
      ]}
    />
  );
}
