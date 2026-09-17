export default {
  // Explicit order (not glob): primitive → semantic → component merge.
  source: ["tokens/primitive.json", "tokens/semantic.json", "tokens/component.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/tokens/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: { selector: ":root" },
        },
      ],
    },
    js: {
      transformGroup: "js",
      buildPath: "src/tokens/",
      files: [
        {
          destination: "tokens.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
};
