"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Search, X, ArrowUpRight, Bug, FileText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import gsap from "gsap";
import { PLACEHOLDER_SPECIES } from "@/lib/placeholder/species";
import {
  PLACEHOLDER_ARTICLES,
  CATEGORY_META,
  localizeArticle,
  type ArticleCategory,
} from "@/lib/placeholder/articles";

// ── Result types ──────────────────────────────────────────────────────────────

type SpeciesResult = {
  type: "species";
  id: string;
  slug: string;
  scientificName: string;
  commonName: string;
  family: string;
  image: string;
  catalogNum: string;
};

type ArticleResult = {
  type: "article";
  id: string;
  slug: string;
  title: string;
  categoryColor: string;
  categoryKey: string;
  readingMinutes: number;
  image: string;
};

type SearchResult = SpeciesResult | ArticleResult;

// ── Search logic ──────────────────────────────────────────────────────────────

function runSearch(query: string, locale: string): { species: SpeciesResult[]; articles: ArticleResult[] } {
  if (!query.trim()) return { species: [], articles: [] };
  const q = query.toLowerCase();

  const species: SpeciesResult[] = PLACEHOLDER_SPECIES.filter((s) =>
    s.scientificName.toLowerCase().includes(q) ||
    s.commonNameEs.toLowerCase().includes(q) ||
    (s.commonNameEn?.toLowerCase().includes(q) ?? false) ||
    s.family.toLowerCase().includes(q) ||
    s.tags.some((t) => t.toLowerCase().includes(q))
  )
    .slice(0, 5)
    .map((s) => ({
      type: "species",
      id: s.id,
      slug: s.slug,
      scientificName: s.scientificName,
      commonName: locale === "en" && s.commonNameEn ? s.commonNameEn : s.commonNameEs,
      family: s.family,
      image: s.image,
      catalogNum: s.catalogNum,
    }));

  const articles: ArticleResult[] = PLACEHOLDER_ARTICLES.filter((a) =>
    a.titleEs.toLowerCase().includes(q) ||
    a.titleEn.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.excerptEn.toLowerCase().includes(q) ||
    a.tags.some((t) => t.toLowerCase().includes(q))
  )
    .slice(0, 5)
    .map((a) => {
      const meta = CATEGORY_META[a.category as ArticleCategory];
      return {
        type: "article",
        id: a.id,
        slug: a.slug,
        title: localizeArticle(a, locale).title,
        categoryColor: meta.color,
        categoryKey: meta.translationKey,
        readingMinutes: a.readingMinutes,
        image: a.image,
      };
    });

  return { species, articles };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GlobalSearch() {
  const t = useTranslations("search");
  const tArticles = useTranslations("articles_page");
  const locale = useLocale();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ species: SpeciesResult[]; articles: ArticleResult[] }>({ species: [], articles: [] });
  const [activeIndex, setActiveIndex] = useState(-1);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flat list of all results for keyboard nav
  const flatResults: SearchResult[] = [...results.species, ...results.articles];
  const hasResults = results.species.length > 0 || results.articles.length > 0;

  // Open via custom event (dispatched by Header) or Cmd+K
  useEffect(() => {
    const onOpenEvent = () => setOpen(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("phasma:open-search", onOpenEvent);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("phasma:open-search", onOpenEvent);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Focus input on open, reset on close
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults({ species: [], articles: [] });
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
      animateOpen();
      document.body.style.overflow = "hidden";
    } else {
      animateClose();
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Live search
  useEffect(() => {
    setResults(runSearch(query, locale));
    setActiveIndex(-1);
  }, [query, locale]);

  // Animate results list when results change
  useEffect(() => {
    if (!listRef.current || !query) return;
    const items = listRef.current.querySelectorAll(".search-result-item");
    if (items.length === 0) return;
    gsap.fromTo(items,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.04 }
    );
  }, [results, query]);

  function animateOpen() {
    if (!overlayRef.current || !panelRef.current) return;
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" }
    );
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: -16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
    );
  }

  function animateClose() {
    if (!overlayRef.current || !panelRef.current) return;
    gsap.to(panelRef.current, { opacity: 0, y: -8, scale: 0.98, duration: 0.2, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
  }

  // Keyboard navigation within results
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const result = flatResults[activeIndex];
      if (result.type === "species") router.push(`/especies/${result.slug}`);
      else router.push(`/articulos/${result.slug}`);
      setOpen(false);
    }
  }, [flatResults, activeIndex, router]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl bg-void border border-border shadow-2xl flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        {/* ── Input ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search size={16} className="text-text3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("placeholder")}
            className="flex-1 bg-transparent font-mono text-body-md text-text1 placeholder-text3 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-text3 hover:text-text1 transition-colors duration-200"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="font-mono text-caption text-text3 hover:text-text1 transition-colors duration-200 border border-border px-2 py-1 ml-1"
            aria-label={t("close_label")}
          >
            ESC
          </button>
        </div>

        {/* ── Results / Empty state ── */}
        <div ref={listRef} className="overflow-y-auto flex-1">
          {!query ? (
            <EmptyHint t={t} setOpen={setOpen} />
          ) : !hasResults ? (
            <div className="px-6 py-12 text-center">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-2">
                {t("no_results", { query })}
              </p>
            </div>
          ) : (
            <div>
              {/* Species results */}
              {results.species.length > 0 && (
                <section>
                  <SectionHeader
                    icon={<Bug size={11} />}
                    label={t("species_heading")}
                    count={results.species.length}
                  />
                  {results.species.map((s, i) => (
                    <ResultItem
                      key={s.id}
                      active={activeIndex === i}
                      onClick={() => setOpen(false)}
                      href={`/especies/${s.slug}`}
                    >
                      <div className="relative w-12 h-12 shrink-0 overflow-hidden">
                        <Image src={s.image} alt={s.scientificName} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-caption text-gold italic truncate">{s.scientificName}</p>
                        <p className="font-sans text-body-md text-text1 truncate leading-snug">{s.commonName}</p>
                        <p className="font-mono text-caption text-text3 truncate">{s.family}</p>
                      </div>
                      <span className="catalog-number shrink-0 self-start">{s.catalogNum}</span>
                    </ResultItem>
                  ))}
                </section>
              )}

              {/* Articles results */}
              {results.articles.length > 0 && (
                <section className={results.species.length > 0 ? "border-t border-border" : ""}>
                  <SectionHeader
                    icon={<FileText size={11} />}
                    label={t("articles_heading")}
                    count={results.articles.length}
                  />
                  {results.articles.map((a, i) => {
                    const globalIdx = results.species.length + i;
                    return (
                      <ResultItem
                        key={a.id}
                        active={activeIndex === globalIdx}
                        onClick={() => setOpen(false)}
                        href={`/articulos/${a.slug}`}
                      >
                        <div className="relative w-12 h-12 shrink-0 overflow-hidden">
                          <Image src={a.image} alt={a.title} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-mono text-caption uppercase tracking-widest mb-0.5 ${a.categoryColor}`}>
                            {tArticles(a.categoryKey as Parameters<typeof tArticles>[0])}
                          </p>
                          <p className="font-sans text-body-md text-text1 line-clamp-1 leading-snug">{a.title}</p>
                          <p className="font-mono text-caption text-text3">{a.readingMinutes} min</p>
                        </div>
                      </ResultItem>
                    );
                  })}
                </section>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {hasResults && (
          <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/especies"
                onClick={() => setOpen(false)}
                className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-200 flex items-center gap-1.5 uppercase tracking-widest"
              >
                {t("view_catalog")} <ArrowUpRight size={10} />
              </Link>
              <Link
                href="/articulos"
                onClick={() => setOpen(false)}
                className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-200 flex items-center gap-1.5 uppercase tracking-widest"
              >
                {t("view_articles")} <ArrowUpRight size={10} />
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-caption text-text3" style={{ fontSize: "10px" }}>
              <kbd className="border border-border px-1.5 py-0.5">↑↓</kbd>
              <span>navegar</span>
              <kbd className="border border-border px-1.5 py-0.5">↵</kbd>
              <span>abrir</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EmptyHint({ t, setOpen }: { t: ReturnType<typeof useTranslations<"search">>; setOpen: (v: boolean) => void }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="font-mono text-caption text-text3 max-w-xs mx-auto leading-relaxed">
        {t("empty_hint")}
      </p>
      <div className="flex items-center justify-center gap-6 mt-8">
        <Link
          href="/especies"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-200 uppercase tracking-widest"
        >
          <Bug size={12} />
          {t("view_catalog")}
        </Link>
        <Link
          href="/articulos"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-mono text-caption text-text2 hover:text-gold transition-colors duration-200 uppercase tracking-widest"
        >
          <FileText size={12} />
          {t("view_articles")}
        </Link>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-surface border-b border-border">
      <span className="text-text3">{icon}</span>
      <span className="font-mono text-caption text-text3 uppercase tracking-widest">{label}</span>
      <span className="font-mono text-caption text-text3 opacity-50">({count})</span>
    </div>
  );
}

function ResultItem({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const itemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [active]);

  return (
    <Link
      ref={itemRef}
      href={href}
      onClick={onClick}
      className={`search-result-item flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-b-0 transition-colors duration-150 group ${
        active ? "bg-surface" : "hover:bg-surface/60"
      }`}
    >
      {children}
      <ArrowUpRight
        size={13}
        className={`shrink-0 transition-colors duration-150 ${active ? "text-gold" : "text-text3 group-hover:text-gold"}`}
      />
    </Link>
  );
}
