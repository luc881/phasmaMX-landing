import assert from "node:assert/strict";
import { test } from "node:test";
import type { SpeciesCard } from "@/lib/content/species";
import type * as Grouping from "./grouping.ts";

// ponytail: node --test's native TS stripping requires an explicit ".ts"
// specifier to resolve a relative import at runtime, but this project's
// tsconfig doesn't enable `allowImportingTsExtensions`, so a *static* import
// with that extension fails `tsc`/`next build`. Building the specifier
// dynamically sidesteps the static check while still resolving at runtime.
// Upgrade path: drop this once allowImportingTsExtensions is turned on (or a
// real test runner is wired up) and use a plain `import ... from "./grouping.ts"`.
const { groupByFamily, sortSpecies, UNASSIGNED_FAMILY } = (await import(
  "./grouping" + ".ts"
)) as typeof Grouping;

let nextId = 1;

function makeSpecies(overrides: Partial<SpeciesCard>): SpeciesCard {
  const id = String(nextId++);
  return {
    id,
    slug: `slug-${id}`,
    scientificName: `Species ${id}`,
    author: null,
    year: null,
    commonNameEs: null,
    commonNameEn: null,
    family: "Phasmatidae",
    subfamily: null,
    genus: null,
    order: null,
    catalogNum: null,
    conservationStatus: "LC",
    geographicOrigin: null,
    presenceInMexico: false,
    nativeToMexico: null,
    mexicoStates: [],
    image: null,
    imageAlt: null,
    aspectRatio: null,
    tags: [],
    psgNumber: null,
    ...overrides,
  };
}

test("groupByFamily cuenta bien y ordena especies por nombre científico dentro del grupo", () => {
  const species = [
    makeSpecies({ scientificName: "Zebra insectus", family: "Phasmatidae" }),
    makeSpecies({ scientificName: "Alpha insectus", family: "Phasmatidae" }),
    makeSpecies({ scientificName: "Bacillus rossius", family: "Bacillidae" }),
  ];

  const groups = groupByFamily(species);

  assert.equal(groups.length, 2);
  const phasmatidae = groups.find((g) => g.family === "Phasmatidae")!;
  assert.equal(phasmatidae.count, 2);
  assert.deepEqual(
    phasmatidae.species.map((s) => s.scientificName),
    ["Alpha insectus", "Zebra insectus"],
  );
});

test("familias vacías o null caen en 'Sin familia asignada', al final y sin mezclarse", () => {
  const species = [
    makeSpecies({ scientificName: "Zzz species", family: "Zophoessa" }),
    makeSpecies({ scientificName: "Huerfana uno", family: "" }),
    makeSpecies({ scientificName: "Huerfana dos", family: null as unknown as string }),
    makeSpecies({ scientificName: "Aaa species", family: "Aaronidae" }),
  ];

  const groups = groupByFamily(species);

  assert.deepEqual(
    groups.map((g) => g.family),
    ["Aaronidae", "Zophoessa", UNASSIGNED_FAMILY],
  );
  const unassigned = groups[groups.length - 1];
  assert.equal(unassigned.count, 2);
  assert.deepEqual(
    unassigned.species.map((s) => s.scientificName),
    ["Huerfana dos", "Huerfana uno"],
  );
});

test("sortSpecies por conservationStatus respeta la gravedad UICN, no el alfabeto", () => {
  const species = [
    makeSpecies({ scientificName: "Poco amenazada", conservationStatus: "LC" }),
    makeSpecies({ scientificName: "Critica", conservationStatus: "CR" }),
    makeSpecies({ scientificName: "Vulnerable", conservationStatus: "VU" }),
    makeSpecies({ scientificName: "No evaluada", conservationStatus: "NE" }),
    makeSpecies({ scientificName: "Datos insuficientes", conservationStatus: "DD" }),
  ];

  const sorted = sortSpecies(species, "conservationStatus");

  // CR > VU > LC en gravedad; alfabéticamente "Critica" iría después de "Datos...".
  assert.deepEqual(
    sorted.map((s) => s.conservationStatus),
    ["CR", "VU", "LC", "DD", "NE"],
  );
});

test("localeCompare ordena acentos y ñ correctamente (no como un sort ingenuo)", () => {
  const species = [
    makeSpecies({ scientificName: "Ñame insectus" }),
    makeSpecies({ scientificName: "Ácaro insectus" }),
    makeSpecies({ scientificName: "Ambystoma insectus" }),
    makeSpecies({ scientificName: "Azufre insectus" }),
  ];

  const sorted = sortSpecies(species, "scientificName");
  const names = sorted.map((s) => s.scientificName);

  // Un sort() ingenuo (comparación por code point) pone "Á" y "Ñ" fuera de orden
  // alfabético (después de la Z). Con localeCompare('es'), "Ácaro" va con la A
  // y "Ñame" cae entre N y O.
  assert.deepEqual(names, [
    "Ácaro insectus",
    "Ambystoma insectus",
    "Azufre insectus",
    "Ñame insectus",
  ]);

  const naive = [...species.map((s) => s.scientificName)].sort();
  assert.notDeepEqual(naive, names);
});

test("catalogNum null no revienta el orden y queda al final", () => {
  const species = [
    makeSpecies({ scientificName: "B", catalogNum: "MX-010" }),
    makeSpecies({ scientificName: "A", catalogNum: null }),
    makeSpecies({ scientificName: "C", catalogNum: "MX-002" }),
  ];

  const sorted = sortSpecies(species, "catalogNum");

  assert.deepEqual(
    sorted.map((s) => s.catalogNum),
    ["MX-002", "MX-010", null],
  );
});
