export default {
  // Explicit order, not a glob: enforces primitive -> semantic -> component merge
  // order deterministically (alphabetical glob order would put component.json first,
  // which breaks style-dictionary's merge when that file has no tokens yet).
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
