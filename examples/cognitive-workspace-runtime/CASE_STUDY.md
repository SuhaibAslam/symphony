# Case Study: Home-Care Device Onboarding

This case study walks through the example inquiry included in this demo.

## Starting Point

The workspace begins with a nonlinear design/research inquiry:

```text
Design a safer onboarding experience for a home-care medical device.
```

The inquiry is not treated as a simple ticket with a binary done state. It contains stakeholders,
evidence, tensions, risks, and questions that may remain unresolved across multiple runs.

## Why A Cognitive Workspace Helps

A normal one-shot run might produce a summary and a recommended concept. That is useful, but it can
collapse the important ambiguity too early.

This workspace preserves the parts that should compound:

- decisions that are stable enough to carry forward
- rejected directions that should not be rediscovered
- stakeholder tensions that remain active
- safety and compliance risks
- open questions that need human review
- next actions for the following run

## Input Artifacts

The case study uses three committed fixtures:

- `fixtures/inquiry.json`
  - the bounded problem space
- `fixtures/constitution.json`
  - the workspace operating policy
- `fixtures/signals.json`
  - simulated evidence, rejected directions, questions, and risks

The constitution is intentionally small. It defines:

- what memory should preserve
- which reasoning archetypes participate
- which failure modes to avoid
- when reflection should happen

## Run

From the repository root:

```bash
node examples/cognitive-workspace-runtime/runtime.mjs
```

The runtime writes five generated artifacts under `generated-workspace/`.

## Generated Artifact 1: Workspace Memory

`WORKSPACE_MEMORY.json` is the compact continuity state.

It preserves:

- the inquiry identity
- the constitution used
- stable decisions
- rejected directions
- active tensions
- open questions
- risks
- evidence
- next actions

This is the artifact a later run can load instead of reconstructing state from raw logs.

## Generated Artifact 2: Rationale Graph

`RATIONALE_GRAPH.json` connects the workspace state:

- evidence informs the inquiry
- evidence activates tensions
- tensions shape decisions
- questions interrogate tensions
- risks threaten unresolved tensions

In the sample run, the graph contains:

```text
18 nodes
28 edges
```

The graph is intentionally plain JSON so another tool could visualize or inspect it later.

## Generated Artifact 3: Reflection Report

`REFLECTION_REPORT.md` is meant for human review.

The important part is not that it declares the work done. It names what should remain visible:

```text
Do not treat unresolved tension as a failure. In this workspace, preserved tension is a
governance signal: it marks where a future run or human reviewer needs explicit judgment.
```

That is the core behavior this demo is trying to make concrete: ambiguity is not discarded just
because a run completed.

## Generated Artifact 4: Continuation Prompt

`CONTINUATION_PROMPT.md` is the prompt a future run would receive.

It includes:

- the current summary
- stabilized decisions
- preserved tensions
- open questions
- known risks
- next actions

This lets a retry or continuation run begin from accumulated state rather than starting cold.

## Handoff State

At the end of the sample pass, the workspace has:

```text
2 decisions preserved
3 tensions preserved
5 open questions preserved
2 known risks preserved
28 rationale graph edges
```

The next run is not asked to solve everything. It is asked to continue from the visible state:

```text
Run a focused review of the active tensions before selecting a primary concept direction.
```

## What This Demonstrates

This demo is not proposing a new orchestration engine. Symphony already provides the shell:

- isolated workspaces
- lifecycle hooks
- retries
- continuation
- observability

The demo explores what can live inside that shell: a persistent cognitive state layer that makes
long-running work more cumulative, inspectable, and handoff-friendly.
