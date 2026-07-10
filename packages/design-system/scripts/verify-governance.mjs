#!/usr/bin/env node
// Automates the adversarial governance probes HANDOFF.md described as manual, "next agent
// please re-run this by hand" instructions (§8). A probe that only exists as prose is exactly
// the thing that goes stale unnoticed — HANDOFF claimed these were "confirmed working" as of a
// specific date, and there was no way to know if that was still true without an agent manually
// redoing the same steps. This runs both probes on every CI run instead: injects a real
// violation into a real component file, asserts the relevant gate fails, then restores the
// file byte-for-byte no matter what (even if the probe itself throws).
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

// Probe 1 (HANDOFF §8.1/§8.4): a hardcoded color must fail stylelint's
// `scale-unlimited/declaration-strict-value` gate.
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

// Probe 2 (HANDOFF §8.4): an exported type missing its `@public` TSDoc tag must fail
// check-api's `ae-missing-release-tag` gate (requires a fresh build for the .d.ts to reflect
// the missing tag).
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

// Rebuild once more so a subsequent `check-api` step in the same CI run (or a local re-run)
// sees dist/ reflecting the real, unmutated source rather than whatever the last probe left
// mid-build.
run("pnpm run build");

if (failed) {
  console.error("\nGovernance probes FAILED — a documented enforcement mechanism did not fire.");
  process.exit(1);
}
console.log("\nAll governance probes passed — enforcement mechanisms are live, not aspirational.");
