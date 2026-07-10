import { config } from "@repo/eslint-config/react-internal";
import { teamstepPlugin } from "@repo/eslint-config/teamstep-plugin";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.stories.tsx"],
    plugins: {
      teamstep: teamstepPlugin,
    },
    rules: {
      "teamstep/no-style-passthrough": "error",
    },
  },
  {
    // storybook-static is Storybook's own build output (minified, not authored) —
    // src/tokens/{tokens.css,tokens.ts} are Style Dictionary-generated, not authored either.
    // test-results/playwright-report are Playwright's own scratch output, same category.
    ignores: [
      "storybook-static/**",
      "src/tokens/tokens.css",
      "src/tokens/tokens.ts",
      "test-results/**",
      "playwright-report/**",
    ],
  },
];
