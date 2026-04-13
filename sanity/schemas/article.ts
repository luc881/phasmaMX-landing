import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Artículo",
  type: "document",
  fields: [
    defineField({
      name: "titleEs",
      title: "Título (español)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titleEs" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Taxonomía", value: "taxonomy" },
          { title: "Ecología", value: "ecology" },
          { title: "Conservación", value: "conservation" },
          { title: "Expedición", value: "expedition" },
          { title: "Divulgación", value: "outreach" },
          { title: "Especie del mes", value: "species-of-month" },
        ],
      },
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Texto alternativo" }),
        defineField({ name: "credit", type: "string", title: "Crédito" }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Extracto (español)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "excerptEn",
      title: "Excerpt (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bodyEs",
      title: "Cuerpo del artículo (español)",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
              { title: "Código", value: "code" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Texto alternativo" }),
            defineField({ name: "caption", type: "string", title: "Pie de foto" }),
          ],
        },
      ],
    }),
    defineField({
      name: "bodyEn",
      title: "Article body (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "tags",
      title: "Etiquetas",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "relatedSpecies",
      title: "Especies relacionadas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "species" }] }],
    }),
  ],
  preview: {
    select: {
      title: "titleEs",
      subtitle: "category",
      media: "mainImage",
    },
  },
});
