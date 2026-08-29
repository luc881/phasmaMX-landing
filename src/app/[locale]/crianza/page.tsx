import { setRequestLocale } from "next-intl/server";
import { Sprout } from "lucide-react";
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
    title: locale === "en" ? "Breeding — Phasma MX" : "Crianza — Phasma MX",
    description:
      locale === "en"
        ? "Guide to breeding phasmids in captivity: terrarium, feeding and incubation."
        : "Guía de cría de fásmidos en cautiverio: terrario, alimentación e incubación.",
  };
}

export default async function CrianzaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const es = locale !== "en";

  return (
    <SectionPage
      icon={Sprout}
      eyebrow={es ? "Phasma MX · Guía práctica" : "Phasma MX · Practical guide"}
      title={es ? "Crianza" : "Breeding"}
      body={
        es
          ? [
              "Mantener fásmidos en cautiverio se decide antes de conseguir el primer ejemplar. Esta guía recorre en orden lo que hay que resolver: qué evaluar antes de empezar, cómo montar el terrario, qué comen y cómo incubar los huevos.",
              "Los apartados se publican por separado y se amplían con datos de cultivo propios conforme el archivo crece.",
            ]
          : [
              "Keeping phasmids in captivity is decided before the first specimen arrives. This guide walks through what to settle, in order: what to weigh up before starting, how to set up the terrarium, what they eat and how to incubate the eggs.",
              "The sections are published separately and grow with our own culture data as the archive expands.",
            ]
      }
      links={[
        {
          href: "/crianza/antes-de-empezar",
          label: es ? "Paso 1" : "Step 1",
          desc: es ? "Antes de empezar" : "Before you start",
        },
        {
          href: "/crianza/el-terrario",
          label: es ? "Paso 2" : "Step 2",
          desc: es ? "El terrario" : "The terrarium",
        },
        {
          href: "/crianza/alimentacion",
          label: es ? "Paso 3" : "Step 3",
          desc: es ? "Alimentación" : "Feeding",
        },
        {
          href: "/crianza/incubacion",
          label: es ? "Paso 4" : "Step 4",
          desc: es ? "Incubación" : "Incubation",
        },
      ]}
    />
  );
}
