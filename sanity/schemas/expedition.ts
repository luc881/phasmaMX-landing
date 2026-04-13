import { defineField, defineType } from "sanity";

export default defineType({
  name: "expedition",
  title: "Expedición",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título de la expedición",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "location",
      title: "Ubicación",
      type: "object",
      fields: [
        defineField({ name: "name", type: "string", title: "Nombre del lugar" }),
        defineField({ name: "state", type: "string", title: "Estado" }),
        defineField({ name: "coordinates", type: "geopoint", title: "Coordenadas GPS" }),
        defineField({ name: "altitude", type: "number", title: "Altitud (msnm)" }),
      ],
    }),
    defineField({
      name: "date",
      title: "Fecha",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Fecha de fin (si aplica)",
      type: "date",
    }),
    defineField({
      name: "participants",
      title: "Participantes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "speciesFound",
      title: "Especies encontradas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "species" }] }],
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Galería de campo",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Descripción" }),
            defineField({ name: "caption", type: "string", title: "Pie de foto" }),
            defineField({ name: "speciesId", type: "string", title: "Especie (si aplica)" }),
          ],
        },
      ],
    }),
    defineField({
      name: "fieldNotes",
      title: "Notas de campo",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "weatherConditions",
      title: "Condiciones climáticas",
      type: "string",
    }),
    defineField({
      name: "habitat",
      title: "Tipo de hábitat",
      type: "string",
      options: {
        list: [
          "Bosque templado", "Bosque tropical", "Selva húmeda", "Selva seca",
          "Matorral xerófilo", "Bosque de galería", "Zona urbana", "Agricultura",
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      media: "mainImage",
    },
  },
});
