"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Search } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

type Props = {
  locale: string;
};

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/especies", label: t("species") },
    { href: "/articulos", label: t("articles") },
    { href: "/expediciones", label: t("expeditions") },
    { href: "/publicaciones", label: t("publications") },
    { href: "/acerca-de", label: t("about") },
  ];

  const altLocale = locale === "es" ? "en" : "es";
  const altLabel = locale === "es" ? "EN" : "ES";

  function openSearch() {
    window.dispatchEvent(new CustomEvent("phasma:open-search"));
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600 ${
          scrolled
            ? "bg-void/95 backdrop-blur-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col leading-none group"
            >
              <span className="font-display text-lg font-light tracking-[0.15em] text-text1 uppercase">
                Phasma
              </span>
              <span className="font-mono text-caption text-gold tracking-widest">
                MX · PHASMATODEA
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-caption uppercase tracking-widest text-text2 hover:text-text1 transition-colors duration-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search + locale switcher + hamburger */}
            <div className="flex items-center gap-4">
              <button
                onClick={openSearch}
                className="flex items-center gap-2 font-mono text-caption text-text3 hover:text-text1 transition-colors duration-300 border border-border/60 hover:border-border px-3 py-1.5 hidden sm:flex"
                aria-label={tSearch("open_label")}
              >
                <Search size={12} />
                <span className="hidden lg:inline tracking-widest uppercase" style={{ fontSize: "10px" }}>
                  ⌘K
                </span>
              </button>
              <Link
                href={pathname}
                locale={altLocale as "es" | "en"}
                className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-400 tracking-widest"
              >
                {altLabel}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-text2 hover:text-text1 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-void/98 backdrop-blur-sm transition-all duration-600 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col justify-center items-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-display-sm font-light text-text1 hover:text-gold transition-colors duration-400"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px w-16 bg-border my-4" />
          <button
            onClick={() => { setMenuOpen(false); openSearch(); }}
            className="flex items-center gap-3 font-mono text-caption text-text3 hover:text-gold transition-colors tracking-widest uppercase"
          >
            <Search size={14} />
            {tSearch("open_label")}
          </button>
          <Link
            href={pathname}
            locale={altLocale as "es" | "en"}
            onClick={() => setMenuOpen(false)}
            className="font-mono text-caption text-text3 hover:text-gold transition-colors tracking-widest uppercase"
          >
            {altLabel === "EN" ? "English" : "Español"}
          </Link>
        </nav>
      </div>
    </>
  );
}
