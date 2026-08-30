import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Link } from "@/i18n/navigation";

/**
 * Renderiza el Portable Text que devuelve Sanity (`description` de especie,
 * `bodyEs`/`bodyEn` de artículo) con el vocabulario del sistema de diseño.
 *
 * Los estilos son los de superficie oscura, que es donde viven los artículos y
 * las fichas. Si algún día se compone sobre pliego claro hará falta una
 * variante: `gold` no pasa contraste sobre papel.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-sans text-body-md text-text2 leading-relaxed mb-6">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-display-sm font-light text-text1 mt-14 mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-mono text-caption uppercase tracking-widest text-gold mt-12 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pull-quote my-12">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2 pl-5 list-disc marker:text-gold-dim">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 space-y-2 pl-5 list-decimal marker:text-gold-dim">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-sans text-body-md text-text2 leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="font-sans text-body-md text-text2 leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-text1 font-medium">{children}</strong>,
    // Los nombres científicos van en cursiva por convención taxonómica, y en
    // este archivo además cambian de familia tipográfica.
    em: ({ children }) => <em className="font-mono text-gold not-italic italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-mono-sm text-gold bg-surface px-1.5 py-0.5">{children}</code>
    ),
    link: ({ children, value }) => {
      const href = String(value?.href ?? "");
      // Interno vs externo: el interno pasa por el Link con prefijo de idioma.
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="text-gold underline underline-offset-4 hover:text-text1 transition-colors">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-4 hover:text-text1 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = value?.asset?.url;
      if (!url) return null;
      return (
        <figure className="my-12">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/2" }}>
            <Image
              src={url}
              alt={value.alt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 720px"
            />
          </div>
          {(value.caption || value.credit) && (
            <figcaption className="mt-3 flex items-start justify-between gap-4">
              <span className="font-mono text-caption text-text3 italic">{value.caption}</span>
              {value.credit && (
                <span className="font-mono text-caption text-text3 shrink-0">{value.credit}</span>
              )}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function ProseBlocks({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
