#!/usr/bin/env node
// Standalone regression test for no-style-passthrough.js, run via `pnpm run test` in this
// package (wired into CI). Uses ESLint's Linter class directly rather than RuleTester/Mocha —
// no extra test-framework dependency, just assert + process.exit like the other governance
// scripts in this repo (see design-system/scripts/check-token-contrast.mjs).
//
// These cases exist because the rule was originally AST-shallow: it only checked properties
// declared directly on an exported interface/type body, so `className`/`style` reachable via
// `extends` or an intersection type (`&`) passed lint with zero warnings. Cases 4-6 guard
// against the false positives that came up while fixing that (generic utility types, plain
// aliases, unions).

import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import { noStylePassthroughRule } from "./no-style-passthrough.js";

const linter = new Linter();

const baseConfig = {
  files: ["**/*.tsx", "**/*.ts"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { sourceType: "module" },
  },
  plugins: { teamstep: { rules: { "no-style-passthrough": noStylePassthroughRule } } },
  rules: { "teamstep/no-style-passthrough": "error" },
};

function lint(code) {
  const messages = linter.verify(code, baseConfig, { filename: "probe.tsx" });
  return messages.filter((m) => m.ruleId === "teamstep/no-style-passthrough");
}

let failed = false;

function expectMessageIds(name, code, expectedIds) {
  const messages = lint(code);
  const actualIds = messages.map((m) => m.messageId).sort();
  const expected = [...expectedIds].sort();
  const ok = JSON.stringify(actualIds) === JSON.stringify(expected);
  console.log(`${ok ? "ok " : "FAIL"} - ${name}`);
  if (!ok) {
    failed = true;
    console.log(`     expected: ${JSON.stringify(expected)}`);
    console.log(`     actual:   ${JSON.stringify(actualIds)}`);
    for (const m of messages) console.log(`     > ${m.message}`);
  }
}

// --- direct declaration (the original, always-worked case) ---

expectMessageIds(
  "flags className declared directly on an exported interface",
  `export interface FooProps { className?: string; }`,
  ["noStylePassthrough"],
);

expectMessageIds(
  "flags style declared directly on an exported type literal",
  `export type FooProps = { style?: object; };`,
  ["noStylePassthrough"],
);

expectMessageIds(
  "passes a clean exported interface",
  `export interface FooProps { id: string; }`,
  [],
);

// --- extends / intersection bypass (the gap this rewrite fixes) ---

expectMessageIds(
  "flags className reachable via a locally-declared `extends` base",
  `
  interface BaseProps { className?: string; }
  export interface FooProps extends BaseProps { id: string; }
  `,
  ["noStylePassthrough"],
);

expectMessageIds(
  "flags className reachable via a locally-declared intersection type",
  `
  type BaseProps = { className?: string; };
  export type FooProps = BaseProps & { id: string; };
  `,
  ["noStylePassthrough"],
);

expectMessageIds(
  "flags a multi-level extends chain",
  `
  interface Root { style?: object; }
  interface Mid extends Root {}
  export interface FooProps extends Mid { id: string; }
  `,
  ["noStylePassthrough"],
);

// --- unresolvable base: reported, not silently passed ---

expectMessageIds(
  "reports an unresolved (imported) extends base instead of silently passing",
  `
  import type { ExternalBase } from "./external.js";
  export interface FooProps extends ExternalBase { id: string; }
  `,
  ["unresolvedBase"],
);

expectMessageIds(
  "reports an unresolved (imported) intersection member instead of silently passing",
  `
  import type { ExternalBase } from "./external.js";
  export type FooProps = ExternalBase & { id: string; };
  `,
  ["unresolvedBase"],
);

// --- false-positive guards found while fixing the gap ---

expectMessageIds(
  "does not flag a generic utility-type instantiation (Extract/Pick/Omit-shaped)",
  `
  export type BadgeVariant = "a" | "b" | "c";
  export type FooStatus = Extract<BadgeVariant, "a" | "b">;
  `,
  [],
);

expectMessageIds(
  "does not flag a plain re-exported union alias",
  `
  import type { FeedPlatform } from "./types.js";
  export type FooTab = FeedPlatform | "discord";
  `,
  [],
);

expectMessageIds(
  "does not flag a plain type alias to another local, clean type",
  `
  interface BaseProps { id: string; }
  export type FooProps = BaseProps;
  `,
  [],
);

if (failed) {
  console.error("\nno-style-passthrough rule tests FAILED.");
  process.exit(1);
}
console.log("\nAll no-style-passthrough rule tests passed.");
