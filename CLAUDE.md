# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (localhost:3000 → redirects to /es)
npm run build        # production build — the only real typecheck (tsc --noEmit is not wired up)
npm start            # serve the production build
npx sanity dev       # Sanity Studio standalone (the app also embeds it at /studio)
```

No test runner and no ESLint config exist — `npm run lint` will drop into Next's interactive
setup prompt, so don't run it. Verify changes with `npm run build`.

Two traps that cost real time in this repo:

- **Never run `npm run build` while `npm run dev` is running.** They share `.next` and the
  build dies with a misleading `PageNotFoundError: Cannot find module for page ...`. Stop the
  dev server, build, restart it.
- **Restart the dev server after editing `tailwind.config.ts`.** New theme tokens are not
  hot-reloaded: the utilities silently generate nothing (a `bg-*` resolves to transparent, a
  `text-*` just inherits) instead of erroring, so the page can look almost right and be wrong.

`.env.local` is required once Sanity is connected — see `.env.example` for the full list and
what each var is for. Nothing there is needed to build or run the site today, because content
still comes from `src/lib/placeholder/`. `SANITY_REVALIDATE_SECRET` is the webhook's shared
secret and is *not* the API token; without it `/api/revalidate` rejects everything (fails
closed, by design).

## Architecture

Next.js 16 App Router (Turbopack) + React 19, bilingual editorial site about Phasmatodea
(stick insects). Sanity 6 / next-sanity 13.

### The site currently runs on placeholder data, not Sanity

`src/lib/placeholder/species.ts` and `articles.ts` export `PLACEHOLDER_SPECIES` /
`PLACEHOLDER_ARTICLES` with hand-written TypeScript interfaces. **Every page, the catalog,
global search, and `sitemap.ts` read from these files.** The Sanity layer
(`sanity/schemas/*`, `src/lib/sanity/queries.ts` GROQ queries, `sanityClient`) is fully
written but not yet consumed by any component. When wiring a page to Sanity, expect the
placeholder interface and the GROQ projection to diverge — they were written independently.

### i18n (next-intl v4)

- Locales `es` (default) and `en`, defined once in `src/i18n/routing.ts`.
- `src/proxy.ts` prefixes all non-asset routes; `src/i18n/request.ts` loads
  `src/i18n/messages/{locale}.json`. (Next 16 renamed the `middleware` file convention to
  `proxy`; the old name still works but warns.)
- **Always import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation`**,
  never from `next/link` / `next/navigation` — locale prefixing depends on it.
- URL segments are Spanish in both locales (`/en/especies`, `/en/articulos`). There is no
  `pathnames` map; adding one means renaming route directories too.
- Two separate translation mechanisms coexist:
  - UI chrome → `useTranslations()` against the message JSON (top-level keys are per-section:
    `nav`, `hero`, `catalog`, `species_detail`, `search`, …). Add every key to **both**
    `es.json` and `en.json`.
  - Content → suffixed fields on the data object, selected inline:
    `locale === "en" && x.commonNameEn ? x.commonNameEn : x.commonNameEs`. Same convention in
    the Sanity schemas (`titleEs`/`titleEn`, `excerpt`/`excerptEn`, `bodyEs`/`bodyEn`).
- **`src/app/layout.tsx` is a pass-through that returns `children` — it renders no
  `<html>`/`<body>`.** Those live in `src/app/[locale]/layout.tsx`, together with the fonts and
  the `globals.css` import, so the locale comes from `params` instead of `getLocale()`.
  This is load-bearing: `getLocale()` reads request headers, and because the root layout sits
  above the `[locale]` segment it runs before `setRequestLocale`, which marks the whole tree
  dynamic. Under Next 16 that silently dropped the site from 87 prerendered pages to 0 while
  the build still passed. Routes that fall outside `[locale]` (`src/app/not-found.tsx`,
  `src/app/studio/`) supply their own `<html>`/`<body>`.
- `src/app/[locale]/layout.tsx` calls `setRequestLocale(locale)` and wraps children in
  `NextIntlClientProvider` + Header / GlobalSearch / Footer. Every page calls
  `setRequestLocale` too — dropping it re-breaks static rendering.

### Design system

`design-system/MASTER.md` is the spec of record. Its tokens are implemented twice and must
stay in sync: CSS custom properties in `src/app/globals.css` (`:root`) and Tailwind theme
extensions in `tailwind.config.ts`.

The palette has two halves. **Dark** (`void`, `surface`, `border`, `text1..3`, `gold`,
`gold-dim`) is the default. **Paper** (`paper`, `paper-2`, `paper-border`, `ink-2`, `ink-3`,
`gold-ink`) is for the light sections that alternate with it — mark those with
`data-surface="paper"` plus the `.surface-paper` class, because `Header.tsx` probes for that
attribute on scroll to invert its own glass tint. Contrast is not interchangeable between
halves: `gold` scores 1.6 on paper and `gold-dim` drops to 3.75 behind the translucent bar,
which is why `gold-ink` exists. Re-check any new pairing rather than assuming.

Build UI from the existing vocabulary rather than raw utilities: color tokens (`void`,
`surface`, `border`, `text1..3`, `gold`, `gold-dim`, `lichen`, `amber`), the `display-*` /
`body-*` / `caption` / `mono-sm` type scale, the three font families (`font-display`
Cormorant for headlines, `font-mono` Space Mono for scientific names and taxonomy,
`font-sans` DM Sans for UI), and the `@layer components` classes in `globals.css`
(`.container-site`, `.taxonomy-badge`, `.section-divider`, `.specimen-image`, `.btn-primary`,
`.btn-outline`, `.catalog-number`, `.pull-quote`). Radii are near-square by design (2px default).

### Animation

Almost every section is a `"use client"` component that registers GSAP + ScrollTrigger at
module scope and runs its timeline inside `useEffect` wrapped in `gsap.context(() => {...})`,
returning `ctx.revert()`. Follow that pattern — the shared easings are `power3.out` /
`expo.out`, mirrored in Tailwind as `ease-power3-out` / `ease-expo-out`. `framer-motion` is
installed but GSAP is the convention for scroll work.

### Sanity

Nothing in `src/app` reads from Sanity yet — the CMS plumbing exists but the pages still use
`src/lib/placeholder/`. What is wired: `/studio` (embedded Studio), `/api/revalidate` (publish
webhook), `/api/draft-mode/{enable,disable}` (preview), `sanityFetch()` in
`src/lib/sanity/client.ts`, and GROQ projections in `queries.ts` shaped to match the
placeholder interfaces so swapping a page's data source is not a rewrite.
`scripts/load-placeholder-to-sanity.ts` seeds a dataset from the placeholder files (dry-run by
default; `--execute` to write).

Four things that will bite:

- **`src/app/studio/[[...tool]]/page.tsx` must keep `"use client"`.** Without it
  `sanity.config.ts` lands in the Server Component graph, Turbopack resolves `swr` to its
  `react-server` stub, and the build dies on `Export default doesn't exist in target module`.
- **`src/proxy.ts` must exclude `api` and `studio`** from the locale matcher. next-intl
  otherwise rewrites `/api/revalidate` to `/es/api/revalidate` and the webhook silently 404s.
- **Next 16's `revalidateTag(tag, profile)` takes two arguments.** The one-arg form is a type
  error.
- GROQ has to convert on read: `coords` is a `geopoint` in Sanity but `SpeciesMap` wants
  `[lng, lat]`, and `description` is Portable Text in Sanity but a plain string in the
  placeholder — wiring the species page needs a Portable Text renderer.

Schemas live in `sanity/schemas/` (outside `src/`, so outside `tsconfig` `include`) and are
registered in `sanity/schemas/index.ts`; `sanity.config.ts` also hardcodes the Studio's
desk structure, so a new document type must be added in both places. Note the file/type name
mismatch: `publication.ts` exports the `scientificPublication` type. Remote images are
restricted to `cdn.sanity.io` and `images.unsplash.com` in `next.config.mjs`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
