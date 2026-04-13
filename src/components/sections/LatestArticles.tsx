"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_ARTICLES = [
  {
    id: "1",
    titleEs: "Primeros registros de Bacteria ploiaria en Veracruz",
    slug: "bacteria-ploiaria-veracruz",
    publishedAt: "2024-03-15",
    category: "expedition",
    categoryLabel: "Expedición",
    excerpt: "Durante una expedición nocturna en la Sierra de los Tuxtlas, el equipo de Phasma MX documentó por primera vez la presencia de esta especie en territorio mexicano.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80&fit=crop",
    author: { name: "Dr. Martín Vidal", role: "Investigador" },
  },
  {
    id: "2",
    titleEs: "Taxonomía actualizada de Phasmatodea: nuevas familias y géneros",
    slug: "taxonomia-phasmatodea-2024",
    publishedAt: "2024-02-08",
    category: "taxonomy",
    categoryLabel: "Taxonomía",
    excerpt: "La revisión filogenómica publicada en Systematic Entomology reordena 12 géneros y eleva tres subfamilias al rango de familia. Un resumen para no especialistas.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80&fit=crop",
    author: { name: "Lucía Herrera", role: "Editora" },
  },
  {
    id: "3",
    titleEs: "Especie del mes: Extatosoma tiaratum y su estrategia de mimetismo mirmecomorfo",
    slug: "extatosoma-tiaratum-mimetismo",
    publishedAt: "2024-01-20",
    category: "species-of-month",
    categoryLabel: "Especie del mes",
    excerpt: "Las ninfas recién eclosionadas de E. tiaratum imitan con asombrosa fidelidad a las hormigas del género Leptomyrmex para evitar la depredación.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&q=80&fit=crop",
    author: { name: "Carlos Mendoza", role: "Biólogo" },
  },
  {
    id: "4",
    titleEs: "Guía de cría: Heteropteryx dilatata para principiantes",
    slug: "guia-cria-heteropteryx",
    publishedAt: "2024-01-05",
    category: "outreach",
    categoryLabel: "Divulgación",
    excerpt: "Una de las especies más demandadas en terrariofilia por su tamaño imponente. Todo lo que necesitas saber antes de adquirir una.",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=80&fit=crop",
    author: { name: "Sofía Ramírez", role: "Colaboradora" },
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  expedition: "text-lichen",
  taxonomy: "text-gold",
  "species-of-month": "text-amber",
  outreach: "text-text2",
  conservation: "text-amber",
};

function formatDate(dateStr: string, locale = "es") {
  return new Date(dateStr).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LatestArticles() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".article-reveal").forEach((el: HTMLElement) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [featured, ...rest] = PLACEHOLDER_ARTICLES;

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 border-t border-border">
      <div className="container-site">
        {/* Encabezado */}
        <div className="article-reveal flex items-end justify-between mb-16 gap-8">
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
              Divulgación · Archivo
            </p>
            <h2 className="font-display text-display-md font-light text-text1">
              {t("sections.latest_articles")}
            </h2>
          </div>
          <Link
            href="/es/articulos"
            className="hidden md:flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-400 tracking-widest uppercase shrink-0"
          >
            Todos los artículos
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Layout: artículo destacado + lista */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-border">
          {/* Artículo destacado */}
          <Link
            href={`/es/articulos/${featured.slug}`}
            className="article-reveal lg:col-span-7 group relative overflow-hidden bg-void"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={featured.image}
              alt={featured.titleEs}
              fill
              className="object-cover transition-transform duration-800 group-hover:scale-[1.03]"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36,1)" }}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p
                className={`font-mono text-caption uppercase tracking-widest mb-3 ${
                  CATEGORY_COLORS[featured.category] ?? "text-text2"
                }`}
              >
                {featured.categoryLabel}
              </p>
              <h3 className="font-display text-display-sm font-light text-text1 mb-3 text-balance">
                {featured.titleEs}
              </h3>
              <p className="font-sans text-body-md text-text2 line-clamp-2 mb-4">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-caption text-text3">
                  {featured.author.name}
                </span>
                <span className="font-mono text-caption text-text3">·</span>
                <span className="font-mono text-caption text-text3">
                  {formatDate(featured.publishedAt)}
                </span>
              </div>
            </div>
          </Link>

          {/* Lista de artículos */}
          <div className="lg:col-span-5 flex flex-col bg-void">
            {rest.map((article, i) => (
              <Link
                key={article.id}
                href={`/es/articulos/${article.slug}`}
                className="article-reveal group flex gap-5 p-6 border-b border-border last:border-b-0 hover:bg-surface transition-colors duration-400"
              >
                {/* Miniatura */}
                <div className="relative shrink-0 overflow-hidden" style={{ width: 80, height: 80 }}>
                  <Image
                    src={article.image}
                    alt={article.titleEs}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                </div>

                {/* Texto */}
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <p
                      className={`font-mono text-caption uppercase tracking-widest mb-1 ${
                        CATEGORY_COLORS[article.category] ?? "text-text2"
                      }`}
                    >
                      {article.categoryLabel}
                    </p>
                    <h4 className="font-display text-body-lg font-light text-text1 line-clamp-2 leading-snug">
                      {article.titleEs}
                    </h4>
                  </div>
                  <p className="font-mono text-caption text-text3 mt-2">
                    {formatDate(article.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
