import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, Tag, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  PLACEHOLDER_ARTICLES,
  CATEGORY_META,
  formatDate,
  localizeArticle,
  type ArticlePlaceholder,
  type ArticleCategory,
} from "@/lib/placeholder/articles";

export function generateStaticParams() {
  return ["es", "en"].flatMap((locale) =>
    PLACEHOLDER_ARTICLES.map((a) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const article = PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Artículo no encontrado — Phasma MX" };
  const localized = localizeArticle(article, locale);
  return {
    title: `${localized.title} — Phasma MX`,
    description: localized.excerpt.slice(0, 155),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const articleRaw = PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);
  if (!articleRaw) notFound();

  const t = await getTranslations({ locale, namespace: "article_detail" });
  const tArticles = await getTranslations({ locale, namespace: "articles_page" });

  const article = localizeArticle(articleRaw, locale);
  const meta = CATEGORY_META[article.category as ArticleCategory];
  const related = PLACEHOLDER_ARTICLES.filter(
    (a) => articleRaw.relatedSlugs.includes(a.slug)
  ).map((a) => localizeArticle(a, locale));

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/50 via-transparent to-transparent" />

        {/* Back */}
        <Link
          href="/articulos"
          className="absolute top-24 left-6 lg:left-16 z-10 flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-300 bg-void/60 px-3 py-2 backdrop-blur-sm"
        >
          <ArrowLeft size={13} />
          {t("back")}
        </Link>

        {/* Hero content */}
        <div className="relative z-10 container-site pb-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5">
              <span className={`font-mono text-caption uppercase tracking-widest px-2 py-1 border ${meta.color} ${meta.border} bg-void/60`}>
                {tArticles(meta.translationKey as Parameters<typeof tArticles>[0])}
              </span>
              <span className="font-mono text-caption text-text3 flex items-center gap-1.5">
                <Clock size={11} />
                {article.readingMinutes} {t("read_time")}
              </span>
            </div>
            <h1 className="font-display text-display-md font-light text-text1 leading-tight text-balance">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Image caption */}
        <div className="absolute bottom-3 right-6 lg:right-16 z-10">
          <p className="font-mono text-caption text-text3 opacity-60 italic text-right max-w-xs">
            {article.imageCaption}
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ── Article body ── */}
          <article className="lg:col-span-8">
            {/* Lead / excerpt */}
            <p className="font-display text-display-sm font-light text-text2 italic leading-relaxed mb-12 border-l-2 border-gold pl-6">
              {article.excerpt}
            </p>

            {/* Body sections */}
            <div className="space-y-8">
              {article.body.map((section, i) => {
                if (section.type === "paragraph") {
                  return (
                    <p key={i} className="font-sans text-body-lg text-text2 leading-relaxed">
                      {section.content}
                    </p>
                  );
                }
                if (section.type === "subheading") {
                  return (
                    <h2 key={i} className="font-display text-display-sm font-light text-text1 pt-6 pb-2 border-b border-border">
                      {section.content}
                    </h2>
                  );
                }
                if (section.type === "pull-quote") {
                  return (
                    <blockquote key={i} className="font-display text-display-sm font-light italic text-text1 border-l-2 border-gold pl-8 py-2 my-10">
                      {section.content}
                    </blockquote>
                  );
                }
                if (section.type === "image" && section.src) {
                  return (
                    <figure key={i} className="my-10 -mx-0">
                      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        <Image
                          src={section.src}
                          alt={section.caption ?? ""}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 65vw"
                        />
                      </div>
                      {(section.caption || section.credit) && (
                        <figcaption className="flex items-start justify-between gap-4 mt-3 px-1">
                          <p className="font-mono text-caption text-text3 italic">{section.caption}</p>
                          {section.credit && (
                            <p className="font-mono text-caption text-text3 shrink-0">{section.credit}</p>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return null;
              })}
            </div>

            {/* Tags */}
            <div className="mt-14 pt-8 border-t border-border">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag size={13} className="text-text3" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-caption text-text3 border border-border px-3 py-1.5 hover:border-border2 hover:text-text2 transition-colors duration-300 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Author card */}
              <div className="border border-border bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-mono text-caption text-text3 uppercase tracking-widest">{t("author_label")}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gold flex items-center justify-center shrink-0">
                      <span className="font-mono text-void font-bold">{article.author.initials}</span>
                    </div>
                    <div>
                      <p className="font-sans text-body-lg text-text1 font-medium leading-snug">{article.author.name}</p>
                      <p className="font-mono text-caption text-text3 mt-0.5">{article.author.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article metadata */}
              <div className="border border-border bg-surface divide-y divide-border">
                <div className="flex justify-between px-6 py-3">
                  <span className="font-mono text-caption text-text3 uppercase tracking-wide">{t("category_label")}</span>
                  <span className={`font-mono text-caption ${meta.color}`}>
                    {tArticles(meta.translationKey as Parameters<typeof tArticles>[0])}
                  </span>
                </div>
                <div className="flex justify-between px-6 py-3">
                  <span className="font-mono text-caption text-text3 uppercase tracking-wide flex items-center gap-2">
                    <Calendar size={11} />
                    {t("published_label")}
                  </span>
                  <span className="font-sans text-body-md text-text2">{formatDate(article.publishedAt, locale)}</span>
                </div>
                <div className="flex justify-between px-6 py-3">
                  <span className="font-mono text-caption text-text3 uppercase tracking-wide flex items-center gap-2">
                    <Clock size={11} />
                    {t("reading_label")}
                  </span>
                  <span className="font-sans text-body-md text-text2">{article.readingMinutes} {t("minutes")}</span>
                </div>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="border border-border bg-surface">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="font-mono text-caption text-text3 uppercase tracking-widest">
                      {t("related_label")}
                    </p>
                  </div>
                  <div className="divide-y divide-border">
                    {related.map((rel) => {
                      const relMeta = CATEGORY_META[rel.category as ArticleCategory];
                      return (
                        <Link
                          key={rel.id}
                          href={`/articulos/${rel.slug}`}
                          className="flex gap-4 p-4 hover:bg-void transition-colors duration-300 group"
                        >
                          <div className="relative w-16 h-16 shrink-0 overflow-hidden">
                            <Image
                              src={rel.image}
                              alt={rel.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-400"
                            />
                          </div>
                          <div className="flex flex-col justify-between min-w-0">
                            <div>
                              <p className={`font-mono text-caption uppercase tracking-widest mb-1 ${relMeta.color}`}>
                                {tArticles(relMeta.translationKey as Parameters<typeof tArticles>[0])}
                              </p>
                              <p className="font-display text-body-lg font-light text-text1 line-clamp-2 leading-snug group-hover:text-gold transition-colors duration-300">
                                {rel.title}
                              </p>
                            </div>
                            <p className="font-mono text-caption text-text3 flex items-center gap-1 mt-1">
                              <Clock size={9} />
                              {rel.readingMinutes} min
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Back to articles */}
              <Link
                href="/articulos"
                className="flex items-center justify-between w-full border border-border px-6 py-4 hover:border-border2 hover:bg-surface transition-colors duration-300 group"
              >
                <span className="font-mono text-caption text-text2 uppercase tracking-widest group-hover:text-gold transition-colors duration-300">
                  {t("view_all")}
                </span>
                <ArrowUpRight size={14} className="text-text3 group-hover:text-gold transition-colors duration-300" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── More from the archive ── */}
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="container-site py-20">
            <div className="flex items-center justify-between mb-12 gap-8">
              <div>
                <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-2">
                  {t("continue")}
                </p>
                <h2 className="font-display text-display-sm font-light text-text1">
                  {t("from_archive")}
                </h2>
              </div>
              <Link
                href="/articulos"
                className="hidden md:flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-300 uppercase tracking-widest shrink-0"
              >
                {t("view_all")}
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {related.map((rel) => {
                const relMeta = CATEGORY_META[rel.category as ArticleCategory];
                return (
                  <Link
                    key={rel.id}
                    href={`/articulos/${rel.slug}`}
                    className="group flex gap-6 bg-void p-6 hover:bg-surface transition-colors duration-400"
                  >
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-mono text-caption uppercase tracking-widest mb-2 ${relMeta.color}`}>
                        {tArticles(relMeta.translationKey as Parameters<typeof tArticles>[0])}
                      </p>
                      <h3 className="font-display text-display-sm font-light text-text1 line-clamp-2 leading-tight group-hover:text-gold transition-colors duration-300">
                        {rel.title}
                      </h3>
                      <p className="font-mono text-caption text-text3 mt-3 flex items-center gap-1.5">
                        <Clock size={10} />
                        {rel.readingMinutes} min · {rel.author.name.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
