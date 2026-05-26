#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(here, "fixtures");
const workspacePath = path.join(here, "generated-workspace");

const files = {
  constitution: path.join(fixturePath, "constitution.json"),
  inquiry: path.join(fixturePath, "inquiry.json"),
  signals: path.join(fixturePath, "signals.json"),
  memory: path.join(workspacePath, "WORKSPACE_MEMORY.json"),
  graph: path.join(workspacePath, "RATIONALE_GRAPH.json"),
  reflection: path.join(workspacePath, "REFLECTION_REPORT.md"),
  continuation: path.join(workspacePath, "CONTINUATION_PROMPT.md"),
  summary: path.join(workspacePath, "RUN_SUMMARY.json")
};

if (process.argv.includes("--reset")) {
  for (const file of [files.memory, files.graph, files.reflection, files.continuation, files.summary]) {
    fs.rmSync(file, { force: true });
  }
  console.log("Reset generated workspace artifacts");
  process.exit(0);
}

const constitution = readJson(files.constitution);
const inquiry = readJson(files.inquiry);
const signals = readJson(files.signals);

const priorMemory = fs.existsSync(files.memory) ? readJson(files.memory) : null;
const pass = runCognitionPass({ constitution, inquiry, signals, priorMemory });

fs.mkdirSync(workspacePath, { recursive: true });
writeJsonAtomic(files.memory, pass.memory);
writeJsonAtomic(files.graph, pass.graph);
writeTextAtomic(files.reflection, renderReflectionReport(pass));
writeTextAtomic(files.continuation, renderContinuationPrompt(pass));
writeJsonAtomic(files.summary, pass.summary);

console.log("Cognitive workspace pass complete");
console.log("");
console.log("Generated artifacts:");
for (const file of [files.memory, files.graph, files.reflection, files.continuation, files.summary]) {
  console.log(`- ${path.relative(here, file)}`);
}
console.log("");
console.log("Key results:");
console.log(`- ${pass.memory.decisions.length} decision(s) preserved`);
console.log(`- ${pass.memory.tensions.length} tension(s) preserved`);
console.log(`- ${pass.memory.open_questions.length} open question(s) preserved`);
console.log(`- ${pass.graph.edges.length} rationale graph edge(s)`);
console.log("");
console.log("Continuation preview:");
console.log(pass.continuationPreview);

function runCognitionPass({ constitution, inquiry, signals, priorMemory }) {
  const preservedPriorDecisions = priorMemory?.decisions ?? [];
  const evidence = collectEvidence(signals);
  const tensions = identifyTensions(inquiry, signals);
  const decisions = decide(inquiry, signals, tensions, preservedPriorDecisions);
  const rejectedDirections = rejectDirections(signals);
  const openQuestions = identifyOpenQuestions(inquiry, signals, tensions);
  const risks = identifyRisks(signals, tensions);
  const nextActions = planNextActions(openQuestions, risks);
  const graph = buildRationaleGraph({ inquiry, evidence, tensions, decisions, rejectedDirections, openQuestions, risks });

  const memory = {
    version: 1,
    inquiry: {
      id: inquiry.id,
      title: inquiry.title,
      domain: inquiry.domain
    },
    constitution: {
      id: constitution.id,
      archetypes: constitution.archetypes.map((archetype) => archetype.id),
      preserve: constitution.memory.preserve
    },
    updated_at: signals.observed_at,
    summary: summarize({ inquiry, decisions, tensions, openQuestions }),
    decisions,
    rejected_directions: rejectedDirections,
    tensions,
    open_questions: openQuestions,
    known_risks: risks,
    evidence,
    next_actions: nextActions,
    reflection_policy: constitution.reflection,
    metadata: {
      producer: "cognitive-workspace-runtime-demo",
      prior_memory_loaded: Boolean(priorMemory)
    }
  };

  const summary = {
    inquiry_id: inquiry.id,
    generated_at: signals.observed_at,
    memory_path: "generated-workspace/WORKSPACE_MEMORY.json",
    graph_path: "generated-workspace/RATIONALE_GRAPH.json",
    reflection_path: "generated-workspace/REFLECTION_REPORT.md",
    continuation_path: "generated-workspace/CONTINUATION_PROMPT.md",
    counts: {
      decisions: decisions.length,
      tensions: tensions.length,
      open_questions: openQuestions.length,
      risks: risks.length,
      graph_nodes: graph.nodes.length,
      graph_edges: graph.edges.length
    }
  };

  return {
    constitution,
    inquiry,
    signals,
    memory,
    graph,
    summary,
    continuationPreview: `Continue from ${nextActions[0].summary} while preserving ${tensions.length} unresolved tension(s).`
  };
}

