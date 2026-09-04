"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import { CATEGORY_META, formatDate, type ArticleCategory } from "@/lib/placeholder/articles";
import type { ArticleCard } from "@/lib/content/articles";

gsap.registerPlugin(ScrollTrigger);

// El inglés casi nunca está cargado todavía: cae al español antes que dejar hueco.
function localizeArticle(article: ArticleCard, locale: string) {
  return {
    ...article,
    title: (locale === "en" ? article.titleEn : null) ?? article.titleEs,
    excerpt: (locale === "en" ? article.excerptEn : null) ?? article.excerpt,
  };
}

export default function LatestArticles({ articles: latestArticles }: { articles: ArticleCard[] }) {
  const t = useTranslations();
  const tArticles = useTranslations("articles_page");
  const locale = useLocale();
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

  // `latestArticles` ya viene limitado a 4 por la consulta GROQ.
  const articles = latestArticles.map((a) => localizeArticle(a, locale));
  if (articles.length === 0) return null;
  const [featured, ...rest] = articles;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-36">
      <div className="container-site">
        {/* Header */}
        <div className="article-reveal flex items-end justify-between mb-8 md:mb-16 gap-8">
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
              {t("latest_articles.label")}
            </p>
            <h2 className="font-display text-display-md font-light text-text1">
              {t("sections.latest_articles")}
            </h2>
          </div>
          <Link
            href="/articulos"
            className="hidden md:flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-400 tracking-widest uppercase shrink-0"
          >
            {t("latest_articles.view_all")}
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Layout: featured + list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-border">
          {/* Featured article */}
          <Link
            href={`/articulos/${featured.slug}`}
            className="article-reveal lg:col-span-7 group relative overflow-hidden bg-void flex flex-col lg:block lg:aspect-[4/3]"
          >
            {/* En móvil la tarjeta ocupa el ancho completo y el titular, la
                entradilla y la firma no caben encima de la foto: van debajo, en
                flujo normal. Desde lg vuelven a superponerse sobre el degradado. */}
            <div className="relative w-full aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto">
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-800 group-hover:scale-[1.03]"
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36,1)" }}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 bg-surface flex items-center justify-center">
                  <span className="font-mono text-caption text-text3 uppercase tracking-widest">
                    Sin fotografía
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent hidden lg:block" />
            </div>

            <div className="relative p-6 pb-7 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:p-8">
              <p
                className={`font-mono text-caption uppercase tracking-widest mb-3 ${
                  CATEGORY_META[featured.category as ArticleCategory]?.color ?? "text-text2"
                }`}
              >
                {tArticles(CATEGORY_META[featured.category as ArticleCategory]?.translationKey as Parameters<typeof tArticles>[0])}
              </p>
              <h3 className="font-display text-display-sm font-light text-text1 mb-3 text-balance">
                {featured.title}
              </h3>
              <p className="font-sans text-body-md text-text2 line-clamp-2 mb-4">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4">
                {featured.author && (
                  <>
                    <span className="font-mono text-caption text-text3">
                      {featured.author.name}
                    </span>
                    <span className="font-mono text-caption text-text3">·</span>
                  </>
                )}
                <span className="font-mono text-caption text-text3">
                  {formatDate(featured.publishedAt, locale)}
                </span>
              </div>
            </div>
          </Link>

          {/* Article list */}
          <div className="lg:col-span-5 flex flex-col bg-void">
            {rest.map((article) => {
              const meta = CATEGORY_META[article.category as ArticleCategory];
              return (
                <Link
                  key={article.id}
                  href={`/articulos/${article.slug}`}
                  className="article-reveal group flex gap-5 p-6 border-b border-border last:border-b-0 hover:bg-surface transition-colors duration-400"
                >
                  <div className="relative shrink-0 overflow-hidden bg-surface" style={{ width: 80, height: 80 }}>
                    {article.image && (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <p
                        className={`font-mono text-caption uppercase tracking-widest mb-1 ${
                          meta?.color ?? "text-text2"
                        }`}
                      >
                        {tArticles(meta?.translationKey as Parameters<typeof tArticles>[0])}
                      </p>
                      <h4 className="font-display text-body-lg font-light text-text1 line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                    </div>
                    <p className="font-mono text-caption text-text3 mt-2">
                      {formatDate(article.publishedAt, locale)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
