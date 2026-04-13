"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  caption: string;
  credit: string;
}

export default function SpeciesGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? 0 : Math.min(i + 1, images.length - 1)));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, images.length]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="group relative bg-void overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            style={{ aspectRatio: "4/3" }}
            aria-label={img.caption}
          >
            <Image
              src={img.src}
              alt={img.caption}
              fill
              className="object-cover transition-transform duration-600 group-hover:scale-105"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-void/0 group-hover:bg-void/30 transition-colors duration-400" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-t from-void">
              <p className="font-mono text-caption text-text2 line-clamp-1">{img.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/95 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-text2 hover:text-gold transition-colors duration-300 z-10"
            onClick={() => setActiveIndex(null)}
            aria-label="Cerrar galería"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-caption text-text3">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {activeIndex > 0 && (
            <button
              className="absolute left-4 lg:left-8 text-text2 hover:text-gold transition-colors duration-300 z-10 p-2"
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => Math.max((i ?? 1) - 1, 0)); }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>
          )}

          {/* Next */}
          {activeIndex < images.length - 1 && (
            <button
              className="absolute right-4 lg:right-8 text-text2 hover:text-gold transition-colors duration-300 z-10 p-2"
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => Math.min((i ?? 0) + 1, images.length - 1)); }}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].caption}
                fill
                className="object-contain"
                sizes="80vw"
                quality={90}
              />
            </div>
            {/* Caption */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <p className="font-mono text-caption text-text2 italic">
                {images[activeIndex].caption}
              </p>
              <p className="font-mono text-caption text-text3 shrink-0">
                {images[activeIndex].credit}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
