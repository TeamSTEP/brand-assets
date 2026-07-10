# @teamstep/stylelint-config

Stylelint preset shipped alongside `@teamstep/design-system`. Requires CSS custom properties
from `@teamstep/design-system/tokens.css` instead of raw color/spacing/radius literals.

## Install

```bash
pnpm add -D @teamstep/stylelint-config stylelint stylelint-config-standard stylelint-declaration-strict-value
```

Configure GitHub Packages for the `@teamstep` scope — see `design-system/CONSUMER.md` in the
brand-assets repo.

## Usage

```js
// stylelint.config.mjs
import teamstepConfig from "@teamstep/stylelint-config";

/** @type {import('stylelint').Config} */
export default {
  extends: [teamstepConfig],
};
```

Import `@teamstep/design-system/tokens.css` in your app layout so `var(--color-*)` tokens resolve
at runtime.
