type Props = {
  /** Las secciones alternan fondo: el filete tiene que seguirlas. */
  tone?: "dark" | "paper";
  className?: string;
};

/**
 * Filete ornamental: hairline — ◆ — hairline.
 *
 * Decoración pura, sin texto ni dato, así que va oculto a lectores de pantalla.
 * Para separadores que sí dicen algo (etiqueta + conteo) está `SectionRule`.
 */
export default function Ornament({ tone = "dark", className = "" }: Props) {
  const line = tone === "paper" ? "to-paper-border" : "to-border";
  const mark = tone === "paper" ? "border-gold-ink" : "border-gold-dim";

  return (
    <div aria-hidden className={`flex items-center gap-3 ${className}`}>
      <span className={`h-px flex-1 bg-gradient-to-r from-transparent ${line}`} />
      <span className={`h-1.5 w-1.5 rotate-45 border ${mark}`} />
      <span className={`h-px flex-1 bg-gradient-to-l from-transparent ${line}`} />
    </div>
  );
}
