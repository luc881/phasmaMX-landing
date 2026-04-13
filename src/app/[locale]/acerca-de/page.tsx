import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Globe, BookOpen } from "lucide-react";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export const metadata = {
  title: "Acerca de — Phasma MX",
  description:
    "Phasma MX es el archivo científico de referencia sobre Phasmatodea en México y América Latina. Conoce nuestro equipo, misión y cómo colaborar.",
};

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

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative border-b border-border overflow-hidden">
        {/* Background texture */}
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
              Phasma MX · Proyecto
            </p>
            <h1 className="font-display text-display-lg font-light text-text1 mb-8 leading-none">
              Un archivo para los{" "}
              <em className="italic text-gold" style={{ fontStyle: "italic" }}>
                invisibles
              </em>
            </h1>
            <p className="font-sans text-body-xl text-text2 leading-relaxed max-w-2xl">
              Phasma MX nació de una convicción simple: que los fásmidos de México
              merecen un registro sistemático, riguroso y accesible. Somos un equipo
              pequeño de biólogos, editores y aficionados que documenta, publica y
              divulga el conocimiento sobre el orden Phasmatodea en México y
              América Latina.
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
                  Misión
                </p>
                <p className="font-sans text-body-lg text-text2 leading-relaxed mb-6">
                  Construir el archivo más completo de Phasmatodea en México: con fichas
                  taxonómicas verificadas, fotografías de campo, distribución georreferenciada,
                  y artículos que traduzcan la investigación científica para públicos amplios.
                </p>
                <p className="font-sans text-body-md text-text2 leading-relaxed">
                  No somos una institución académica ni una empresa. Somos un proyecto
                  colaborativo abierto a biólogos, fotógrafos, criadores y cualquier persona
                  que quiera contribuir al conocimiento de estos extraordinarios insectos.
                </p>
              </div>

              <blockquote className="pull-quote">
                Los fásmidos son el resultado de millones de años de coevolución con
                las plantas que los rodean — arquitectura viva que apenas comenzamos
                a documentar.
              </blockquote>

              <div>
                <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
                  Principios
                </p>
                <div className="space-y-4">
                  {[
                    ["Rigor científico", "Todo el contenido del catálogo está verificado contra fuentes primarias y el Phasmida Species File Online."],
                    ["Acceso abierto", "El archivo es de acceso gratuito. Los datos de distribución son descargables para uso científico."],
                    ["Divulgación honesta", "Cuando algo no se sabe, lo decimos. Distinguimos entre certeza taxonómica y registro preliminar."],
                  ].map(([title, desc]) => (
                    <div key={title as string} className="flex gap-5 p-5 border border-border bg-surface">
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
                Equipo
              </p>
              <h2 className="font-display text-display-md font-light text-text1">
                Las personas detrás del archivo
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-void p-8 group">
                <div className="flex items-start gap-5 mb-5">
                  {/* Avatar */}
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

                {/* Links */}
                <div className="flex items-center gap-4">
                  {member.orcid && (
                    <a
                      href={`https://orcid.org/${member.orcid}`}
                      className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-300 flex items-center gap-1.5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen size={11} />
                      ORCID
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
                      Perfil
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
                Historia
              </p>
              <h2 className="font-display text-display-md font-light text-text1">
                Cómo llegamos aquí
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-0">
                  {TIMELINE.map((item, i) => (
                    <div key={item.year} className="flex gap-8 group">
                      {/* Year */}
                      <div className="w-14 shrink-0 pt-6 text-right">
                        <span className="font-mono text-caption text-gold tracking-widest">
                          {item.year}
                        </span>
                      </div>

                      {/* Dot */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-gold bg-void mt-7 shrink-0 group-hover:bg-gold transition-colors duration-300 z-10" />
                      </div>

                      {/* Content */}
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

      {/* ── Colaborar CTA ── */}
      <section>
        <div className="container-site py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-4">
                Colaborar
              </p>
              <h2 className="font-display text-display-md font-light text-text1 mb-5">
                El archivo crece con cada registro
              </h2>
              <p className="font-sans text-body-lg text-text2 leading-relaxed max-w-xl">
                Si tienes fotografías de campo, datos de distribución, registros de crianza
                o publicaciones sobre fásmidos en México o América Latina, queremos saber
                de ti. No se necesita ser investigador: cualquier observación documentada
                tiene valor científico.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Link
                href="/es/especies"
                className="flex items-center justify-between w-full border border-border px-6 py-5 hover:border-gold hover:bg-surface transition-all duration-300 group"
              >
                <div>
                  <p className="font-mono text-caption text-gold uppercase tracking-widest mb-1">
                    Catálogo
                  </p>
                  <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                    Explorar las especies documentadas
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0" />
              </Link>

              <Link
                href="/es/articulos"
                className="flex items-center justify-between w-full border border-border px-6 py-5 hover:border-gold hover:bg-surface transition-all duration-300 group"
              >
                <div>
                  <p className="font-mono text-caption text-gold uppercase tracking-widest mb-1">
                    Artículos
                  </p>
                  <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                    Leer el archivo de divulgación
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
                    Contacto directo
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