function collectEvidence(signals) {
  return signals.observations.map((observation) => ({
    id: observation.id,
    summary: observation.summary,
    source: observation.source,
    confidence: observation.confidence
  }));
}

function identifyTensions(inquiry, signals) {
  return inquiry.tensions.map((tension) => {
    const supportingSignals = signals.observations
      .filter((observation) => observation.tags.some((tag) => tension.tags.includes(tag)))
      .map((observation) => observation.id);

    return {
      id: tension.id,
      summary: tension.summary,
      preserve_reason: tension.preserve_reason,
      supporting_signals: supportingSignals,
      status: supportingSignals.length > 0 ? "active" : "watch"
    };
  });
}

function decide(inquiry, signals, tensions, priorDecisions) {
  const decisions = [...priorDecisions];

  decisions.push({
    id: "dec-001",
    summary: "Preserve a dual-track concept space instead of forcing a single direction immediately.",
    rationale: "The strongest signals favor patient trust and clinician efficiency, but the active tensions show that premature convergence would hide important tradeoffs.",
    linked_tensions: tensions.map((tension) => tension.id),
    at: signals.observed_at
  });

  decisions.push({
    id: "dec-002",
    summary: "Represent unresolved stakeholder conflict as first-class workspace state.",
    rationale: "The inquiry contains durable ambiguity that should be reviewed explicitly rather than compressed into a generic summary.",
    linked_tensions: ["ten-001", "ten-003"],
    at: signals.observed_at
  });

  return uniqueById(decisions);
}

function rejectDirections(signals) {
  return signals.rejected_directions.map((direction) => ({
    id: direction.id,
    summary: direction.summary,
    reason: direction.reason,
    at: signals.observed_at
  }));
}

function identifyOpenQuestions(inquiry, signals, tensions) {
  const signalQuestions = signals.open_questions.map((question) => ({
    id: question.id,
    question: question.question,
    owner: question.owner,
    linked_tensions: question.linked_tensions
  }));

  const tensionQuestions = tensions
    .filter((tension) => tension.status === "active")
    .map((tension) => ({
      id: `q-${tension.id}`,
      question: `What evidence would let us resolve or deliberately preserve: ${tension.summary}`,
      owner: "human-review",
      linked_tensions: [tension.id]
    }));

  return uniqueById([...signalQuestions, ...tensionQuestions]);
}

function identifyRisks(signals, tensions) {
  return [
    ...signals.risks,
    {
      id: "risk-tension-collapse",
      summary: "The workspace may collapse unresolved tensions into a false consensus if summaries become too tidy.",
      mitigation: "Keep active tensions visible in memory, graph edges, reflection report, and continuation prompt.",
      severity: "high",
      linked_tensions: tensions.map((tension) => tension.id)
    }
  ];
}

function planNextActions(openQuestions, risks) {
  return [
    {
      id: "next-001",
      summary: "Run a focused review of the active tensions before selecting a primary concept direction.",
      priority: "high"
    },
    {
      id: "next-002",
      summary: `Answer or assign ${openQuestions.length} open question(s) before handoff.`,
      priority: "high"
    },
    {
      id: "next-003",
      summary: `Add mitigation notes for ${risks.filter((risk) => risk.severity === "high").length} high-severity risk(s).`,
      priority: "medium"
    }
  ];
}

