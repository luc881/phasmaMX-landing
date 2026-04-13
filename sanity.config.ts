import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "phasmamx",
  title: "Phasma MX — Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Phasma MX")
          .items([
            S.listItem()
              .title("Especies")
              .child(S.documentTypeList("species").title("Catálogo de especies")),
            S.listItem()
              .title("Artículos")
              .child(S.documentTypeList("article").title("Artículos de divulgación")),
            S.listItem()
              .title("Expediciones")
              .child(S.documentTypeList("expedition").title("Expediciones de campo")),
            S.listItem()
              .title("Publicaciones científicas")
              .child(S.documentTypeList("scientificPublication")),
            S.divider(),
            S.listItem()
              .title("Páginas estáticas")
              .child(S.documentTypeList("staticPage")),
            S.listItem()
              .title("Autores y colaboradores")
              .child(S.documentTypeList("author")),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
