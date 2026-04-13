import { defineField, defineType } from "sanity";

export default defineType({
  name: "staticPage",
  title: "Página estática",
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
      name: "seoDescription",
      title: "Meta descripción SEO",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "bodyEs",
      title: "Contenido (español)",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "bodyEn",
      title: "Content (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
  preview: {
    select: {
      title: "titleEs",
      subtitle: "slug.current",
    },
  },
});
