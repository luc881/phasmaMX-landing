import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-32">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-4">
              <span className="font-display text-xl font-light tracking-[0.15em] text-text1 uppercase">
                Phasma
              </span>
              <span className="font-mono text-caption text-gold tracking-widest">
                MX · PHASMATODEA
              </span>
            </div>
            <p className="font-sans text-body-md text-text2 max-w-xs leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Archive links */}
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-6">
              {t("col_archive")}
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { label: t("links.catalog"),      href: "/especies" },
                { label: t("links.articles"),     href: "/articulos" },
                { label: t("links.expeditions"),  href: "/expediciones" },
                { label: t("links.publications"), href: "/publicaciones" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-sans text-body-md text-text2 hover:text-text1 transition-colors duration-400"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Project links */}
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-6">
              {t("col_project")}
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { label: t("links.about"),       href: "/acerca-de" },
                { label: t("links.collaborate"),  href: "/colaborar" },
                { label: t("links.contact"),      href: "/contacto" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-sans text-body-md text-text2 hover:text-text1 transition-colors duration-400"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-caption text-text3 tracking-wide">
            © {year} Phasma MX. {t("rights")}
          </p>
          <p className="font-mono text-caption text-text3 tracking-wide">
            {t("credits")}
          </p>
        </div>
      </div>
    </footer>
  );
}
