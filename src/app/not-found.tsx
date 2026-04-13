/**
 * Root-level not-found — catches 404s outside any [locale] segment.
 * Renders without Header/Footer (no NextIntlClientProvider available here),
 * so it uses inline minimal styling consistent with the design system.
 */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function RootNotFound() {
  return (
    <html lang="es">
      <body style={{ background: "#0A0A0A", color: "#F0EBE0", margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.12em", color: "#C8B97A", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Phasma MX · 404
            </p>
            <h1 style={{ fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 300, lineHeight: 1, margin: "0 0 1.5rem", color: "#F0EBE0" }}>
              404
            </h1>
            <p style={{ color: "#A09880", marginBottom: "2.5rem", lineHeight: 1.7 }}>
              Página no encontrada. El archivo completo está en{" "}
              <strong style={{ color: "#F0EBE0" }}>/es</strong>.
            </p>
            <Link
              href="/es"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#C8B97A", color: "#0A0A0A", padding: "12px 24px", fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
            >
              Ir al inicio
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
