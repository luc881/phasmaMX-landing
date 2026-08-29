import { defineField, defineType } from "sanity";

// Única fuente de verdad para la lista de estados de México. Se usa tanto en
// `presenceInMexico.states` (heredado) como en el nuevo `mexicoStates` y en
// `mexicoLocations[].state`, para no mantener la misma lista tres veces.
const MEXICO_STATES = [
  "Aguascalientes", "Baja California", "Baja California Sur",
  "Campeche", "Chiapas", "Chihuahua", "Ciudad de México",
  "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero",
  "Hidalgo", "Jalisco", "Estado de México", "Michoacán",
  "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
  "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa",
  "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
  "Yucatán", "Zacatecas",
];

export default defineType({
  name: "species",
  title: "Especie",
  type: "document",
  groups: [
    { name: "taxonomy", title: "Taxonomía", default: true },
    { name: "presence", title: "Presencia en México" },
    { name: "media", title: "Imágenes" },
    { name: "content", title: "Descripción y hábitat" },
    { name: "morphology", title: "Morfología" },
    { name: "breeding", title: "Cría en cautiverio" },
    { name: "meta", title: "Metadatos" },
  ],
  fields: [
    // ── Taxonomía ──
    defineField({
      name: "scientificName",
      title: "Nombre científico",
      type: "string",
      group: "taxonomy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "commonNameEs",
      title: "Nombre común (español)",
      type: "string",
      group: "taxonomy",
    }),
    defineField({
      name: "commonNameEn",
      title: "Common name (English)",
      type: "string",
      group: "taxonomy",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "taxonomy",
      options: { source: "scientificName" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "catalogNum",
      title: "Número de catálogo",
      type: "string",
      group: "taxonomy",
      description:
        "Código de catálogo interno de la colección, ej. \"CAT-007\". Es un identificador de ficha, no se traduce.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "string",
      group: "taxonomy",
      description: "Orden taxonómico. Para este catálogo siempre es \"Phasmatodea\".",
      initialValue: "Phasmatodea",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "family",
      title: "Familia",
      type: "string",
      group: "taxonomy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subfamily",
      title: "Subfamilia",
      type: "string",
      group: "taxonomy",
    }),
    defineField({
      name: "genus",
      title: "Género",
      type: "string",
      group: "taxonomy",
    }),
    defineField({
      name: "taxonomicAuthor",
      title: "Autor de la descripción original",
      type: "string",
      group: "taxonomy",
      description:
        "La autoridad taxonómica, ej. \"Sinéty, 1901\". OJO: esto NO es el campo " +
        "\"Ficha elaborada por\" de más abajo (ese es la persona del equipo que " +
        "escribió esta ficha; este es quien describió la especie por primera vez " +
        "en la literatura científica).",
    }),
    defineField({
      name: "year",
      title: "Año de descripción",
      type: "number",
      group: "taxonomy",
      description: "Año en que se publicó la descripción taxonómica original.",
      validation: (rule) => rule.integer().min(1700).max(new Date().getFullYear()),
    }),
    defineField({
      name: "geographicOrigin",
      title: "Origen geográfico",
      type: "string",
      group: "taxonomy",
      description: "Región o país de origen de la especie",
    }),

    // ── Presencia en México ──
    defineField({
      name: "presenceInMexico",
      title: "Presencia en México (detalle)",
      type: "object",
      group: "presence",
      description:
        "Nota: el catálogo del sitio usa un booleano simple \"presente/no presente\". " +
        "Este objeto guarda además si es nativa. El campo `states` de aquí abajo se " +
        "mantiene por compatibilidad, pero la lista que realmente lee el sitio es " +
        "\"Estados con registro (catálogo)\" más abajo — evita capturar la lista dos veces.",
      fields: [
        defineField({
          name: "present",
          title: "Presente en México",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "native",
          title: "Especie nativa",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "states",
          title: "Estados con registro (heredado, no usar para nuevas fichas)",
          type: "array",
          of: [{ type: "string" }],
          options: { list: MEXICO_STATES },
        }),
      ],
    }),
    defineField({
      name: "mexicoStates",
      title: "Estados con registro (catálogo)",
      type: "array",
      group: "presence",
      description:
        "Estados mexicanos donde hay registros de la especie. Esta es la lista que " +
        "usa la ficha pública y el mapa de distribución.",
      of: [{ type: "string" }],
      options: { list: MEXICO_STATES },
    }),
    defineField({
      name: "mexicoLocations",
      title: "Localidades registradas",
      type: "array",
      group: "presence",
      description:
        "Puntos de colecta concretos para el mapa de distribución de la ficha " +
        "(municipio, coordenadas, fecha y colector). Deja vacío si la especie no " +
        "tiene registros puntuales en México.",
      of: [
        {
          type: "object",
          name: "mexicoLocation",
          title: "Localidad",
          fields: [
            defineField({
              name: "municipality",
              title: "Municipio / localidad",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "state",
              title: "Estado",
              type: "string",
              options: { list: MEXICO_STATES },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "coords",
              title: "Coordenadas GPS",
              type: "geopoint",
              description:
                "Punto de colecta. Al consultar con GROQ para el mapa, proyectar " +
                "como [coords.lng, coords.lat] — el frontend espera la tupla en ese orden.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "date",
              title: "Fecha de registro",
              type: "string",
              description:
                "Texto libre, ej. \"2023-09\". No se usa el tipo fecha porque muchos " +
                "registros de campo sólo tienen mes y año.",
            }),
            defineField({
              name: "collector",
              title: "Colector",
              type: "string",
              description: "Nombre de quien colectó o documentó el ejemplar.",
            }),
            defineField({
              name: "note",
              title: "Nota de campo",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "municipality", subtitle: "state" },
          },
        },
      ],
    }),

    // ── Imágenes ──
    // `id` del placeholder no necesita campo propio: Sanity ya genera `_id`
    // para cada documento.
    // `image` del placeholder tampoco: es exactamente `mainImage` de aquí abajo.
    defineField({
      name: "mainImage",
      title: "Fotografía principal",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
        defineField({
          name: "credit",
          title: "Crédito fotográfico",
          type: "string",
        }),
      ],
    }),
    // `aspectRatio` del placeholder (ej. "3/4") NO se añade como campo manual:
    // Sanity calcula el aspect ratio del asset automáticamente en
    // `mainImage.asset->metadata.dimensions.aspectRatio`. Guardarlo a mano
    // crearía una segunda fuente de verdad que se desincroniza si se cambia
    // la foto. Si el diseño de catálogo necesita fijar un ratio de recorte
    // distinto al de la imagen original, eso se resuelve con `hotspot` +
    // `crop` (ya habilitados con `options: { hotspot: true }`), no con un
    // número guardado aparte.
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Texto alternativo" }),
            defineField({ name: "credit", type: "string", title: "Crédito fotográfico" }),
            defineField({ name: "caption", type: "string", title: "Pie de foto" }),
          ],
        },
      ],
    }),

    // ── Descripción y hábitat ──
    defineField({
      name: "description",
      title: "Descripción (español)",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "habitat",
      title: "Hábitat",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "behavior",
      title: "Comportamiento",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "foodPlants",
      title: "Plantas hospederas (español)",
      type: "array",
      group: "content",
      description: "Una entrada por planta, ej. \"Encino (Quercus)\".",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "foodPlantsEn",
      title: "Host plants (English)",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),

    // ── Morfología ──
    defineField({
      name: "females",
      title: "Hembras (español)",
      type: "text",
      group: "morphology",
      rows: 4,
      description: "Descripción morfológica de las hembras: tamaño, color, forma.",
    }),
    defineField({
      name: "femalesEn",
      title: "Females (English)",
      type: "text",
      group: "morphology",
      rows: 4,
    }),
    defineField({
      name: "males",
      title: "Machos (español)",
      type: "text",
      group: "morphology",
      rows: 4,
      description: "Descripción morfológica de los machos.",
    }),
    defineField({
      name: "malesEn",
      title: "Males (English)",
      type: "text",
      group: "morphology",
      rows: 4,
    }),
    defineField({
      name: "nymphs",
      title: "Ninfas (español)",
      type: "text",
      group: "morphology",
      rows: 4,
      description: "Descripción de los estadios ninfales.",
    }),
    defineField({
      name: "nymphsEn",
      title: "Nymphs (English)",
      type: "text",
      group: "morphology",
      rows: 4,
    }),
    defineField({
      name: "eggs",
      title: "Huevos (español)",
      type: "text",
      group: "morphology",
      rows: 4,
      description: "Forma, tamaño, color e incubación de los huevos.",
    }),
    defineField({
      name: "eggsEn",
      title: "Eggs (English)",
      type: "text",
      group: "morphology",
      rows: 4,
    }),

    // ── Cría en cautiverio ──
    defineField({
      name: "breeding",
      title: "Notas de cría (español)",
      type: "text",
      group: "breeding",
      rows: 5,
      description: "Temperatura, humedad, sustrato y demás recomendaciones de cría.",
    }),
    defineField({
      name: "breedingEn",
      title: "Breeding notes (English)",
      type: "text",
      group: "breeding",
      rows: 5,
    }),

    // ── Metadatos ──
    defineField({
      name: "conservationStatus",
      title: "Estado de conservación",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "No evaluado (NE)", value: "NE" },
          { title: "Datos insuficientes (DD)", value: "DD" },
          { title: "Preocupación menor (LC)", value: "LC" },
          { title: "Casi amenazado (NT)", value: "NT" },
          { title: "Vulnerable (VU)", value: "VU" },
          { title: "En peligro (EN)", value: "EN" },
          { title: "En peligro crítico (CR)", value: "CR" },
          { title: "Extinto en estado silvestre (EW)", value: "EW" },
          { title: "Extinto (EX)", value: "EX" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Etiquetas (español)",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tagsEn",
      title: "Tags (English)",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featured",
      title: "Destacada en homepage",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "references",
      title: "Referencias bibliográficas",
      type: "array",
      group: "meta",
      description: "Citas completas, no se traducen.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "author",
      title: "Ficha elaborada por",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
      description:
        "Quién del equipo escribió esta ficha (no confundir con \"Autor de la " +
        "descripción original\" en la pestaña Taxonomía).",
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      group: "meta",
    }),
  ],
  preview: {
    select: {
      title: "scientificName",
      subtitle: "commonNameEs",
      media: "mainImage",
    },
  },
});