function buildRationaleGraph({ inquiry, evidence, tensions, decisions, rejectedDirections, openQuestions, risks }) {
  const nodes = [
    { id: inquiry.id, type: "inquiry", label: inquiry.title },
    ...evidence.map((item) => ({ id: item.id, type: "evidence", label: item.summary })),
    ...tensions.map((item) => ({ id: item.id, type: "tension", label: item.summary })),
    ...decisions.map((item) => ({ id: item.id, type: "decision", label: item.summary })),
    ...rejectedDirections.map((item) => ({ id: item.id, type: "rejected_direction", label: item.summary })),
    ...openQuestions.map((item) => ({ id: item.id, type: "open_question", label: item.question })),
    ...risks.map((item) => ({ id: item.id, type: "risk", label: item.summary }))
  ];

  const edges = [];

  for (const evidenceItem of evidence) {
    edges.push({ from: evidenceItem.id, to: inquiry.id, relation: "informs" });
  }

  for (const tension of tensions) {
    edges.push({ from: tension.id, to: inquiry.id, relation: "constrains" });
    for (const signalId of tension.supporting_signals) {
      edges.push({ from: signalId, to: tension.id, relation: "activates" });
    }
  }

  for (const decision of decisions) {
    edges.push({ from: decision.id, to: inquiry.id, relation: "stabilizes" });
    for (const tensionId of decision.linked_tensions) {
      edges.push({ from: tensionId, to: decision.id, relation: "shapes" });
    }
  }

  for (const rejected of rejectedDirections) {
    edges.push({ from: rejected.id, to: inquiry.id, relation: "bounds" });
  }

  for (const question of openQuestions) {
    for (const tensionId of question.linked_tensions) {
      edges.push({ from: question.id, to: tensionId, relation: "interrogates" });
    }
  }

  for (const risk of risks) {
    for (const tensionId of risk.linked_tensions ?? []) {
      edges.push({ from: risk.id, to: tensionId, relation: "threatens" });
    }
  }

  return { version: 1, nodes: uniqueById(nodes), edges };
}

function summarize({ inquiry, decisions, tensions, openQuestions }) {
  return [
    `${inquiry.title} is being held as a bounded cognitive workspace rather than a one-shot task.`,
    `${decisions.length} decision(s) are stabilized, ${tensions.length} tension(s) remain visible, and ${openQuestions.length} question(s) need review before convergence.`
  ].join(" ");
}

function renderReflectionReport(pass) {
  const { memory, graph } = pass;

  return [
    "# Reflection Report",
    "",
    `Inquiry: ${memory.inquiry.title}`,
    "",
    "## Stable Decisions",
    ...memory.decisions.map((decision) => `- ${decision.summary}`),
    "",
    "## Preserved Tensions",
    ...memory.tensions.map((tension) => `- ${tension.summary} (${tension.status})`),
    "",
    "## Open Questions",
    ...memory.open_questions.map((question) => `- ${question.question}`),
    "",
    "## Known Risks",
    ...memory.known_risks.map((risk) => `- ${risk.summary}`),
    "",
    "## Rationale Graph",
    `- Nodes: ${graph.nodes.length}`,
    `- Edges: ${graph.edges.length}`,
    "",
    "## Reflection",
    "Do not treat unresolved tension as a failure. In this workspace, preserved tension is a",
    "governance signal: it marks where a future run or human reviewer needs explicit judgment."
  ].join("\n");
}

function renderContinuationPrompt(pass) {
  const { memory } = pass;

  return [
    `Continue the cognitive workspace for: ${memory.inquiry.title}`,
    "",
    "Use the preserved workspace state below. Do not restart from the original brief unless new",
    "evidence makes prior state invalid.",
    "",
    "Summary:",
    memory.summary,
    "",
    renderList("Decisions", memory.decisions, "summary"),
    renderList("Preserved tensions", memory.tensions, "summary"),
    renderList("Open questions", memory.open_questions, "question"),
    renderList("Known risks", memory.known_risks, "summary"),
    renderList("Next actions", memory.next_actions, "summary"),
    "",
    "Update the memory and rationale graph before handoff."
  ].join("\n");
}

function renderList(title, entries, field) {
  if (!entries.length) {
    return `${title}:\n- none`;
  }

  return [`${title}:`, ...entries.map((entry) => `- ${entry[field]}`)].join("\n");
}

function uniqueById(items) {
  const seen = new Set();
  const unique = [];

  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      unique.push(item);
    }
  }

  return unique;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonAtomic(filePath, value) {
  writeTextAtomic(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeTextAtomic(filePath, value) {
  const pendingPath = `${filePath}.pending`;
  fs.writeFileSync(pendingPath, value);
  fs.renameSync(pendingPath, filePath);
}
