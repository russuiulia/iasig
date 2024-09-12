import {defineField, defineType} from "sanity";
import {baseLanguage} from "./localeStringType";

export const heroType = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      type: "string",
    }),
    defineField({
      name: "paragraph",
      type: "string",
    }),
    defineField({
      name: "buttonText",
      type: "string",
    }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: false,
    }),
  ],
});
