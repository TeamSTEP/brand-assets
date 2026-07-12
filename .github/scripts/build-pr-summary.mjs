#!/usr/bin/env node
// Builds the markdown body for the sticky PR comment posted by the pr-summary job in
// design-system-ci.yml. Reads only the small "ci-summary" artifact the `ci` job uploads
// (gate-results.json, changed-components.txt, changed-snapshots.txt, story-index.json, and a
// copy of the Playwright JSON reporter output) — never the full playwright-report artifact,
// which stays a download-only link so this script (and the comment) stay fast regardless of
// how many stories/viewports exist.
//
// Deliberately tolerant of missing/malformed inputs: this comment is a convenience summary,
// not a gate. A parse failure here must never fail the job — see the try/catch around visual
// results below. The actual pass/fail gate is the `ci` job itself (see workflow's "evaluate
// gate results" step).

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const [, , summaryDir, runUrl, prUrl] = process.argv;

if (!summaryDir || !runUrl || !prUrl) {
  console.error("usage: build-pr-summary.mjs <ci-summary-dir> <run-url> <pr-url>");
  process.exit(1);
}

const GATE_LABELS = {
  audit: "pnpm audit",
  changeset: "changeset status",
  lint: "lint",
  "check-contrast": "check-contrast",
  test: "test",
  "check-types": "check-types",
  "check-api": "check-api",
  build: "build",
  "build-storybook": "build-storybook",
  "test-visual": "test-visual",
  "verify-governance": "verify-governance",
};

const OUTCOME_ICON = {
  success: "✅",
  failure: "❌",
  skipped: "⏭️",
  cancelled: "🚫",
};

const VIEWPORTS = ["mobile", "tablet", "desktop"];

// Matches playwright.config.ts's snapshotPathTemplate: "{id}-{viewport}-{projectName}-linux.png".
// Project is always "chromium" (see playwright.config.ts's single `projects` entry).
const SNAPSHOT_FILENAME_RE = /^(.+)-(mobile|tablet|desktop)-chromium-linux\.png$/;

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function buildGateTable() {
  const gateResults = readJson(path.join(summaryDir, "gate-results.json"));
  if (!gateResults) {
    return { table: "_Gate results unavailable._", anyFailed: true, anyKnown: false };
  }

  const rows = ["| Gate | Result |", "| --- | --- |"];
  let anyFailed = false;
  let anyKnown = false;
  for (const [id, label] of Object.entries(GATE_LABELS)) {
    const outcome = gateResults[id];
    if (!outcome) continue;
    anyKnown = true;
    if (outcome === "failure") anyFailed = true;
    const icon = OUTCOME_ICON[outcome] ?? outcome;
    rows.push(`| ${label} | ${icon} ${outcome} |`);
  }
  return { table: rows.join("\n"), anyFailed, anyKnown };
}

function buildChangedComponents() {
  const filePath = path.join(summaryDir, "changed-components.txt");
  if (!existsSync(filePath)) return "_No changed-components data._";
  const names = readFileSync(filePath, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (names.length === 0) return "_No files under `src/` changed._";
  return names.map((n) => `\`${n}\``).join(", ");
}

function collectSpecs(suite, out) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const results = test.results ?? [];
      const last = results[results.length - 1];
      const status = last?.status ?? "unknown";
      out.push({ title: spec.title, project: test.projectName, status });
    }
  }
  for (const child of suite.suites ?? []) collectSpecs(child, out);
}

function loadVisualSpecs() {
  const filePath = path.join(summaryDir, "visual-results.json");
  if (!existsSync(filePath)) return null;
  try {
    const report = JSON.parse(readFileSync(filePath, "utf8"));
    const specs = [];
    for (const suite of report.suites ?? []) collectSpecs(suite, specs);
    return specs;
  } catch {
    return null;
  }
}

function buildVisualOverview(specs) {
  if (!specs) return "_Visual regression suite did not run (an earlier gate likely failed first)._";
  const passed = specs.filter((s) => s.status === "passed").length;
  const failed = specs.filter((s) => s.status !== "passed" && s.status !== "skipped").length;
  const skipped = specs.filter((s) => s.status === "skipped").length;
  return `${passed} passed, ${failed} failed, ${skipped} skipped`;
}

