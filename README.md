# Phasma MX

Archivo científico de referencia para el orden Phasmatodea (insectos palo) en México y América Latina. Sitio editorial bilingüe (ES/EN) construido con Next.js 15, Sanity CMS y diseño oscuro tipográfico.

## Stack

- **Next.js 15** — App Router, React 19, TypeScript
- **Tailwind CSS** — Sistema de diseño personalizado con tokens de color
- **Sanity v3** — CMS headless para especies, artículos, expediciones y publicaciones
- **next-intl v4** — Rutas bilingües `/es` y `/en`
- **GSAP + ScrollTrigger** — Animaciones editoriales en scroll
- **Lucide React** — Sistema de íconos

## Estructura del proyecto

```
phasmex/
├── design-system/        # Especificaciones de diseño (tipografía, color, componentes)
├── sanity/
│   └── schemas/          # Esquemas CMS: species, article, expedition, publication, author
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Layout raíz con fuentes y metadata
│   │   └── [locale]/     # Rutas localizadas (es/en)
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   └── sections/     # Hero, FeaturedSpecies, PhasmidsIntro, LatestArticles, CatalogCTA
│   ├── i18n/             # Configuración next-intl, mensajes ES/EN
│   └── lib/sanity/       # Cliente, image builder, queries GROQ
└── middleware.ts         # Redirección de rutas por idioma
```

## Instalación

```bash
npm install
```

Copia las variables de entorno:

```bash
cp .env.example .env.local
```

Configura `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=tu-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige automáticamente a `/es`.

## Sanity Studio

Para acceder al CMS en desarrollo:

```bash
npx sanity dev
```

O visita `/studio` si está configurado como ruta embebida.

## Secciones del homepage

| Sección | Descripción |
|---|---|
| `Hero` | Imagen full-screen con animación GSAP y parallax |
| `FeaturedSpecies` | Grid 3×2 de especímenes con cards hover |
| `PhasmidsIntro` | Texto editorial + estadísticas + imagen con parallax |
| `LatestArticles` | Artículo destacado + lista lateral |
| `CatalogCTA` | Llamada a acción con stats del catálogo |

## Tipografía

- **Cormorant Garamond** — Títulos display
- **DM Sans** — Texto UI y cuerpo
- **Space Mono** — Nombres científicos y etiquetas taxonómicas

## Colores principales

| Token | Valor | Uso |
|---|---|---|
| `void` | `#0A0A0A` | Fondo principal |
| `surface` | `#111111` | Cards y superficies |
| `gold` | `#C8B97A` | Acento, nombres científicos |
| `text1` | `#F0EBE0` | Títulos |
| `text2` | `#B8B0A0` | Cuerpo de texto |
| `text3` | `#6B6560` | Subtítulos y metadata |
