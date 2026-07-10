import { readFileSync } from "node:fs";
import { noStylePassthroughRule } from "./rules/no-style-passthrough.js";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: {
    name: "@teamstep/eslint-plugin",
    version,
  },
  rules: {
    "no-style-passthrough": noStylePassthroughRule,
  },
};

/** Flat-config preset for consumer repos. */
export const configs = {
  recommended: {
    name: "teamstep/recommended",
    plugins: {
      teamstep: plugin,
    },
    rules: {
      "teamstep/no-style-passthrough": "error",
    },
  },
};

export default plugin;
export { noStylePassthroughRule };
