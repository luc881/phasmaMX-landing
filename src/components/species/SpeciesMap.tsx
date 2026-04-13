"use client";

import { useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Calendar, User, FileText } from "lucide-react";
import type { SpeciesLocation } from "@/lib/placeholder/species";

gsap.registerPlugin(ScrollTrigger);

const GEO_URL = "/geo/mx-states.json";

// Mexico states name → ISO id mapping for highlighting
const STATE_IDS: Record<string, string> = {
  "Aguascalientes":   "MX-AGU",
  "Baja California":  "MX-BCN",
  "Baja California Sur": "MX-BCS",
  "Campeche":         "MX-CAM",
  "Chiapas":          "MX-CHP",
  "Chihuahua":        "MX-CHH",
  "Ciudad de México": "MX-CMX",
  "Coahuila":         "MX-COA",
  "Colima":           "MX-COL",
  "Durango":          "MX-DUR",
  "Guanajuato":       "MX-GUA",
  "Guerrero":         "MX-GRO",
  "Hidalgo":          "MX-HID",
  "Jalisco":          "MX-JAL",
  "México":           "MX-MEX",
  "Michoacán":        "MX-MIC",
  "Morelos":          "MX-MOR",
  "Nayarit":          "MX-NAY",
  "Nuevo León":       "MX-NLE",
  "Oaxaca":           "MX-OAX",
  "Puebla":           "MX-PUE",
  "Querétaro":        "MX-QUE",
  "Quintana Roo":     "MX-ROO",
  "San Luis Potosí":  "MX-SLP",
  "Sinaloa":          "MX-SIN",
  "Sonora":           "MX-SON",
  "Tabasco":          "MX-TAB",
  "Tamaulipas":       "MX-TAM",
  "Tlaxcala":         "MX-TLA",
  "Veracruz":         "MX-VER",
  "Yucatán":          "MX-YUC",
  "Zacatecas":        "MX-ZAC",
};

interface SpeciesMapProps {
  locations: SpeciesLocation[];
  highlightedStates: string[];
  scientificName: string;
}

