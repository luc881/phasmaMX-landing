"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PLACEHOLDER_ARTICLES,
  CATEGORIES,
  CATEGORY_META,
  formatDate,
  localizeArticle,
  type ArticlePlaceholder,
  type ArticleCategory,
} from "@/lib/placeholder/articles";

gsap.registerPlugin(ScrollTrigger);

export default function ArticlesGrid() {
  const t = useTranslations("articles_page");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState("all");
  const listRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const articles = activeCategory === "all"
      ? PLACEHOLDER_ARTICLES
      : PLACEHOLDER_ARTICLES.filter((a) => a.category === activeCategory);
    return articles.map((a) => localizeArticle(a, locale));
  }, [activeCategory, locale]);

  const [featured, ...rest] = filtered;

  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.querySelectorAll(".article-item"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.07 }
    );
  }, [filtered]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(filterRef.current, {
        opacity: 0, y: 16, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: filterRef.current, start: "top 88%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* ── Category filter tabs ── */}
      <div ref={filterRef} className="border-b border-border sticky top-16 z-30 bg-void/95 backdrop-blur-sm">
        <div className="container-site">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`shrink-0 font-mono text-caption uppercase tracking-widest px-5 py-4 border-b-2 transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "border-gold text-gold"
                    : "border-transparent text-text3 hover:text-text2"
                }`}
              >
                {t(cat.translationKey as Parameters<typeof t>[0])}
              </button>
            ))}
            <div className="ml-auto flex items-center pl-8 shrink-0">
              <span className="font-mono text-caption text-text3">
                <span className="text-gold">{filtered.length}</span> {t("count")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="container-site py-32 text-center">
          <p className="font-display text-display-sm font-light text-text2">
            {t("all_articles")}
          </p>
        </div>
      ) : (
        <div ref={listRef} className="container-site py-16 space-y-0">

          {/* ── Featured article ── */}
          {featured && (
            <div className="article-item mb-16">
              <FeaturedCard article={featured} locale={locale} t={t} />
            </div>
          )}

          {/* ── Divider ── */}
          {rest.length > 0 && (
            <div className="article-item flex items-center gap-6 py-6 mb-8">
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-caption text-text3 uppercase tracking-widest shrink-0">
                {t("archive_divider")}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          {/* ── Rest of articles ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {rest.map((article) => (
              <div key={article.id} className="article-item bg-void">
                <SmallCard article={article} locale={locale} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type TFn = ReturnType<typeof useTranslations<"articles_page">>;

function FeaturedCard({
  article,
  locale,
  t,
}: {
  article: ArticlePlaceholder & { title: string };
  locale: string;
  t: TFn;
}) {
  const meta = CATEGORY_META[article.category as ArticleCategory];

  return (
    <Link
      href={`/articulos/${article.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-12 bg-surface border border-border overflow-hidden hover:border-border2 transition-colors duration-400"
    >
      <div className="lg:col-span-7 relative overflow-hidden" style={{ minHeight: 420 }}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface lg:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent lg:hidden" />
      </div>

      <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12">
        <div className="flex items-center gap-3 mb-5">
          <span className={`font-mono text-caption uppercase tracking-widest ${meta.color}`}>
            {t(meta.translationKey as Parameters<typeof t>[0])}
          </span>
          <span className="font-mono text-caption text-text3">·</span>
          <span className="font-mono text-caption text-text3 flex items-center gap-1.5">
            <Clock size={11} />
            {article.readingMinutes} min
          </span>
        </div>

        <h2 className="font-display text-display-sm font-light text-text1 mb-5 leading-tight text-balance group-hover:text-gold transition-colors duration-400">
          {article.title}
        </h2>

        <p className="font-sans text-body-md text-text2 leading-relaxed mb-8 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gold flex items-center justify-center shrink-0">
              <span className="font-mono text-caption text-void font-bold" style={{ fontSize: "9px" }}>
                {article.author.initials}
              </span>
            </div>
            <div>
              <p className="font-sans text-body-md text-text1 leading-none">{article.author.name}</p>
              <p className="font-mono text-caption text-text3 mt-0.5">{formatDate(article.publishedAt, locale)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-text3 group-hover:text-gold transition-colors duration-300">
            <span className="font-mono text-caption uppercase tracking-widest">
              {t("all_articles")}
            </span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({
  article,
  locale,
  t,
}: {
  article: ArticlePlaceholder & { title: string };
  locale: string;
  t: TFn;
}) {
  const meta = CATEGORY_META[article.category as ArticleCategory];

  return (
    <Link
      href={`/articulos/${article.slug}`}
      className="group flex flex-col h-full hover:bg-surface transition-colors duration-400"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-[1.05]"
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className={`font-mono text-caption uppercase tracking-widest px-2 py-1 bg-void/80 backdrop-blur-sm ${meta.color}`}>
            {t(meta.translationKey as Parameters<typeof t>[0])}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-display text-display-sm font-light text-text1 mb-3 leading-tight line-clamp-3 group-hover:text-gold transition-colors duration-300">
          {article.title}
        </h3>

        <p className="font-sans text-body-md text-text2 leading-relaxed line-clamp-2 mb-5 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gold flex items-center justify-center shrink-0">
              <span className="font-mono text-void font-bold" style={{ fontSize: "7px" }}>
                {article.author.initials}
              </span>
            </div>
            <span className="font-mono text-caption text-text3">{article.author.name.split(" ").slice(-1)}</span>
          </div>
          <div className="flex items-center gap-2 text-text3">
            <Clock size={10} />
            <span className="font-mono text-caption">{article.readingMinutes} min</span>
            <span className="font-mono text-caption text-border2">·</span>
            <span className="font-mono text-caption">{formatDate(article.publishedAt, locale).split(" ").slice(-1)[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
