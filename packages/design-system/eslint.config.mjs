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
    // Generated / tool output — not authored source.
    ignores: [
      "storybook-static/**",
      "src/tokens/tokens.css",
      "src/tokens/tokens.ts",
      "test-results/**",
      "playwright-report/**",
    ],
  },
];
