"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Home, BookOpen, Bug } from "lucide-react";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(codeRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 1.2,
        ease: "expo.out",
      })
        .from(".nf-line", { scaleX: 0, duration: 0.8, transformOrigin: "left" }, "-=0.6")
        .from(".nf-title", { opacity: 0, y: 30, duration: 1 }, "-=0.5")
        .from(".nf-body", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from(".nf-link", { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex items-center">
      <div className="container-site py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left — 404 display */}
          <div className="lg:col-span-5">
            <span
              ref={codeRef}
              className="font-display font-light text-text1 block leading-none select-none"
              style={{ fontSize: "clamp(8rem, 20vw, 16rem)", opacity: 0.08 }}
            >
              404
            </span>
          </div>

          {/* Right — content */}
          <div className="lg:col-span-7">
            <div className="nf-line h-px bg-gold mb-8" />

            <p className="font-mono text-caption text-gold uppercase tracking-widest mb-4">
              Phasmatodea · Página no encontrada
            </p>

            <h1 className="nf-title font-display text-display-md font-light text-text1 mb-6 text-balance">
              Esta especie no está en el catálogo
            </h1>

            <p className="nf-body font-sans text-body-lg text-text2 leading-relaxed mb-12 max-w-lg">
              La página que buscas no existe o ha sido movida. Quizás el espécimen
              fue reclasificado, o simplemente está pendiente de documentación.
            </p>

            {/* Navigation links */}
            <div className="space-y-3">
              <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-5">
                Continúa explorando
              </p>

              {[
                { href: "/es", label: "Inicio", sub: "Página principal del archivo", icon: <Home size={14} /> },
                { href: "/es/especies", label: "Catálogo de especies", sub: "240+ fásmidos documentados", icon: <Bug size={14} /> },
                { href: "/es/articulos", label: "Artículos", sub: "Expediciones, taxonomía y divulgación", icon: <BookOpen size={14} /> },
              ].map(({ href, label, sub, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="nf-link flex items-center justify-between gap-4 border border-border px-6 py-4 hover:border-gold hover:bg-surface transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-text3 group-hover:text-gold transition-colors duration-300">
                      {icon}
                    </span>
                    <div>
                      <p className="font-sans text-body-md text-text1 group-hover:text-gold transition-colors duration-300">
                        {label}
                      </p>
                      <p className="font-mono text-caption text-text3 mt-0.5">{sub}</p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-text3 group-hover:text-gold transition-colors duration-300 shrink-0"
                  />
                </Link>
              ))}
            </div>

            {/* Taxonomic decoration */}
            <p className="font-mono text-caption text-text3 mt-10 opacity-40">
              Orden Phasmatodea · Error 404 · Registro no encontrado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
