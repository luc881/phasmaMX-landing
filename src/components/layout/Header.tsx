"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

type Props = {
  locale: string;
};

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}/especies`, label: t("species") },
    { href: `/${locale}/articulos`, label: t("articles") },
    { href: `/${locale}/expediciones`, label: t("expeditions") },
    { href: `/${locale}/publicaciones`, label: t("publications") },
    { href: `/${locale}/acerca-de`, label: t("about") },
  ];

  const altLocale = locale === "es" ? "en" : "es";
  const altLabel = locale === "es" ? "EN" : "ES";

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
              href={`/${locale}`}
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

            {/* Locale switcher + hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${altLocale}`}
                className="font-mono text-caption text-text3 hover:text-gold transition-colors duration-400 tracking-widest"
              >
                {altLabel}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-text2 hover:text-text1 transition-colors"
                aria-label="Menú"
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
          <Link
            href={`/${altLocale}`}
            onClick={() => setMenuOpen(false)}
            className="font-mono text-caption text-text3 hover:text-gold transition-colors tracking-widest uppercase"
          >
            {altLabel === "EN" ? "Switch to English" : "Cambiar a Español"}
          </Link>
        </nav>
      </div>
    </>
  );
}
