# @teamstep/eslint-plugin

ESLint plugin shipped alongside `@teamstep/design-system`. Enforces closed component APIs:
exported prop interfaces must not include `className` or `style`.

## Install

```bash
pnpm add -D @teamstep/eslint-plugin eslint
```

Configure GitHub Packages for the `@teamstep` scope — see `design-system/CONSUMER.md` in the
brand-assets repo.

## Usage (ESLint 9 flat config)

```js
// eslint.config.mjs
import teamstep from "@teamstep/eslint-plugin";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["src/**/*.tsx"],
    ignores: ["**/*.stories.tsx"],
    ...teamstep.configs.recommended,
  },
];

```

Or enable the rule manually:

```js
import teamstep from "@teamstep/eslint-plugin";

export default [
  {
    plugins: { teamstep },
    rules: { "teamstep/no-style-passthrough": "error" },
  },
];
```
