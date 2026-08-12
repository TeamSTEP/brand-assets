#!/usr/bin/env node
// Runs adversarial governance probes on every CI run: injects a real violation into a real
// component file, asserts the relevant gate fails, then restores the file byte-for-byte no
// matter what (even if the probe itself throws).
//
// Both probes target components chosen only because they already contain the exact patterns
// needed (a `color:` declaration to corrupt, an `@public` tag to strip) — not because Badge is
// special. If Badge.tsx/Badge.css are restructured such that these markers no longer exist,
// this script fails loudly (via the "didn't change anything" guard) rather than silently
// no-op-ing, which is itself useful: it means the probe needs to move to wherever the pattern
// now lives.

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");

function run(cmd) {
  try {
    execSync(cmd, { cwd: pkgRoot, stdio: "pipe" });
    return { ok: true, output: "" };
  } catch (err) {
    return { ok: false, output: (err.stdout?.toString() ?? "") + (err.stderr?.toString() ?? "") };
  }
}

function withTemporaryEdit(filePath, transform, probe) {
  const original = readFileSync(filePath, "utf8");
  const mutated = transform(original);
  if (mutated === original) {
    throw new Error(
      `Probe setup for ${filePath} didn't change the file — its target pattern may have moved. ` +
        "Update this script's transform to match the file's current shape.",
    );
  }
  writeFileSync(filePath, mutated);
  try {
    return probe();
  } finally {
    writeFileSync(filePath, original);
  }
}

let failed = false;

// Probe 1: a hardcoded color must fail stylelint's `scale-unlimited/declaration-strict-value` gate.
{
  const cssPath = path.join(pkgRoot, "src/quest-log/Badge.css");
  const result = withTemporaryEdit(
    cssPath,
    (css) => css.replace("color: var(--color-text-primary);", "color: #ff00ff;"),
    () => run('pnpm exec stylelint "src/**/*.css"'),
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - a hardcoded #ff00ff color in Badge.css did NOT fail stylelint. " +
        "declaration-strict-value has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - hardcoded color in component CSS is caught by stylelint");
  }
}

// Probe 2: an exported type missing its `@public` TSDoc tag must fail check-api's
// `ae-missing-release-tag` gate (requires a fresh build for the .d.ts to reflect the missing tag).
{
  const tsxPath = path.join(pkgRoot, "src/quest-log/Badge.tsx");
  const result = withTemporaryEdit(
    tsxPath,
    (src) => src.replace(" * @public\n */\nexport type BadgeVariant", " */\nexport type BadgeVariant"),
    () => {
      const build = run("pnpm run build");
      if (!build.ok) return build;
      return run("pnpm exec api-extractor run --verbose");
    },
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - removing @public from an exported type did NOT fail check-api. " +
        "ae-missing-release-tag has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - a missing @public release tag is caught by check-api (ae-missing-release-tag)");
  }
}

// Probe 3: IconButton.css must also be covered by declaration-strict-value.
{
  const cssPath = path.join(pkgRoot, "src/primitives/IconButton.css");
  const result = withTemporaryEdit(
    cssPath,
    (css) => css.replace("color: var(--color-text-primary);", "color: #ff00ff;"),
    () => run('pnpm exec stylelint "src/**/*.css"'),
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - a hardcoded #ff00ff color in IconButton.css did NOT fail stylelint. " +
        "declaration-strict-value has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - hardcoded color in IconButton.css is caught by stylelint");
  }
}

// Probe 4: Card.css must also be covered by declaration-strict-value.
{
  const cssPath = path.join(pkgRoot, "src/primitives/Card.css");
  const result = withTemporaryEdit(
    cssPath,
    (css) => css.replace("background: var(--color-surface);", "background: #ff00ff;"),
    () => run('pnpm exec stylelint "src/**/*.css"'),
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - a hardcoded #ff00ff background in Card.css did NOT fail stylelint. " +
        "declaration-strict-value has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - hardcoded background in Card.css is caught by stylelint");
  }
}

// Probe 5: IconButton exported type missing @public must fail check-api.
{
  const tsxPath = path.join(pkgRoot, "src/primitives/IconButton.tsx");
  const result = withTemporaryEdit(
    tsxPath,
    (src) => src.replace(" * @public\n */\nexport type IconButtonSize", " */\nexport type IconButtonSize"),
    () => {
      const build = run("pnpm run build");
      if (!build.ok) return build;
      return run("pnpm exec api-extractor run --verbose");
    },
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - removing @public from IconButtonSize did NOT fail check-api. " +
        "ae-missing-release-tag has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - a missing @public release tag on IconButtonSize is caught by check-api");
  }
}

// Probe 6: Card exported type missing @public must fail check-api.
{
  const tsxPath = path.join(pkgRoot, "src/primitives/Card.tsx");
  const result = withTemporaryEdit(
    tsxPath,
    (src) => src.replace(" * @public\n */\nexport type CardSize", " */\nexport type CardSize"),
    () => {
      const build = run("pnpm run build");
      if (!build.ok) return build;
      return run("pnpm exec api-extractor run --verbose");
    },
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - removing @public from CardSize did NOT fail check-api. " +
        "ae-missing-release-tag has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - a missing @public release tag on CardSize is caught by check-api");
  }
}

// Probe 7: LogoVariant (BrandLogo) missing @public must fail check-api.
{
  const tsxPath = path.join(pkgRoot, "src/logo/BrandLogo.tsx");
  const result = withTemporaryEdit(
    tsxPath,
    (src) => src.replace(" * @public\n */\nexport type LogoVariant", " */\nexport type LogoVariant"),
    () => {
      const build = run("pnpm run build");
      if (!build.ok) return build;
      return run("pnpm exec api-extractor run --verbose");
    },
  );
  if (result.ok) {
    failed = true;
    console.error(
      "FAIL - removing @public from LogoVariant did NOT fail check-api. " +
        "ae-missing-release-tag has a gap — this is a real governance regression, not a test bug.",
    );
  } else {
    console.log("ok  - a missing @public release tag on LogoVariant is caught by check-api");
  }
}

// Rebuild once more so a subsequent `check-api` step in the same CI run (or a local re-run)
// sees dist/ reflecting the real, unmutated source rather than whatever the last probe left
// mid-build.
run("pnpm run build");

if (failed) {
  console.error("\nGovernance probes FAILED — a documented enforcement mechanism did not fire.");
  process.exit(1);
}
console.log("\nAll governance probes passed — enforcement mechanisms are live, not aspirational.");
