"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Search } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

type Props = {
  locale: string;
};

/** Punto de sondeo: mitad del header (64px en móvil, 80px en escritorio). */
const PROBE_Y = 40;

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [onPaper, setOnPaper] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);

      // ¿Qué hay detrás de la barra ahora mismo? Ocho secciones como mucho,
      // así que recorrerlas sale más barato que montar un observer.
      const bands = document.querySelectorAll('[data-surface="paper"]');
      let paper = false;
      for (const band of bands) {
        const r = band.getBoundingClientRect();
        if (r.top <= PROBE_Y && r.bottom >= PROBE_Y) {
          paper = true;
          break;
        }
      }
      setOnPaper(paper);
    };

    // Al recargar a media página el header ya nace en su estado correcto.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Estructura de secciones del sitio. Artículos y Expediciones quedan dentro
  // de Publicaciones y Eventos respectivamente, y siguen en el pie.
  const navLinks = [
    { href: "/especies", label: t("species") },
    { href: "/publicaciones", label: t("publications") },
    { href: "/crianza", label: t("breeding") },
    { href: "/fotografias", label: t("photos") },
    { href: "/eventos", label: t("events") },
    { href: "/acerca-de", label: t("about") },
    { href: "/contacto", label: t("contact") },
  ];

  const altLocale = locale === "es" ? "en" : "es";
  const altLabel = locale === "es" ? "EN" : "ES";

  function openSearch() {
    window.dispatchEvent(new CustomEvent("phasma:open-search"));
  }

  // La barra siempre contrasta contra lo que tiene detrás: cristal oscuro
  // sobre el pliego claro, cristal claro sobre las secciones oscuras.
  // 85% de opacidad es el punto donde ambos siguen pasando AA.
  const glass = "backdrop-blur-md backdrop-saturate-150";

  const barTone = onPaper
    ? "bg-void/85 border-b border-text1/15"
    : "bg-paper/85 border-b border-ink-2/20";

  const pillTone = onPaper
    ? "border-text1/25 text-text2 hover:border-gold hover:text-text1"
    : "border-ink-2/30 text-ink-2 hover:border-gold-ink hover:text-void";

  const wordmarkTone = onPaper ? "text-text1" : "text-void";
  // Sobre cristal claro el gold-dim cae a 3.75; gold-ink lo sube a 5.2.
  const submarkTone = onPaper ? "text-gold" : "text-gold-ink";
  const quietTone = onPaper
    ? "text-text3 hover:text-text1"
    : "text-ink-2 hover:text-void";
  const progressTone = onPaper ? "bg-gold" : "bg-gold-ink";
  const trackTone = onPaper ? "bg-text1/20" : "bg-ink-2/20";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600 ${glass} ${barTone}`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group shrink-0">
              <span
                className={`font-display text-lg font-light tracking-[0.15em] uppercase transition-colors duration-600 ${wordmarkTone}`}
              >
                Phasma
              </span>
              <span
                className={`font-mono text-caption tracking-widest transition-colors duration-600 ${submarkTone}`}
              >
                MX · PHASMATODEA
              </span>
            </Link>

            {/* Nav desktop — botones visibles desde lo más alto */}
            <nav className="hidden xl:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border px-3 py-2 font-sans text-caption uppercase tracking-widest transition-colors duration-400 ${pillTone}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search + locale switcher + hamburger */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={openSearch}
                className={`hidden sm:flex items-center gap-2 border px-3 py-2 font-mono text-caption transition-colors duration-400 ${pillTone}`}
                aria-label={tSearch("open_label")}
              >
                <Search size={12} />
                <span
                  className="hidden lg:inline tracking-widest uppercase"
                  style={{ fontSize: "10px" }}
                >
                  ⌘K
                </span>
              </button>
              <Link
                href={pathname}
                locale={altLocale as "es" | "en"}
                className={`border px-3 py-2 font-mono text-caption tracking-widest transition-colors duration-400 ${pillTone}`}
              >
                {altLabel}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`xl:hidden -mr-2 p-2 transition-colors duration-400 ${quietTone}`}
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Avance de lectura: el canto inferior del header se llena de oro
            conforme baja la página, y le da un borde definido desde arriba. */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-600 ${trackTone}`}
        >
          <div
            className={`h-full origin-left transition-colors duration-600 ${progressTone}`}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-void/98 backdrop-blur-sm transition-all duration-600 xl:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col justify-center items-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-1 font-display text-display-sm font-light text-text1 hover:text-gold transition-colors duration-400"
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
