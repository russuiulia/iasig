"use client";
import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {visionTool} from "@sanity/vision";
import {internationalizedArray} from "sanity-plugin-internationalized-array";
import {documentInternationalization} from "@sanity/document-internationalization";

import {schemaTypes} from "./sanity/schemaTypes/index";

export default defineConfig({
  name: "default",
  title: "SanityDemo",

  projectId: "3v494xc6",
  dataset: "production",

  plugins: [
    internationalizedArray({
      languages: [
        {id: "en", title: "English"},
        {id: "ro", title: "Romanian"},
        {id: "ru", title: "Russian"},
      ],
      defaultLanguages: ["ro"],
      fieldTypes: ["string"],
    }),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        {id: "en", title: "English"},
        {id: "ro", title: "Romanian"},
        {id: "ru", title: "Russian"},
      ],

      schemaTypes: ["hero"],
    }),
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
