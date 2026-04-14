"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import {
  PLACEHOLDER_ARTICLES,
  CATEGORY_META,
  localizeArticle,
  type ArticleCategory,
} from "@/lib/placeholder/articles";

gsap.registerPlugin(ScrollTrigger);

function formatDate(dateStr: string, locale = "es") {
  return new Date(dateStr).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LatestArticles() {
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

  const articles = PLACEHOLDER_ARTICLES.slice(0, 4).map((a) => localizeArticle(a, locale));
  const [featured, ...rest] = articles;

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 border-t border-border">
      <div className="container-site">
        {/* Header */}
        <div className="article-reveal flex items-end justify-between mb-16 gap-8">
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
            className="article-reveal lg:col-span-7 group relative overflow-hidden bg-void"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-800 group-hover:scale-[1.03]"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36,1)" }}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
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
                <span className="font-mono text-caption text-text3">
                  {featured.author.name}
                </span>
                <span className="font-mono text-caption text-text3">·</span>
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
                  <div className="relative shrink-0 overflow-hidden" style={{ width: 80, height: 80 }}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-600 group-hover:scale-105"
                    />
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
