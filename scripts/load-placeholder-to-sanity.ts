/**
 * Carga única: sube PLACEHOLDER_SPECIES y PLACEHOLDER_ARTICLES (con sus
 * autores) a Sanity, para no tener que recapturar el contenido a mano.
 *
 * Uso (Node 24 ejecuta .ts nativamente, sin dependencias nuevas):
 *
 *   node scripts/load-placeholder-to-sanity.ts                # dry-run (por defecto, no escribe nada)
 *   node scripts/load-placeholder-to-sanity.ts --dry-run       # explícito, igual que el anterior
 *   node scripts/load-placeholder-to-sanity.ts --execute       # escribe de verdad en Sanity
 *
 * Si tu Node es anterior a la v23.6 y el stripping de tipos no está activado
 * por defecto, antepón el flag: `node --experimental-strip-types scripts/...`
 * (en Node 24.16, usado aquí, no hace falta).
 *
 * Requiere en el entorno (sólo obligatorio con --execute; en dry-run se avisa
 * pero no bloquea, para poder validar el mapeo sin proyecto configurado):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN   (con permiso de escritura)
 *
 * Idempotencia: cada documento usa un _id determinista derivado del slug
 * (`species-<slug>`, `article-<slug>`, `author-<slug-del-nombre>`) y se sube
 * con `createOrReplace`, así que volver a correr el script no duplica
 * documentos. Las imágenes son otra historia: ver el aviso de riesgos en el
 * resumen final y en el informe que acompaña este script.
 */

import { createClient, type SanityClient } from "@sanity/client";
import { createHash, randomBytes } from "node:crypto";

import {
  PLACEHOLDER_SPECIES,
  type SpeciesPlaceholder,
} from "../src/lib/placeholder/species.ts";
import {
  PLACEHOLDER_ARTICLES,
  type ArticleAuthor,
  type ArticlePlaceholder,
} from "../src/lib/placeholder/articles.ts";

// ── CLI flags ──
const args = process.argv.slice(2);
const dryRun = !args.includes("--execute") && !args.includes("--write");

// ── Credenciales ──
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!dryRun) {
  const missing = [
    !projectId && "NEXT_PUBLIC_SANITY_PROJECT_ID",
    !dataset && "NEXT_PUBLIC_SANITY_DATASET",
    !token && "SANITY_API_TOKEN",
  ].filter(Boolean);
  if (missing.length) {
    console.error(
      `Abortando: faltan variables de entorno requeridas para escribir en Sanity: ${missing.join(", ")}`,
    );
    process.exit(1);
  }
} else if (!projectId || !dataset || !token) {
  console.warn(
    "[dry-run] Faltan credenciales de Sanity en el entorno. El dry-run continúa " +
      "(no se necesita red), pero serán obligatorias para correr con --execute.\n",
  );
}

