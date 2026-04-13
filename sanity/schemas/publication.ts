import { defineField, defineType } from "sanity";

export default defineType({
  name: "scientificPublication",
  title: "Publicación científica",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título del artículo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Autores",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "journal",
      title: "Revista / Journal",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Año de publicación",
      type: "number",
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "volume",
      title: "Volumen",
      type: "string",
    }),
    defineField({
      name: "issue",
      title: "Número",
      type: "string",
    }),
    defineField({
      name: "pages",
      title: "Páginas",
      type: "string",
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
    }),
    defineField({
      name: "abstract",
      title: "Resumen / Abstract",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "pdfFile",
      title: "Archivo PDF",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "keywords",
      title: "Palabras clave",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "relatedSpecies",
      title: "Especies relacionadas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "species" }] }],
    }),
    defineField({
      name: "openAccess",
      title: "Acceso abierto",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "journal",
    },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
});
