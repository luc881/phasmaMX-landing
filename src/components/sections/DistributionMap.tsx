"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Estados de México con registros de fásmidos (placeholder)
const MEXICO_STATES_WITH_RECORDS = [
  { name: "Chiapas", count: 32, highlight: true },
  { name: "Veracruz", count: 28, highlight: true },
  { name: "Oaxaca", count: 24, highlight: true },
  { name: "Guerrero", count: 18, highlight: false },
  { name: "Jalisco", count: 14, highlight: false },
  { name: "Michoacán", count: 12, highlight: false },
  { name: "Tabasco", count: 11, highlight: false },
  { name: "Hidalgo", count: 9, highlight: false },
  { name: "Puebla", count: 8, highlight: false },
  { name: "Quintana Roo", count: 7, highlight: false },
  { name: "Yucatán", count: 6, highlight: false },
  { name: "Campeche", count: 5, highlight: false },
];

export default function DistributionMap() {
  const t = useTranslations("distribution");
  const sectionRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".map-reveal").forEach((el: HTMLElement) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // Dots de estados aparecen en stagger
      const dots = dotsRef.current?.querySelectorAll(".state-dot");
      if (dots) {
        gsap.from(dots, {
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "back.out(1.4)",
          stagger: 0.08,
          scrollTrigger: {
            trigger: dotsRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const maxCount = Math.max(...MEXICO_STATES_WITH_RECORDS.map((s) => s.count));

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-36 border-t border-border"
    >
      <div className="container-site">
        {/* Header */}
        <div className="map-reveal mb-16">
          <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
            México · Registros de campo
          </p>
          <h2 className="font-display text-display-md font-light text-text1 mb-4">
            {t("title")}
          </h2>
          <p className="font-sans text-body-md text-text2 max-w-xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Mapa SVG placeholder de México */}
          <div className="map-reveal lg:col-span-7">
            <div
              className="relative bg-surface border border-border overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              {/* Silueta simplificada de México en SVG */}
              <svg
                viewBox="0 0 500 380"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Fondo del mapa */}
                <rect width="500" height="380" fill="#111111" />

                {/* Silueta aproximada de México */}
                <path
                  d="M 60 60 L 180 50 L 240 70 L 280 60 L 340 80 L 380 70 L 420 90 L 440 130 L 430 160 L 400 180 L 380 220 L 360 270 L 340 300 L 310 330 L 280 350 L 260 360 L 240 340 L 220 320 L 200 290 L 180 260 L 160 240 L 140 220 L 120 200 L 100 180 L 80 160 L 60 140 L 50 110 L 60 80 Z"
                  fill="#1A1A1A"
                  stroke="#2A2A2A"
                  strokeWidth="1"
                />

                {/* Grid de referencia */}
                <line x1="50" y1="190" x2="450" y2="190" stroke="#2A2A2A" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1="250" y1="50" x2="250" y2="370" stroke="#2A2A2A" strokeWidth="0.5" strokeDasharray="4,4" />

                {/* Puntos de registros (aproximados) */}
                <circle cx="360" cy="300" r="6" fill="#C8B97A" opacity="0.9" className="state-dot" />
                <circle cx="320" cy="200" r="7" fill="#C8B97A" opacity="0.9" className="state-dot" />
                <circle cx="260" cy="160" r="6" fill="#C8B97A" opacity="0.7" className="state-dot" />
                <circle cx="200" cy="180" r="5" fill="#C8B97A" opacity="0.6" className="state-dot" />
                <circle cx="160" cy="140" r="5" fill="#C8B97A" opacity="0.6" className="state-dot" />
                <circle cx="220" cy="140" r="4" fill="#C8B97A" opacity="0.5" className="state-dot" />
                <circle cx="350" cy="180" r="4" fill="#C8B97A" opacity="0.5" className="state-dot" />
                <circle cx="380" cy="240" r="5" fill="#C8B97A" opacity="0.6" className="state-dot" />
                <circle cx="300" cy="280" r="4" fill="#C8B97A" opacity="0.5" className="state-dot" />
                <circle cx="240" cy="220" r="4" fill="#C8B97A" opacity="0.4" className="state-dot" />
                <circle cx="190" cy="220" r="3" fill="#C8B97A" opacity="0.4" className="state-dot" />
                <circle cx="170" cy="200" r="3" fill="#C8B97A" opacity="0.4" className="state-dot" />

                {/* Label */}
                <text x="250" y="30" textAnchor="middle" fill="#606050" fontSize="10" fontFamily="monospace">
                  MÉXICO · MAPA PRELIMINAR
                </text>
              </svg>

              {/* Overlay de placeholder */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 p-4 bg-void/80 border border-border">
                <MapPin size={16} className="text-gold shrink-0" />
                <p className="font-mono text-caption text-text2">
                  {t("placeholder")}
                </p>
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold opacity-90" />
                <span className="font-mono text-caption text-text3">Mayor densidad de registros</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold opacity-40" />
                <span className="font-mono text-caption text-text3">Registros aislados</span>
              </div>
            </div>
          </div>

          {/* Tabla de estados */}
          <div ref={dotsRef} className="map-reveal lg:col-span-5">
            <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-6">
              Estados con mayor riqueza
            </p>
            <div className="space-y-0">
              {MEXICO_STATES_WITH_RECORDS.map((state, i) => (
                <div
                  key={state.name}
                  className="state-dot flex items-center gap-4 py-3 border-b border-border last:border-b-0"
                >
                  <span className="font-mono text-caption text-text3 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-sans text-body-md flex-1 ${
                      state.highlight ? "text-text1" : "text-text2"
                    }`}
                  >
                    {state.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Barra proporcional */}
                    <div className="w-20 h-px bg-border2 relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-gold"
                        style={{ width: `${(state.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-caption text-text3 w-8 text-right shrink-0">
                      {state.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-caption text-text3 mt-4">
              Total de registros documentados: {MEXICO_STATES_WITH_RECORDS.reduce((a, s) => a + s.count, 0)} spp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
