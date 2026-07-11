# Code Mode Rules (Non-Obvious Only)

- **ESM imports require explicit `.js` extensions** on relative paths — even for `.tsx` files. `import { Hero } from "./Hero.js"`, not `"./Hero"` or `"./Hero.tsx"`.
- **Closed component APIs**: no `className`/`style` on exported prop interfaces. Enforced by [`no-style-passthrough`](packages/eslint-plugin-teamstep/rules/no-style-passthrough.js:1) rule. The rule traces `extends`/`&` but skips aliases, unions, and generic instantiations. If a prop shape would let a caller introduce an off-brand value, redesign the prop — don't add a lint exclusion.
- **Every exported type/function needs `@public` TSDoc** — enforced by `ae-missing-release-tag` in [`api-extractor.json`](packages/design-system/api-extractor.json:22). Missing it causes `verify-governance` to fail CI by injecting a real violation into `Badge.tsx`.
- **Responsiveness uses container queries** (`container-type: inline-size` + `@container`), never media queries. Every component must be correct at 390/768/1280px.
- **BEM class naming**: all classes must match `^ds-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$` with `ds-` prefix.
- **No raw hex/rgb in component CSS** (except `src/effects/**`). Every color must be `var(--color-*)`. Stylelint `scale-unlimited/declaration-strict-value` enforces this.
- **Tokens are one-way**: edit DTCG JSON → run `build:tokens`. Never hand-edit generated `src/tokens/tokens.css` or `tokens.ts`. Style Dictionary merge order is explicit (`primitive.json` → `semantic.json` → `component.json`), not glob — glob would sort `component.json` first and break the merge.
- **Asymmetric border-radius only** — top-left + bottom-right (`2px 12px 2px 12px` pattern). Use semantic tokens like `--radius-card-sm`, `--radius-chip-md`. Never uniform corners.
- **`motion` is peer dependency**, not bundled — don't import it in tsup's external list incorrectly or mark it as a dependency.
- **`etc/design-system.api.md` is a committed contract** — update via `pnpm run update-api` only, never hand-edit.
- **Background always `--color-void` or darker** — never light backgrounds.
- **Game-world accent colors** (green/blood) scoped to game-card context only.
