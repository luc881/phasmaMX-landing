"use client";

// ponytail: API imperativa (ref.show/hide) en vez de props+estado por fila —
// una lista de cientos de filas no puede permitirse un setState en cada
// mousemove ni un listener por fila. El propio componente escucha el
// pointermove (uno solo, global) mientras está visible, y escribe el
// transform directo al DOM en rAF: cero renders de React durante el arrastre.

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";

export type SpeciesPreviewData = {
  src: string | null;
  alt: string;
  catalogNum?: string;
};

export type SpeciesHoverPreviewHandle = {
  /**
   * Muestra la previsualización con los datos de una especie. Pasa el evento
   * de puntero de la fila (onMouseEnter/onPointerEnter) para que aparezca de
   * inmediato donde está el cursor en vez de animarse desde la posición
   * anterior.
   */
  show: (data: SpeciesPreviewData, event?: { clientX: number; clientY: number }) => void;
  hide: () => void;
};

const WIDTH = 280;
const HEIGHT = Math.round(WIDTH * 1.5); // proporción 2:3, igual que .specimen-image
const CURSOR_OFFSET = 28;
const EDGE_MARGIN = 12;
const LERP_FACTOR = 0.18;
const HIDE_DELAY_MS = 300;

const SpeciesHoverPreview = forwardRef<SpeciesHoverPreviewHandle>((_props, ref) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [item, setItem] = useState<SpeciesPreviewData | null>(null);
  const [visible, setVisible] = useState(false);

  // Todo lo que cambia por movimiento de cursor vive en refs, nunca en
  // estado de React, para no disparar renders en cada frame.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hasPositioned = useRef(false);
  const rafId = useRef<number | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouch = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    // Puntero sin precisión fina (touch) → esto es decoración de escritorio,
    // nunca se engancha a eventos ni se muestra.
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const place = useCallback((x: number, y: number) => {
    let px = x + CURSOR_OFFSET;
    let py = y + CURSOR_OFFSET;
    // Si no cabe a la derecha/abajo, se coloca al otro lado del cursor.
    if (px + WIDTH + EDGE_MARGIN > window.innerWidth) px = x - CURSOR_OFFSET - WIDTH;
    if (py + HEIGHT + EDGE_MARGIN > window.innerHeight) py = y - CURSOR_OFFSET - HEIGHT;
    // Cinturón de seguridad: nunca se sale de la ventana.
    px = Math.min(Math.max(px, EDGE_MARGIN), window.innerWidth - WIDTH - EDGE_MARGIN);
    py = Math.min(Math.max(py, EDGE_MARGIN), window.innerHeight - HEIGHT - EDGE_MARGIN);
    return { x: px, y: py };
  }, []);

  const writeTransform = useCallback((x: number, y: number) => {
    const el = elRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const tick = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * LERP_FACTOR;
    current.current.y += (target.current.y - current.current.y) * LERP_FACTOR;
    writeTransform(current.current.x, current.current.y);
    rafId.current = requestAnimationFrame(tick);
  }, [writeTransform]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      target.current = place(e.clientX, e.clientY);
    },
    [place]
  );

  useImperativeHandle(
    ref,
    () => ({
      show(data, event) {
        if (isTouch.current) return;
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
        setItem(data);
        setVisible(true);

        if (event) {
          const pos = place(event.clientX, event.clientY);
          target.current = pos;
          // Sólo salta al punto de entrada la primera vez; si ya estaba
          // visible (cambio de fila), deja que el lerp la lleve — así no
          // hay salto al cambiar de especie, sólo cambia la imagen.
          if (!hasPositioned.current) current.current = pos;
        }
        hasPositioned.current = true;

        if (reducedMotion.current) {
          // Sin seguimiento animado: se fija donde entró el cursor y no
          // vuelve a moverse. Evita introducir movimiento continuo en
          // pantalla para quien pidió reducirlo, sin perder la previsualización.
          if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
          }
          writeTransform(target.current.x, target.current.y);
          return;
        }

        if (rafId.current === null) rafId.current = requestAnimationFrame(tick);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      },
      hide() {
        if (isTouch.current) return;
        setVisible(false);
        window.removeEventListener("pointermove", onPointerMove);
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        hideTimeout.current = setTimeout(() => {
          setItem(null);
          hasPositioned.current = false;
        }, HIDE_DELAY_MS);
      },
    }),
    [onPointerMove, place, tick, writeTransform]
  );

  // Limpieza total al desmontar.
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [onPointerMove]);

  return (
    <div
      ref={elRef}
      aria-hidden
      className={`fixed left-0 top-0 z-50 overflow-hidden rounded border border-border bg-surface pointer-events-none transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ width: WIDTH, height: HEIGHT, willChange: "transform" }}
    >
      {item?.src ? (
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes={`${WIDTH}px`}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-surface px-4 text-center">
          <span className="font-mono text-caption uppercase tracking-widest text-text3">
            Sin fotografía
          </span>
        </div>
      )}

      {item?.catalogNum && (
        <span className="absolute bottom-2 left-2 bg-void/80 px-1.5 py-0.5 font-mono text-caption text-gold">
          {item.catalogNum}
        </span>
      )}
    </div>
  );
});

SpeciesHoverPreview.displayName = "SpeciesHoverPreview";

export default SpeciesHoverPreview;