// GitHub's "Files changed" tab anchors each file's diff as #diff-<sha256 hex of the file's
// repo-relative path>. Undocumented but stable — verify against a real PR if GitHub ever
// changes this; a wrong hash just produces a dead anchor (lands on the top of the Files
// changed tab), never a broken page, so this is safe to keep even if it silently stops
// matching in the future.
function diffAnchor(repoRelativePath) {
  return createHash("sha256").update(repoRelativePath).digest("hex");
}

function buildSnapshotTable(specs) {
  const changedPath = path.join(summaryDir, "changed-snapshots.txt");
  if (!existsSync(changedPath)) return "_No snapshot changes detected._";

  const changedFiles = readFileSync(changedPath, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (changedFiles.length === 0) return "_No snapshot files changed in this PR._";

  const storyIndex = readJson(path.join(summaryDir, "story-index.json"));
  const entries = storyIndex?.entries ?? null;

  // storyId -> { title, name, viewports: { mobile: filePath, tablet: filePath, desktop: filePath } }
  const byStory = new Map();
  const unparsed = [];

  for (const filePath of changedFiles) {
    const basename = path.basename(filePath);
    const match = basename.match(SNAPSHOT_FILENAME_RE);
    if (!match) {
      unparsed.push(filePath);
      continue;
    }
    const [, storyId, viewport] = match;
    if (!byStory.has(storyId)) {
      byStory.set(storyId, { storyId, viewports: {} });
    }
    byStory.get(storyId).viewports[viewport] = filePath;
  }

  const rows = ["| Story | Mobile | Tablet | Desktop | Status |", "| --- | --- | --- | --- | --- |"];

  for (const { storyId, viewports } of [...byStory.values()].sort((a, b) =>
    a.storyId.localeCompare(b.storyId),
  )) {
    const indexEntry = entries?.[storyId];
    const label = indexEntry ? `${indexEntry.title} › ${indexEntry.name}` : `\`${storyId}\``;

    const cells = [];
    const statuses = [];
    for (const viewport of VIEWPORTS) {
      const filePath = viewports[viewport];
      if (!filePath) {
        cells.push("–");
        continue;
      }
      const spec = indexEntry
        ? specs?.find(
            (s) => s.title === `${indexEntry.title} > ${indexEntry.name} @ ${viewport}` && s.project === "chromium",
          )
        : null;
      const status = spec?.status ?? "unknown";
      statuses.push(status);
      const icon = status === "passed" ? "✅" : status === "unknown" ? "❓" : "❌";
      cells.push(`[${icon} diff](${prUrl}/files#diff-${diffAnchor(filePath)})`);
    }

    let rowStatus;
    if (statuses.length === 0 || statuses.every((s) => s === "unknown")) {
      rowStatus = "❓ unknown";
    } else if (statuses.some((s) => s !== "passed" && s !== "unknown")) {
      rowStatus = "❌ failing";
    } else if (statuses.some((s) => s === "unknown")) {
      rowStatus = "⚠️ partially unknown";
    } else {
      rowStatus = "✅ passing";
    }

    rows.push(`| ${label} | ${cells.join(" | ")} | ${rowStatus} |`);
  }

  let table = rows.join("\n");
  if (unparsed.length > 0) {
    table += `\n\n<sub>${unparsed.length} changed file(s) under the snapshots directory didn't match the expected naming pattern and aren't listed above — see the raw diff.</sub>`;
  }
  return table;
}

const { table: gateTable, anyFailed, anyKnown } = buildGateTable();
const changedComponents = buildChangedComponents();
const visualSpecs = loadVisualSpecs();
const visualOverview = buildVisualOverview(visualSpecs);
const snapshotTable = buildSnapshotTable(visualSpecs);

const overall = !anyKnown ? "⚠️ unknown" : anyFailed ? "❌ failed" : "✅ passed";

const body = `## 🎨 Design system CI summary

**Overall:** ${overall}

**Changed components:** ${changedComponents}

### Gates

${gateTable}

### Visual regression (\`test-visual\`)

${visualOverview}

**Changed snapshots** — jump straight to each diff instead of scrolling the Files changed tab:

${snapshotTable}

<sub>Full HTML report (screenshots, traces): [workflow run](${runUrl}) → Artifacts → \`playwright-report\`.</sub>
`;

console.log(body);
