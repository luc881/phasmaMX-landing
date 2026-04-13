import { defineField, defineType } from "sanity";

export default defineType({
  name: "species",
  title: "Especie",
  type: "document",
  fields: [
    defineField({
      name: "scientificName",
      title: "Nombre científico",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "commonNameEs",
      title: "Nombre común (español)",
      type: "string",
    }),
    defineField({
      name: "commonNameEn",
      title: "Common name (English)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "scientificName" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "family",
      title: "Familia",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subfamily",
      title: "Subfamilia",
      type: "string",
    }),
    defineField({
      name: "genus",
      title: "Género",
      type: "string",
    }),
    defineField({
      name: "geographicOrigin",
      title: "Origen geográfico",
      type: "string",
      description: "Región o país de origen de la especie",
    }),
    defineField({
      name: "presenceInMexico",
      title: "Presencia en México",
      type: "object",
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
          title: "Estados con registro",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: [
              "Aguascalientes", "Baja California", "Baja California Sur",
              "Campeche", "Chiapas", "Chihuahua", "Ciudad de México",
              "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero",
              "Hidalgo", "Jalisco", "Estado de México", "Michoacán",
              "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
              "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa",
              "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
              "Yucatán", "Zacatecas",
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Fotografía principal",
      type: "image",
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
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
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
    defineField({
      name: "description",
      title: "Descripción (español)",
      type: "array",
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
      of: [{ type: "block" }],
    }),
    defineField({
      name: "habitat",
      title: "Hábitat",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "behavior",
      title: "Comportamiento",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "conservationStatus",
      title: "Estado de conservación",
      type: "string",
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
      name: "featured",
      title: "Destacada en homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "references",
      title: "Referencias bibliográficas",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "author",
      title: "Ficha elaborada por",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
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
