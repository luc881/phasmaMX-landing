import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Autor / Colaborador",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre completo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({
      name: "role",
      title: "Rol (categoría interna)",
      type: "string",
      description:
        "Categoría interna para filtrar/organizar autores en el Studio. El " +
        "cargo que se muestra públicamente junto al nombre va en \"Cargo\" abajo.",
      options: {
        list: [
          { title: "Biólogo / Investigador", value: "biologist" },
          { title: "Fotógrafo", value: "photographer" },
          { title: "Colaborador externo", value: "external" },
          { title: "Editor", value: "editor" },
        ],
      },
    }),
    defineField({
      name: "roleLabel",
      title: "Cargo (texto público)",
      type: "string",
      description:
        "El cargo tal como se muestra en la firma de artículos y fichas, ej. " +
        "\"Investigador asociado\" o \"Especialista en terrariofilia\". Texto " +
        "libre, distinto de la categoría interna de arriba.",
    }),
    defineField({
      name: "initials",
      title: "Iniciales",
      type: "string",
      description:
        "Iniciales cortas para el avatar cuando no hay fotografía, ej. \"MV\".",
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "photo",
      title: "Fotografía",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "orcid",
      title: "ORCID iD",
      type: "string",
    }),
    defineField({
      name: "social",
      title: "Redes sociales",
      type: "object",
      fields: [
        defineField({ name: "twitter", type: "string", title: "Twitter/X" }),
        defineField({ name: "instagram", type: "string", title: "Instagram" }),
        defineField({ name: "website", type: "url", title: "Sitio web" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
});
