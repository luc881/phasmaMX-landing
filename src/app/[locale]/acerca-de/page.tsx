import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Mail, Globe, BookOpen } from "lucide-react";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("hero_label")} — Phasma MX`,
    description: t("hero_body").slice(0, 155),
  };
}

const TEAM = [
  {
    name: "Dr. Martín Vidal",
    role: "Investigador principal",
    initials: "MV",
    institution: "Instituto de Biología, UNAM",
    bio: "Entomólogo especialista en Phasmatodea neotropicales. Doctorado en Sistemática Animal por la UNAM. Ha descrito 4 especies nuevas para la ciencia y liderado 18 expediciones de campo en México y Centroamérica.",
    orcid: "0000-0000-0000-0001",
    social: { twitter: "@martinvidal_ent", website: "#" },
  },
  {
    name: "Lucía Herrera",
    role: "Editora científica",
    initials: "LH",
    institution: "Freelance · Ciudad de México",
    bio: "Bióloga de formación y comunicadora científica de profesión. Especializada en entomología de divulgación. Editora de contenidos del archivo desde 2022.",
    orcid: null,
    social: { twitter: "@luciaherrera_bio", website: "#" },
  },
  {
    name: "Carlos Mendoza",
    role: "Biólogo de campo",
    initials: "CM",
    institution: "Universidad Veracruzana",
    bio: "Maestro en Ecología Tropical por la Universidad Veracruzana. Responsable de las expediciones nocturnas en la Sierra de los Tuxtlas y coordinador de la red de observadores en el sureste mexicano.",
    orcid: "0000-0000-0000-0002",
    social: { twitter: null, website: "#" },
  },
  {
    name: "Sofía Ramírez",
    role: "Especialista en terrariofilia",
    initials: "SR",
    institution: "Colaboradora externa",
    bio: "Criadora con 12 años de experiencia en fásmidos. Mantiene una de las colecciones vivas más diversas de México, con más de 40 especies. Responsable de las guías de cría del archivo.",
    orcid: null,
    social: { twitter: "@sofiaramirez_ph", website: "#" },
  },
];

const TIMELINE = [
  { year: "2020", event: "Fundación del proyecto como base de datos personal de M. Vidal." },
  { year: "2021", event: "Primera versión pública del catálogo con 38 especies documentadas." },
  { year: "2022", event: "Incorporación del equipo editorial y lanzamiento de los artículos de divulgación." },
  { year: "2023", event: "Inicio de las expediciones sistemáticas en la Sierra de los Tuxtlas. Primer registro de Bacteria ploiaria en Veracruz." },
  { year: "2024", event: "Rediseño del archivo y lanzamiento de la plataforma actual con mapa de distribución interactivo." },
];

export default async function AcercaDePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tPhasmids = await getTranslations({ locale, namespace: "phasmids" });

  const PRINCIPLES = [
    { title: t("principle_1_title"), desc: t("principle_1_desc") },
    { title: t("principle_2_title"), desc: t("principle_2_desc") },
    { title: t("principle_3_title"), desc: t("principle_3_desc") },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #C8B97A 0px, #C8B97A 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #C8B97A 0px, #C8B97A 1px, transparent 1px, transparent 60px)",
          }}
        />

        <div className="container-site pt-36 pb-24 relative z-10">
          <div className="max-w-4xl">
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
              {t("hero_label")}
            </p>
            <h1 className="font-display text-display-lg font-light text-text1 mb-8 leading-none">
              {t("hero_title_start")}{" "}
              <em className="italic text-gold" style={{ fontStyle: "italic" }}>
                {t("hero_title_em")}
              </em>
            </h1>
            <p className="font-sans text-body-xl text-text2 leading-relaxed max-w-2xl">
              {t("hero_body")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission + Numbers ── */}
      <section className="border-b border-border">
        <div className="container-site py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Mission text */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
                  {t("mission_label")}
                </p>
                <p className="font-sans text-body-lg text-text2 leading-relaxed mb-6">
                  {t("mission_body_1")}
                </p>
                <p className="font-sans text-body-md text-text2 leading-relaxed">
                  {t("mission_body_2")}
                </p>
              </div>

              <blockquote className="pull-quote">
                {tPhasmids("pull_quote")}
              </blockquote>

              <div>
                <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
                  {t("principles_label")}
                </p>
                <div className="space-y-4">
                  {PRINCIPLES.map(({ title, desc }) => (
                    <div key={title} className="flex gap-5 p-5 border border-border bg-surface">
                      <div className="w-1 bg-gold shrink-0 self-stretch" />
                      <div>
                        <p className="font-mono text-caption text-gold uppercase tracking-widest mb-1">
                          {title}
                        </p>
                        <p className="font-sans text-body-md text-text2 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-5 space-y-px border border-border">
              {[
                ["127+", "Especies registradas"],
                ["18", "Expediciones de campo"],
                ["4", "Investigadores activos"],
                ["10+", "Artículos publicados"],
                ["2020", "Año de fundación"],
                ["32", "Estados de México cubiertos"],
              ].map(([val, label]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between px-6 py-5 bg-surface border-b border-border last:border-b-0"
                >
                  <span className="font-mono text-caption text-text3 uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="font-display text-display-sm font-light text-gold">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="border-b border-border">
        <div className="container-site py-20">
          <div className="flex items-end justify-between mb-14 gap-8">
            <div>
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
                {t("team_label")}
              </p>
              <h2 className="font-display text-display-md font-light text-text1">
                {t("team_title")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-void p-8 group">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-gold transition-colors duration-400">
                    <span className="font-display text-display-sm font-light text-gold">
                      {member.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-display-sm font-light text-text1 leading-tight">
                      {member.name}
                    </h3>
                    <p className="font-mono text-caption text-gold uppercase tracking-widest mt-1">
                      {member.role}
                    </p>
                    <p className="font-mono text-caption text-text3 mt-1">
                      {member.institution}
                    </p>
                  </div>
                </div>

                <p className="font-sans text-body-md text-text2 leading-relaxed mb-5">
                  {member.bio}
                </p>

                <div className="flex items-center gap-4">
                  {member.orcid && (
                    <a
                      href={`https://orcid.org/${member.orcid}`}
                      className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-300 flex items-center gap-1.5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen size={11} />
                      {t("team_orcid")}
                    </a>
                  )}
                  {member.social.twitter && (
                    <span className="font-mono text-caption text-text3">
                      {member.social.twitter}
                    </span>
                  )}
                  {member.social.website && (
                    <a
                      href={member.social.website}
                      className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-300 flex items-center gap-1.5"
                    >
                      <Globe size={11} />
                      {t("team_profile")}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="border-b border-border">
        <div className="container-site py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
                {t("history_label")}
              </p>
              <h2 className="font-display text-display-md font-light text-text1">
                {t("history_title")}
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="relative">
                <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-border" />
                <div className="space-y-0">
                  {TIMELINE.map((item, i) => (
                    <div key={item.year} className="flex gap-8 group">
                      <div className="w-14 shrink-0 pt-6 text-right">
                        <span className="font-mono text-caption text-gold tracking-widest">
                          {item.year}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-gold bg-void mt-7 shrink-0 group-hover:bg-gold transition-colors duration-300 z-10" />
                      </div>
                      <div className={`flex-1 pb-10 ${i === TIMELINE.length - 1 ? "pb-0" : ""}`}>
                        <p className="font-sans text-body-md text-text2 leading-relaxed pt-5">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collaborate CTA ── */}
      <section>
        <div className="container-site py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
                {t("collaborate_label")}
              </p>
              <h2 className="font-display text-display-md font-light text-text1 mb-5">
                {t("collaborate_title")}
              </h2>
              <p className="font-sans text-body-lg text-text2 leading-relaxed max-w-xl">
                {t("collaborate_body")}
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Link
                href="/especies"
                className="flex items-center justify-between w-full border border-border px-6 py-5 hover:border-gold hover:bg-surface transition-all duration-300 group"
              >
                <div>
                  <p className="font-mono text-caption text-gold uppercase tracking-widest mb-1">
                    {t("link_catalog_label")}
                  </p>
                  <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                    {t("link_catalog_desc")}
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0" />
              </Link>

              <Link
                href="/articulos"
                className="flex items-center justify-between w-full border border-border px-6 py-5 hover:border-gold hover:bg-surface transition-all duration-300 group"
              >
                <div>
                  <p className="font-mono text-caption text-gold uppercase tracking-widest mb-1">
                    {t("link_articles_label")}
                  </p>
                  <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                    {t("link_articles_desc")}
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0" />
              </Link>

              <a
                href="mailto:contacto@phasmamx.org"
                className="flex items-center justify-between w-full btn-primary group"
              >
                <div>
                  <p className="font-mono text-caption uppercase tracking-widest mb-0.5">
                    {t("contact_btn")}
                  </p>
                  <p className="font-sans text-body-md opacity-80">
                    contacto@phasmamx.org
                  </p>
                </div>
                <Mail size={16} className="shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