const client: SanityClient = createClient({
  projectId: projectId || "dry-run-project",
  dataset: dataset || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Helpers ──
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function key(): string {
  return randomBytes(6).toString("hex");
}

function textBlock(text: string, style: "normal" | "h3" | "blockquote" = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

type ImageRef = { _type: "reference"; _ref: string };

const stats = {
  imagesUploaded: 0,
  imagesCached: 0,
  imagesFailed: 0,
  speciesUpserted: 0,
  articlesUpserted: 0,
  authorsUpserted: 0,
  errors: [] as string[],
};

// Cache en memoria por URL (varias especies comparten la misma foto de
// Unsplash) — evita subir el mismo asset más de una vez dentro de esta
// ejecución.
const imageCache = new Map<string, ImageRef | null>();

/**
 * Descarga `url` y la sube como asset de Sanity, devolviendo una referencia.
 * Antes de subir, busca un asset ya existente con el mismo nombre derivado
 * (hash de la URL) para que re-ejecutar el script no vuelva a duplicar la
 * imagen en Sanity. `null` si la descarga/subida falla — el error se registra
 * y el resto del script continúa.
 *
 * ponytail: asume que todas las URLs de origen (Unsplash) sirven JPEG. Es
 * cierto para todo el placeholder actual; si algún día se agrega una fuente
 * que no sea Unsplash, ampliar la detección de extensión por content-type.
 */
async function uploadImage(url: string | undefined): Promise<ImageRef | null> {
  if (!url) return null;
  if (imageCache.has(url)) {
    stats.imagesCached++;
    return imageCache.get(url)!;
  }

  const filename = `${createHash("sha1").update(url).digest("hex").slice(0, 16)}.jpg`;

  if (dryRun) {
    console.log(`  [dry-run] subiría imagen ${url} -> ${filename}`);
    const fake: ImageRef = { _type: "reference", _ref: `image-dryrun-${filename}` };
    imageCache.set(url, fake);
    return fake;
  }

  try {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $f][0]{_id}`,
      { f: filename },
    );
    if (existing) {
      const ref: ImageRef = { _type: "reference", _ref: existing._id };
      imageCache.set(url, ref);
      stats.imagesCached++;
      console.log(`  imagen ya existente, reutilizada: ${filename}`);
      return ref;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename });
    const ref: ImageRef = { _type: "reference", _ref: asset._id };
    imageCache.set(url, ref);
    stats.imagesUploaded++;
    console.log(`  imagen subida: ${filename}`);
    return ref;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    stats.imagesFailed++;
    stats.errors.push(`Imagen ${url}: ${message}`);
    console.error(`  ERROR subiendo imagen ${url}: ${message}`);
    imageCache.set(url, null);
    return null;
  }
}

async function upsert(doc: Record<string, unknown>): Promise<void> {
  const label = `${doc._type} ${doc._id}`;
  if (dryRun) {
    console.log(`[dry-run] createOrReplace ${label}`);
    return;
  }
  await client.createOrReplace(doc as any);
  console.log(`OK ${label}`);
}

// ── Autores ──
// Los artículos traen `author` embebido (name/role/initials). Se deduplica
// por nombre y se crea el documento `author` antes que los artículos, para
// poder referenciarlo.
async function buildAuthorDoc(author: ArticleAuthor) {
  const slug = slugify(author.name);
  return {
    _id: `author-${slug}`,
    _type: "author",
    name: author.name,
    slug: { _type: "slug", current: slug },
    // `role` del esquema es una categoría interna (biologist/photographer/...)
    // sin equivalente en el placeholder; se deja vacío. `roleLabel` es el
    // cargo público que sí trae el placeholder.
    roleLabel: author.role,
    initials: author.initials,
  };
}

async function loadAuthors(): Promise<Map<string, string>> {
  const byName = new Map<string, ArticleAuthor>();
  for (const article of PLACEHOLDER_ARTICLES) {
    if (!byName.has(article.author.name)) byName.set(article.author.name, article.author);
  }

  const idByName = new Map<string, string>();
  for (const author of byName.values()) {
    const doc = await buildAuthorDoc(author);
    await upsert(doc);
    idByName.set(author.name, doc._id);
    stats.authorsUpserted++;
  }
  return idByName;
}

// ── Especies ──
async function buildSpeciesDoc(sp: SpeciesPlaceholder) {
  const mainImageRef = await uploadImage(sp.image);

  const gallery = [];
  for (const item of sp.gallery ?? []) {
    const ref = await uploadImage(item.src);
    if (!ref) continue;
    gallery.push({
      _type: "image",
      _key: key(),
      asset: ref,
      // El placeholder no trae alt-text separado; se usa el caption como
      // aproximación razonable — la editora puede afinarlo luego.
      alt: item.caption,
      credit: item.credit,
      caption: item.caption,
    });
  }

  const mexicoLocations = (sp.mexicoLocations ?? []).map((loc) => ({
    _key: key(),
    municipality: loc.municipality,
    state: loc.state,
    // Placeholder: [lng, lat]. Sanity geopoint: {lat, lng}.
    coords: { _type: "geopoint", lat: loc.coords[1], lng: loc.coords[0] },
    date: loc.date,
    collector: loc.collector,
    note: loc.note,
  }));

  const doc: Record<string, unknown> = {
    _id: `species-${sp.slug}`,
    _type: "species",
    scientificName: sp.scientificName,
    commonNameEs: sp.commonNameEs,
    commonNameEn: sp.commonNameEn,
    slug: { _type: "slug", current: sp.slug },
    catalogNum: sp.catalogNum,
    order: sp.order,
    family: sp.family,
    subfamily: sp.subfamily,
    genus: sp.genus,
    // NO usar el campo `author` del esquema (referencia a quien redacta la
    // ficha): el `author` del placeholder es la autoridad taxonómica.
    taxonomicAuthor: sp.author,
    year: sp.year,
    geographicOrigin: sp.geographicOrigin,
    presenceInMexico: {
      present: sp.presenceInMexico,
      // El placeholder no tiene un booleano "nativa" explícito; se deriva de
      // la etiqueta "nativa" que ya usan las especies mexicanas del catálogo.
      native: sp.tags?.includes("nativa") ?? false,
      // `states` (heredado) se deja vacío a propósito: el esquema indica que
      // la lista viva es `mexicoStates`, no duplicarla aquí.
    },
    mexicoStates: sp.mexicoStates,
    mexicoLocations,
    gallery,
    description: [textBlock(sp.description)],
    habitat: sp.habitat,
    behavior: sp.behavior,
    foodPlants: sp.foodPlants,
    females: sp.females,
    males: sp.males,
    nymphs: sp.nymphs,
    eggs: sp.eggs,
    breeding: sp.breeding,
    conservationStatus: sp.conservationStatus,
    tags: sp.tags,
    references: sp.references,
  };

  if (mainImageRef) doc.mainImage = { _type: "image", asset: mainImageRef };

  return doc;
}

// ── Artículos ──
async function buildBodyEs(sections: ArticlePlaceholder["body"]) {
  const blocks: Record<string, unknown>[] = [];
  for (const section of sections) {
    if (section.type === "paragraph") {
      blocks.push(textBlock(section.content, "normal"));
    } else if (section.type === "subheading") {
      blocks.push(textBlock(section.content, "h3"));
    } else if (section.type === "pull-quote") {
      blocks.push(textBlock(section.content, "blockquote"));
    } else if (section.type === "image" && section.src) {
      const ref = await uploadImage(section.src);
      if (!ref) continue;
      // El esquema `bodyEs` no tiene campo `credit` para imágenes embebidas
      // (sólo alt/caption) — se anexa al caption para no perder el dato.
      const caption = section.credit
        ? [section.caption, section.credit].filter(Boolean).join(" — ")
        : section.caption;
      blocks.push({ _type: "image", _key: key(), asset: ref, alt: section.caption, caption });
    }
  }
  return blocks;
}

async function buildArticleDoc(article: ArticlePlaceholder, authorIdByName: Map<string, string>) {
  const mainImageRef = await uploadImage(article.image);
  const bodyEs = await buildBodyEs(article.body);
  const authorId = authorIdByName.get(article.author.name);

  const doc: Record<string, unknown> = {
    _id: `article-${article.slug}`,
    _type: "article",
    titleEs: article.titleEs,
    titleEn: article.titleEn,
    slug: { _type: "slug", current: article.slug },
    publishedAt: new Date(`${article.publishedAt}T00:00:00.000Z`).toISOString(),
    category: article.category,
    readingMinutes: article.readingMinutes,
    excerpt: article.excerpt,
    excerptEn: article.excerptEn,
    bodyEs,
    tags: article.tags,
  };

  if (authorId) doc.author = { _type: "reference", _ref: authorId };
  if (mainImageRef) {
    doc.mainImage = { _type: "image", asset: mainImageRef, caption: article.imageCaption };
  }

  if (article.relatedSlugs.length) {
    console.warn(
      `  aviso: "${article.slug}".relatedSlugs (${article.relatedSlugs.join(", ")}) no se sube — ` +
        `el esquema "article" sólo tiene "relatedSpecies" (referencias a especies); no existe un ` +
        `campo de artículos relacionados. Ver informe.`,
    );
  }

  return doc;
}

// ── Main ──
async function main() {
  console.log(`Modo: ${dryRun ? "DRY-RUN (no se escribe nada)" : "EJECUCIÓN REAL"}\n`);

  console.log("== Autores ==");
  const authorIdByName = await loadAuthors();

  console.log("\n== Especies ==");
  for (const sp of PLACEHOLDER_SPECIES) {
    console.log(`- ${sp.scientificName} (${sp.slug})`);
    const doc = await buildSpeciesDoc(sp);
    await upsert(doc);
    stats.speciesUpserted++;
  }

  console.log("\n== Artículos ==");
  for (const article of PLACEHOLDER_ARTICLES) {
    console.log(`- ${article.titleEs} (${article.slug})`);
    const doc = await buildArticleDoc(article, authorIdByName);
    await upsert(doc);
    stats.articlesUpserted++;
  }

  console.log("\n== Resumen ==");
  console.log(`Autores: ${stats.authorsUpserted}`);
  console.log(`Especies: ${stats.speciesUpserted}`);
  console.log(`Artículos: ${stats.articlesUpserted}`);
  console.log(
    `Imágenes: ${stats.imagesUploaded} subidas, ${stats.imagesCached} reutilizadas de caché, ${stats.imagesFailed} fallidas`,
  );
  if (stats.errors.length) {
    console.log(`\nErrores (${stats.errors.length}):`);
    for (const e of stats.errors) console.log(`  - ${e}`);
  } else {
    console.log("\nSin errores.");
  }

  if (dryRun) {
    console.log("\nEsto fue un dry-run: no se escribió nada en Sanity. Vuelve a correr con --execute para aplicar.");
  }
}

main().catch((err) => {
  console.error("Fallo no controlado:", err);
  process.exit(1);
});
