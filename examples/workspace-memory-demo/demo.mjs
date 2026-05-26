#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const issuePath = path.join(here, "fixtures", "issue.json");
const observationsPath = path.join(here, "fixtures", "first-run-observations.json");
const workspacePath = path.join(here, "demo-workspace");
const memoryPath = path.join(workspacePath, "WORKSPACE_MEMORY.json");

if (process.argv.includes("--reset")) {
  fs.rmSync(memoryPath, { force: true });
  console.log("Reset demo-workspace/WORKSPACE_MEMORY.json");
  process.exit(0);
}

const issue = readJson(issuePath);
const observations = readJson(observationsPath);
const memory = buildMemory(issue, observations);

fs.mkdirSync(workspacePath, { recursive: true });
writeJsonAtomic(memoryPath, memory);

const reloadedMemory = readJson(memoryPath);
const validationErrors = validateMemory(reloadedMemory);

if (validationErrors.length > 0) {
  console.error("Workspace memory failed validation:");
  for (const error of validationErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("1. Wrote workspace memory");
console.log(`   ${path.relative(here, memoryPath)}`);
console.log("");
console.log("2. Validated compact continuity state");
console.log(`   ${reloadedMemory.decisions.length} decision(s)`);
console.log(`   ${reloadedMemory.open_questions.length} open question(s)`);
console.log(`   ${reloadedMemory.known_risks.length} known risk(s)`);
console.log(`   ${reloadedMemory.next_actions.length} next action(s)`);
console.log("");
console.log("3. Rendered continuation prompt");
console.log("");
console.log(renderContinuationPrompt(issue, reloadedMemory));

function buildMemory(issue, observations) {
  return {
    version: 1,
    issue: {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title
    },
    updated_at: observations.observed_at,
    summary: observations.summary,
    decisions: observations.decisions,
    rejected_directions: observations.rejected_directions,
    open_questions: observations.open_questions,
    known_risks: observations.known_risks,
    failed_attempts: observations.failed_attempts,
    validation: observations.validation,
    next_actions: observations.next_actions,
    handoff_notes: observations.handoff_notes,
    metadata: {
      producer: "workspace-memory-continuity-demo",
      source: "simulated-first-run"
    }
  };
}

function renderContinuationPrompt(issue, memory) {
  const sections = [
    `You are continuing work on ${issue.identifier}: ${issue.title}.`,
    "",
    "Use the workspace memory below as compact continuity context. Do not repeat prior exploration",
    "unless new evidence invalidates it.",
    "",
    "Current summary:",
    memory.summary,
    "",
    renderList("Decisions already made", memory.decisions, "summary"),
    renderList("Rejected directions", memory.rejected_directions, "summary"),
    renderList("Open questions", memory.open_questions, "question"),
    renderList("Known risks", memory.known_risks, "summary"),
    renderList("Failed attempts", memory.failed_attempts, "summary"),
    renderList("Validation evidence", memory.validation, "summary"),
    renderList("Next actions", memory.next_actions, "summary"),
    renderList("Handoff notes", memory.handoff_notes, "summary"),
    "",
    "Continue from the next actions, preserve any new rationale, and update the workspace memory",
    "before handing off."
  ];

  return sections.filter(Boolean).join("\n");
}

function renderList(title, entries, field) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return `${title}:\n- none`;
  }

  return [`${title}:`, ...entries.map((entry) => `- ${entry[field]}`)].join("\n");
}

function validateMemory(memory) {
  const errors = [];

  if (!memory || typeof memory !== "object" || Array.isArray(memory)) {
    return ["memory must be an object"];
  }

  if (memory.version !== 1) {
    errors.push("version must be 1");
  }

  for (const field of ["id", "identifier", "title"]) {
    if (!isNonEmptyString(memory.issue?.[field])) {
      errors.push(`issue.${field} must be a non-empty string`);
    }
  }

  if (!isNonEmptyString(memory.updated_at) || Number.isNaN(Date.parse(memory.updated_at))) {
    errors.push("updated_at must be an ISO-compatible date-time string");
  }

  if (!isNonEmptyString(memory.summary)) {
    errors.push("summary must be a non-empty string");
  }

  const listRequirements = {
    decisions: ["id", "summary"],
    rejected_directions: ["id", "summary"],
    open_questions: ["id", "question"],
    known_risks: ["id", "summary"],
    failed_attempts: ["id", "summary"],
    validation: ["id", "result", "summary"],
    next_actions: ["id", "summary"],
    handoff_notes: ["id", "summary"]
  };

  for (const [field, requiredFields] of Object.entries(listRequirements)) {
    validateEntries(errors, memory[field], field, requiredFields);
  }

  return errors;
}

function validateEntries(errors, entries, field, requiredFields) {
  if (!Array.isArray(entries)) {
    errors.push(`${field} must be an array`);
    return;
  }

  entries.forEach((entry, index) => {
    for (const requiredField of requiredFields) {
      if (!isNonEmptyString(entry?.[requiredField])) {
        errors.push(`${field}[${index}].${requiredField} must be a non-empty string`);
      }
    }
  });
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonAtomic(filePath, value) {
  const pendingPath = `${filePath}.pending`;
  fs.writeFileSync(pendingPath, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(pendingPath, filePath);
}
