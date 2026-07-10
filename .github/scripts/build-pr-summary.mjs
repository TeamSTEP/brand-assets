#!/usr/bin/env node
// Builds the markdown body for the sticky PR comment posted by the pr-summary job in
// design-system-ci.yml. Reads only the small "ci-summary" artifact the `ci` job uploads
// (gate-results.json, changed-components.txt, and a copy of the Playwright JSON reporter
// output) — never the full playwright-report artifact, which stays a download-only link so
// this script (and the comment) stay fast regardless of how many stories/viewports exist.
//
// Deliberately tolerant of missing/malformed inputs: this comment is a convenience summary,
// not a gate. A parse failure here must never fail the job — see the try/catch around visual
// results below. The actual pass/fail gate is the `ci` job itself (see workflow's "evaluate
// gate results" step).

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const [, , summaryDir, runUrl] = process.argv;

if (!summaryDir || !runUrl) {
  console.error("usage: build-pr-summary.mjs <ci-summary-dir> <run-url>");
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

function buildVisualSummary() {
  const filePath = path.join(summaryDir, "visual-results.json");
  if (!existsSync(filePath)) {
    return "_Visual regression suite did not run (an earlier gate likely failed first)._";
  }

  try {
    const report = JSON.parse(readFileSync(filePath, "utf8"));
    const specs = [];
    for (const suite of report.suites ?? []) collectSpecs(suite, specs);

    const passed = specs.filter((s) => s.status === "passed").length;
    const failed = specs.filter((s) => s.status !== "passed" && s.status !== "skipped");
    const skipped = specs.filter((s) => s.status === "skipped").length;

    const lines = [`${passed} passed, ${failed.length} failed, ${skipped} skipped`];
    if (failed.length > 0) {
      lines.push("");
      for (const f of failed.slice(0, 20)) {
        lines.push(`- ❌ ${f.title}${f.project ? ` (${f.project})` : ""}`);
      }
      if (failed.length > 20) {
        lines.push(`- …and ${failed.length - 20} more (see full report artifact)`);
      }
    }
    return lines.join("\n");
  } catch {
    return "_Could not parse visual regression results._";
  }
}

const { table: gateTable, anyFailed, anyKnown } = buildGateTable();
const changedComponents = buildChangedComponents();
const visualSummary = buildVisualSummary();

const overall = !anyKnown ? "⚠️ unknown" : anyFailed ? "❌ failed" : "✅ passed";

const body = `## 🎨 Design system CI summary

**Overall:** ${overall}

**Changed components:** ${changedComponents}

### Gates

${gateTable}

### Visual regression (\`test-visual\`)

${visualSummary}

<sub>Full HTML report (screenshots, traces): [workflow run](${runUrl}) → Artifacts → \`playwright-report\`.</sub>
`;

console.log(body);