export default function SpeciesMap({
  locations,
  highlightedStates,
  scientificName,
}: SpeciesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<SVGGElement[]>([]);
  const [activeLocation, setActiveLocation] = useState<SpeciesLocation | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const highlightedIds = new Set(
    highlightedStates
      .map((s) => STATE_IDS[s])
      .filter(Boolean)
  );

  // Animate map reveal + markers on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-in the whole map container
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 32,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        onComplete: () => setMapReady(true),
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate markers once map is ready
  useEffect(() => {
    if (!mapReady) return;
    const dots = containerRef.current?.querySelectorAll<SVGCircleElement>(".marker-dot");
    const pulses = containerRef.current?.querySelectorAll<SVGCircleElement>(".marker-pulse");

    if (dots && dots.length > 0) {
      gsap.fromTo(
        dots,
        { scale: 0, transformOrigin: "center center" },
        {
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.6)",
          stagger: 0.15,
          delay: 0.3,
        }
      );
    }

    if (pulses && pulses.length > 0) {
      gsap.to(pulses, {
        scale: 2.5,
        opacity: 0,
        duration: 1.8,
        ease: "power2.out",
        stagger: { each: 0.15, repeat: -1 },
        transformOrigin: "center center",
      });
    }
  }, [mapReady]);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Map */}
      <div className="relative bg-surface border border-border overflow-hidden">
        {/* Dark vignette corners */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "radial-gradient(ellipse at center, transparent 60%, rgba(10,10,10,0.7) 100%)"
          }}
        />

        {/* Grid lines overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(200,185,122,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(200,185,122,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-102, 24], scale: 1050 }}
          style={{ width: "100%", height: "auto" }}
          viewBox="0 0 800 520"
        >
          {/* Ocean background */}
          <rect width="800" height="520" fill="#0D0D0D" />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = highlightedIds.has(geo.properties.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isHighlighted ? "#1E2A1A" : "#141414",
                        stroke: "#2A2A2A",
                        strokeWidth: 0.6,
                        outline: "none",
                      },
                      hover: {
                        fill: isHighlighted ? "#253320" : "#1A1A1A",
                        stroke: "#3A3A3A",
                        strokeWidth: 0.8,
                        outline: "none",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Markers */}
          {locations.map((loc, i) => (
            <Marker
              key={i}
              coordinates={loc.coords}
              onClick={() => setActiveLocation(loc === activeLocation ? null : loc)}
            >
              {/* Outer pulse ring */}
              <circle
                className="marker-pulse"
                r={10}
                fill="none"
                stroke="#C8B97A"
                strokeWidth={1.5}
                opacity={0.6}
              />
              {/* Second ring for depth */}
              <circle
                className="marker-pulse"
                r={10}
                fill="none"
                stroke="#C8B97A"
                strokeWidth={1}
                opacity={0.3}
                style={{ animationDelay: "0.6s" }}
              />
              {/* Core dot */}
              <circle
                className="marker-dot cursor-pointer"
                r={5}
                fill="#C8B97A"
                stroke="#0A0A0A"
                strokeWidth={1.5}
              />
              {/* Label */}
              <text
                x={0}
                y={-12}
                textAnchor="middle"
                fill="#C8B97A"
                fontSize={8}
                fontFamily="monospace"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {loc.municipality.length > 14 ? loc.municipality.slice(0, 12) + "…" : loc.municipality}
              </text>
            </Marker>
          ))}
        </ComposableMap>

        {/* Legend overlay */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 bg-void/80 backdrop-blur-sm border border-border px-3 py-2">
          {highlightedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-lichen/50" style={{ background: "#1E2A1A" }} />
              <span className="font-mono text-caption text-text3" style={{ fontSize: "10px" }}>
                Estado con registros
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold" />
            <span className="font-mono text-caption text-text3" style={{ fontSize: "10px" }}>
              Localidad registrada
            </span>
          </div>
        </div>

        {/* Scientific name watermark */}
        <div className="absolute top-3 right-3 z-20">
          <p className="font-mono text-caption text-text3 italic opacity-40" style={{ fontSize: "10px" }}>
            {scientificName}
          </p>
        </div>
      </div>

      {/* Location info cards */}
      <div>
        <p className="font-mono text-caption text-text3 uppercase tracking-widest mb-3">
          {locations.length} localidad{locations.length !== 1 ? "es" : ""} registrada{locations.length !== 1 ? "s" : ""}
        </p>
        <div className="space-y-2">
          {locations.map((loc, i) => (
            <button
              key={i}
              onClick={() => setActiveLocation(loc === activeLocation ? null : loc)}
              className={`w-full text-left border transition-all duration-300 ${
                activeLocation === loc
                  ? "border-gold bg-surface"
                  : "border-border bg-void hover:border-border2 hover:bg-surface"
              }`}
            >
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Number */}
                <span className="font-mono text-caption text-gold shrink-0 w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Location */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-gold shrink-0" />
                    <span className="font-sans text-body-md text-text1 truncate">
                      {loc.municipality}
                    </span>
                    <span className="font-mono text-caption text-text3 shrink-0">
                      · {loc.state}
                    </span>
                  </div>
                </div>

                {/* Date */}
                {loc.date && (
                  <span className="font-mono text-caption text-text3 shrink-0">
                    {loc.date}
                  </span>
                )}
              </div>

              {/* Expanded detail */}
              {activeLocation === loc && (
                <div className="px-4 pb-4 pt-1 border-t border-border space-y-2">
                  {loc.collector && (
                    <div className="flex items-start gap-2">
                      <User size={11} className="text-text3 mt-0.5 shrink-0" />
                      <span className="font-mono text-caption text-text2">
                        Colectado por: {loc.collector}
                      </span>
                    </div>
                  )}
                  {loc.note && (
                    <div className="flex items-start gap-2">
                      <FileText size={11} className="text-text3 mt-0.5 shrink-0" />
                      <span className="font-mono text-caption text-text2">{loc.note}</span>
                    </div>
                  )}
                  {loc.date && (
                    <div className="flex items-start gap-2">
                      <Calendar size={11} className="text-text3 mt-0.5 shrink-0" />
                      <span className="font-mono text-caption text-text2">
                        Fecha de registro: {loc.date}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin size={11} className="text-text3 mt-0.5 shrink-0" />
                    <span className="font-mono text-caption text-text3">
                      {loc.coords[1].toFixed(4)}°N, {Math.abs(loc.coords[0]).toFixed(4)}°O
                    </span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
