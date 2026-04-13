# Phasma MX — Design System MASTER

> Archivo científico de alta gama · Museo editorial oscuro · Especímenes como protagonistas

---

## Filosofía Visual

Phasma MX no es un blog de naturaleza. Es un archivo científico de referencia.
Las especies se presentan como **artefactos a descubrir**: objetos de contemplación,
no tarjetas de contenido. La interfaz debe sentirse como el interior de un museo
natural de alta gama a medianoche.

---

## Paleta de Color

| Token               | Valor       | Uso                                          |
|---------------------|-------------|----------------------------------------------|
| `--color-void`      | `#0A0A0A`   | Fondo base — el vacío del laboratorio        |
| `--color-surface`   | `#111111`   | Superficies elevadas, cards                  |
| `--color-surface-2` | `#1A1A1A`   | Bordes suaves, separadores                   |
| `--color-border`    | `#2A2A2A`   | Bordes visibles                              |
| `--color-border-2`  | `#3A3A3A`   | Hover borders                                |
| `--color-text-1`    | `#F0EBE0`   | Texto principal — blanco cálido              |
| `--color-text-2`    | `#A09880`   | Texto secundario, metadatos                  |
| `--color-text-3`    | `#606050`   | Texto terciario, deshabilitado               |
| `--color-gold`      | `#C8B97A`   | Acento dorado — detalles, énfasis            |
| `--color-gold-dim`  | `#6B5E3A`   | Acento dorado apagado                        |
| `--color-lichen`    | `#4A6741`   | Verde liquen — naturaleza, especies          |
| `--color-amber`     | `#8B6914`   | Ámbar — conservación, alertas                |

---

## Tipografía

### Escala Tipográfica

| Rol              | Fuente              | Uso                                          |
|------------------|---------------------|----------------------------------------------|
| Display          | Cormorant Garamond  | Hero headlines, nombres en display           |
| Serif editorial  | Cormorant Garamond  | Cuerpo de artículos, citas                   |
| Scientific       | Space Mono          | Nombres científicos, taxonomía, datos        |
| UI / Navigation  | DM Sans             | Navegación, etiquetas, botones               |
| Body             | DM Sans             | Párrafos de interfaz, metadatos              |

### Tamaños Display

```
--text-display-xl: clamp(4rem, 10vw, 9rem)     /* Hero principal */
--text-display-lg: clamp(3rem, 7vw, 6rem)       /* Sección hero */
--text-display-md: clamp(2rem, 4vw, 3.5rem)     /* Subtítulos */
--text-display-sm: clamp(1.5rem, 3vw, 2.5rem)   /* Cards destacadas */
--text-body-lg:    1.25rem                       /* Cuerpo largo */
--text-body-md:    1rem                          /* Cuerpo estándar */
--text-caption:    0.75rem                       /* Metadatos, etiquetas */
--text-mono:       0.875rem                      /* Taxonomía, código */
```

---

## Espaciado

Sistema basado en múltiplos de 8px con escala logarítmica para pantallas grandes.

```
--space-1:  0.25rem   (4px)
--space-2:  0.5rem    (8px)
--space-3:  0.75rem   (12px)
--space-4:  1rem      (16px)
--space-6:  1.5rem    (24px)
--space-8:  2rem      (32px)
--space-12: 3rem      (48px)
--space-16: 4rem      (64px)
--space-24: 6rem      (96px)
--space-32: 8rem      (128px)
```

---

## Componentes Clave

### Specimen Card
- Fondo: `--color-void`
- Imagen: full-bleed sin padding
- Nombre científico: Space Mono, tamaño caption, `--color-gold`
- Nombre común: Cormorant, tamaño display-sm, `--color-text-1`
- Hover: parallax sutil en imagen + reveal de metadatos
- Border: 1px `--color-border` → hover `--color-border-2`

### Section Divider
- Línea horizontal 1px `--color-border`
- Label centrado en Space Mono uppercase, `--color-text-3`
- Padding vertical: `--space-4`

### Taxonomy Badge
- Background: transparente
- Border: 1px `--color-gold-dim`
- Text: Space Mono, `--color-gold`, uppercase, letter-spacing wide
- Padding: 2px 8px

### Editorial Pull Quote
- Left border: 2px `--color-gold`
- Text: Cormorant Italic, `--text-display-sm`, `--color-text-1`
- Padding left: `--space-8`

---

## Animaciones (GSAP ScrollTrigger)

### Reglas Generales
- Duración base: 1.2s
- Easing: `power3.out` para entradas, `power2.inOut` para transiciones
- Stagger en grids: 0.15s entre elementos
- Threshold de trigger: `"top 80%"` para revelados, `"top 50%"` para parallax

### Patrones Definidos

**fadeReveal** — entrada estándar de elementos
```
from: { opacity: 0, y: 40 }
to:   { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
```

**specimenReveal** — cards de especies
```
from: { opacity: 0, scale: 0.96 }
to:   { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }
```

**heroTextReveal** — título hero
```
from: { opacity: 0, y: 80, skewY: 2 }
to:   { opacity: 1, y: 0, skewY: 0, duration: 1.6, ease: "expo.out" }
```

**parallaxImage** — imágenes con parallax
```
yPercent: -15, ease: "none", scrub: true
```

---

## Layout Grid

- **Desktop**: 12 columnas, gap 24px, max-width 1440px
- **Tablet**: 8 columnas, gap 20px
- **Mobile**: 4 columnas, gap 16px
- **Bleed**: Las imágenes hero ignoran el grid y van full-viewport

---

## Principios de Fotografía

1. Imágenes en formato 3:4 o 2:3 para especímenes verticales (insectos palo)
2. Fondo oscuro preferido en fotografías de producto
3. Overlay gradient `from-void` en la parte inferior para texto legible
4. Nunca recortar en formato 16:9 — los insectos palo necesitan altura

---

## Anti-patrones Prohibidos

- No usar Inter como fuente principal
- No usar emojis como íconos de UI
- No usar MUI o cualquier component library con opinionated theming
- No usar bordes redondeados > 4px (sensación de laboratorio, no de app)
- No usar sombras drop-shadow en dark mode — usar borders en su lugar
- No usar colores brillantes o saturados (vibrancy destroys the editorial feel)
- No usar card hover con elevación — usar border reveal o imagen scale sutil

---

## Voz y Tono

- Español como idioma primario, inglés como paralelo científico
- Nombres científicos siempre en *cursiva* y `Space Mono`
- Nombres comunes en español primero, inglés entre paréntesis
- Tono: riguroso pero accesible — museo, no paper científico
- Sin jerga de startup, sin "descubre", sin "explora" como CTAs vacíos
