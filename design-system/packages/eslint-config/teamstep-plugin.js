import { noStylePassthroughRule } from "./rules/no-style-passthrough.js";

/** @type {import('eslint').ESLint.Plugin} */
export const teamstepPlugin = {
  meta: {
    name: "eslint-plugin-teamstep",
    version: "0.0.0",
  },
  rules: {
    "no-style-passthrough": noStylePassthroughRule,
  },
};
