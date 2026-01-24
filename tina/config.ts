import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: "f418ae4c-b8ce-4b77-aaa8-a4da1f7b70c8",
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "/",
  },

  media: {
    tina: {
      mediaRoot: "assets/images",
      publicFolder: "/",
    },
  },

  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "_posts",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "author", label: "Author" },
          {
            type: "image",
            name: "image",
            label: "Featured Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },
    ],
  },
});
