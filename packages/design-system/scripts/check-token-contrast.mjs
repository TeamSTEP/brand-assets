#!/usr/bin/env node
// Second, DOM-independent contrast gate: axe (see stories.visual.spec.ts) reports
// `incomplete` instead of `violations` when layered backgrounds/overlays keep it from
// resolving a color, which silently passes DOM-based a11y tooling. This computes WCAG
// ratios directly from resolved token hex values instead of rendering anything.
//
// Both inputs are auto-discovered, not hand-maintained:
//   - text tokens: every `--color-*` token actually used via a `color:` declaration
//     anywhere in src/**/*.css (excludes border-color/background-color/outline-color/etc.
//     via the anchored regex below).
//   - background tokens: the fixed set of tokens CLAUDE.md's brand rule sanctions as page
//     backgrounds ("Background is always --color-void or darker"). Semantic text tokens are
//     meant to be safe design-system-wide, so every discovered text token is checked against
//     every sanctioned background, not just the specific pairing seen in each component.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");

const SANCTIONED_BACKGROUND_TOKENS = ["background", "background-recessed", "surface"];

// { "<textToken>|<backgroundToken>": "reason this pair is allowed to fail AA" }
// Empty today — every discovered pairing currently passes 4.5:1. A component that
// deliberately needs large-text (>=18.66px bold / 24px) sub-AA text should add an entry
// here with a comment justifying it, the same pattern used for the axe rule exclusions in
// stories.visual.spec.ts, rather than silently accepting a fail.
const ALLOWLIST = {};

const MIN_CONTRAST_NORMAL_TEXT = 4.5;

function readTokensCss() {
  const tokensPath = path.join(pkgRoot, "src/tokens/tokens.css");
  let css;
  try {
    css = readFileSync(tokensPath, "utf8");
  } catch {
    console.error(
      `Could not read ${tokensPath} — run "pnpm run build:tokens" before this script.`,
    );
    process.exit(1);
  }
  const tokens = new Map();
  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens.set(match[1], match[2]);
  }
  return tokens;
}

function findCssFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCssFiles(full));
    } else if (entry.name.endsWith(".css")) {
      results.push(full);
    }
  }
  return results;
}

function discoverTextColorTokens() {
  const cssFiles = findCssFiles(path.join(pkgRoot, "src")).filter(
    (f) => !f.includes(`${path.sep}tokens${path.sep}`),
  );
  const found = new Set();
  // Anchored to the "color:" property specifically — deliberately excludes
  // border-color/background-color/outline-color/text-decoration-color, which aren't text.
  const re = /^\s*color:\s*var\(--color-([a-z0-9-]+)\)/;
  for (const file of cssFiles) {
    const content = readFileSync(file, "utf8");
    for (const line of content.split("\n")) {
      const match = re.exec(line);
      if (match) found.add(match[1]);
    }
  }
  return found;
}

function relativeLuminance(hex) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hexA, hexB) {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

const tokens = readTokensCss();
const textTokens = discoverTextColorTokens();

if (textTokens.size === 0) {
  console.error("No `color: var(--color-*)` declarations found — discovery regex may be broken.");
  process.exit(1);
}

let failed = false;
const rows = [];

for (const textToken of [...textTokens].sort()) {
  const textHex = tokens.get(textToken);
  if (!textHex) {
    console.error(`Token --color-${textToken} used as text color but not found in tokens.css.`);
    failed = true;
    continue;
  }
  for (const bgToken of SANCTIONED_BACKGROUND_TOKENS) {
    const bgHex = tokens.get(bgToken);
    const ratio = contrastRatio(textHex, bgHex);
    const key = `${textToken}|${bgToken}`;
    const ok = ratio >= MIN_CONTRAST_NORMAL_TEXT || key in ALLOWLIST;
    if (!ok) failed = true;
    rows.push({ textToken, bgToken, ratio, ok, allowlisted: key in ALLOWLIST });
  }
}

const pad = (s, n) => String(s).padEnd(n);
for (const row of rows) {
  const status = row.allowlisted ? "ALLOWLISTED" : row.ok ? "ok" : "FAIL";
  console.log(
    `${pad(`--color-${row.textToken}`, 32)} on ${pad(`--color-${row.bgToken}`, 26)} ${row.ratio.toFixed(2)}:1  ${status}`,
  );
}

if (failed) {
  console.error(
    `\n${rows.filter((r) => !r.ok).length} pair(s) fail WCAG AA (${MIN_CONTRAST_NORMAL_TEXT}:1) for normal-size text.`,
  );
  console.error(
    "Fix by adjusting the token's primitive value, changing the component to use a " +
      "compliant token, or — only for genuinely large text — adding a justified entry to " +
      "ALLOWLIST in this script.",
  );
  process.exit(1);
}

console.log(`\nAll ${rows.length} text/background token pairs pass WCAG AA.`);
