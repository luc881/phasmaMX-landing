import { useTranslations } from "next-intl";
import Link from "next/link";

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

          {/* Links */}
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-6">
              Archivo
            </p>
            <nav className="flex flex-col gap-3">
              {[
                ["Catálogo de especies", "/es/especies"],
                ["Artículos de divulgación", "/es/articulos"],
                ["Expediciones de campo", "/es/expediciones"],
                ["Publicaciones científicas", "/es/publicaciones"],
              ].map(([label, href]) => (
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

          {/* Proyecto */}
          <div>
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-6">
              Proyecto
            </p>
            <nav className="flex flex-col gap-3">
              {[
                ["Acerca de Phasma MX", "/es/acerca-de"],
                ["Colaborar", "/es/colaborar"],
                ["Contacto", "/es/contacto"],
              ].map(([label, href]) => (
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
