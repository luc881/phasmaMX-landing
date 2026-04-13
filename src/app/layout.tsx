import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Phasma MX",
    default: "Phasma MX — Archivo de Phasmatodea en México y América Latina",
  },
  description:
    "El archivo científico de referencia sobre insectos palo (Phasmatodea) en México y América Latina. Catálogo de especies, artículos de divulgación y expediciones de campo.",
  keywords: ["phasmatodea", "insecto palo", "fásmidos", "México", "entomología", "biología"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Phasma MX",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
