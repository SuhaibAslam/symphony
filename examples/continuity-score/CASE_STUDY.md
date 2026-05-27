# Case Study: Complex Product Onboarding

This case study follows one inquiry through the demo.

## Starting Point

The input is a product design inquiry:

```text
Design a clearer onboarding experience for a complex product.
```

The inquiry has 5 stakeholders:

- new user
- power user
- operations lead
- support team
- policy reviewer

It also has 3 tensions baked into the brief. The runtime keeps those tensions visible throughout
the pass.

## The Problem

A one-shot run can produce a decent concept summary. The brittle part is continuity.

The next run still needs to know:

- which decisions are stable
- which directions were rejected
- which tensions are still active
- which risks need review
- which questions need a human
- where the next run should begin

Raw logs can answer those questions, but only after someone digs through them with a tiny shovel.

## Input Artifacts

The demo uses 3 committed fixtures.

`fixtures/inquiry.json`

The bounded problem space: stakeholders, prompt, and tensions.

`fixtures/constitution.json`

The operating policy: what to preserve, which archetypes participate, what failure modes to avoid,
and when reflection happens.

`fixtures/signals.json`

Simulated evidence: observations, rejected directions, open questions, and risks.

## Run

From the repository root:

```bash
node examples/continuity-score/runtime.mjs
```

The runtime writes 5 generated artifacts under `generated-workspace/`.

## Artifact 1: Continuity State

`CONTINUITY_STATE.json` is the compact state file.

It preserves:

- inquiry identity
- constitution identity
- stable decisions
- rejected directions
- active tensions
- open questions
- risks
- evidence
- next actions

A later run can load this file and start from accumulated state.

## Artifact 2: Rationale Graph

`RATIONALE_GRAPH.json` connects the pieces.

In the sample run:

```text
18 nodes
28 edges
```

The edges capture relationships like:

- evidence informs the inquiry
- evidence activates tensions
- tensions shape decisions
- questions interrogate tensions
- risks threaten unresolved tensions

The graph is plain JSON so another tool can inspect or visualize it.

## Artifact 3: Reflection Report

`REFLECTION_REPORT.md` is written for human review.

The key line:

```text
Preserved tension is a governance signal. It marks where a future run or human reviewer needs
explicit judgment.
```

The report names stable decisions, active tensions, open questions, risks, and graph counts.

## Artifact 4: Continuation Prompt

`CONTINUATION_PROMPT.md` gives the next run a compact starting point.

It carries:

- current summary
- decisions
- preserved tensions
- open questions
- known risks
- next actions

The first next action is:

```text
Run a focused review of the active tensions before selecting a primary concept direction.
```

## Handoff State

The sample pass ends with:

```text
2 decisions preserved
3 tensions preserved
5 open questions preserved
2 known risks preserved
28 rationale graph edges
```

That state is enough for a reviewer or continuation run to see what has stabilized and what still
needs judgment.

## Why This Belongs Near Symphony

Symphony supplies the execution shell:

- isolated workspaces
- lifecycle hooks
- retries
- continuation
- observability

This demo puts a compact reasoning state inside that shell.

The result is a workspace that carries memory, rationale, tension, reflection, and handoff context
across runs.
