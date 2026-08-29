import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type SectionPageLink = {
  href: string;
  /** Etiqueta corta en mono dorado. */
  label: string;
  /** Qué encuentra la persona al entrar. */
  desc: string;
};

type Props = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  /** Uno o más párrafos; el primero se compone en cuerpo grande. */
  body: string[];
  links?: SectionPageLink[];
};

/**
 * Página de sección del archivo: mismo compás que la de Expediciones, que era
 * la única que existía. Sirve tanto de índice (cuando recibe `links` a sus
 * subsecciones) como de aviso de sección en desarrollo.
 */
export default function SectionPage({
  icon: Icon,
  eyebrow,
  title,
  body,
  links,
}: Props) {
  return (
    <div className="min-h-screen flex items-center">
      <div className="container-site py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 flex justify-center lg:justify-start lg:sticky lg:top-32">
            <div className="w-32 h-32 border border-border flex items-center justify-center">
              <Icon size={48} strokeWidth={0.75} className="text-gold opacity-60" />
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
              {eyebrow}
            </p>

            <div className="h-px bg-gold w-16 mb-8" />

            <h1 className="font-display text-display-lg font-light text-text1 mb-6">
              {title}
            </h1>

            {body.map((paragraph, i) => (
              <p
                key={i}
                className={`font-sans text-text2 leading-relaxed max-w-xl ${
                  i === 0 ? "text-body-lg mb-4" : "text-body-md mb-4"
                } ${i === body.length - 1 ? "mb-12" : ""}`}
              >
                {paragraph}
              </p>
            ))}

            {links && links.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 border border-border px-6 py-4 hover:border-gold hover:bg-surface transition-all duration-300 group"
                  >
                    <div>
                      <p className="font-mono text-caption text-gold uppercase tracking-widest mb-0.5">
                        {link.label}
                      </p>
                      <p className="font-sans text-body-md text-text2 group-hover:text-text1 transition-colors duration-300">
                        {link.desc}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0 ml-auto"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
