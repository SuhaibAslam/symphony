# Cognitive Workspace Runtime Demo

This example is a small, dependency-free prototype of a cognitive workspace layer on top of
Symphony-style primitives.

It is not an orchestrator and does not call an AI model. Instead, it demonstrates the state
architecture that can sit inside a persistent workspace:

- a bounded inquiry instead of only a ticket
- an executable constitution instead of only a prompt
- reasoning archetypes instead of only a generic agent role
- workspace memory for continuity
- a rationale graph for decisions, evidence, contradictions, and tensions
- a reflection report for human review
- a continuation prompt for the next run

The point is practical: preserve the useful reasoning state that compounds across runs without
requiring a database, vector store, or hidden model memory.

## Run

From the repository root:

```bash
node examples/cognitive-workspace-runtime/runtime.mjs
```

The script will read fixtures, simulate one cognition pass, and write generated artifacts under:

```text
examples/cognitive-workspace-runtime/generated-workspace/
```

Generated artifacts:

- `WORKSPACE_MEMORY.json`
- `RATIONALE_GRAPH.json`
- `REFLECTION_REPORT.md`
- `CONTINUATION_PROMPT.md`
- `RUN_SUMMARY.json`

For a narrative walkthrough of the sample inquiry, see `CASE_STUDY.md`.

Example terminal output:

```text
Cognitive workspace pass complete

Generated artifacts:
- generated-workspace/WORKSPACE_MEMORY.json
- generated-workspace/RATIONALE_GRAPH.json
- generated-workspace/REFLECTION_REPORT.md
- generated-workspace/CONTINUATION_PROMPT.md
- generated-workspace/RUN_SUMMARY.json

Key results:
- 2 decision(s) preserved
- 3 tension(s) preserved
- 5 open question(s) preserved
- 28 rationale graph edge(s)
```

Excerpt from the generated reflection report:

```text
Do not treat unresolved tension as a failure. In this workspace, preserved tension is a
governance signal: it marks where a future run or human reviewer needs explicit judgment.
```

Excerpt from the generated continuation prompt:

```text
Run a focused review of the active tensions before selecting a primary concept direction.
```

Reset generated output:

```bash
node examples/cognitive-workspace-runtime/runtime.mjs --reset
```

## Mapping To Symphony

| Symphony primitive | Cognitive interpretation in this demo |
| --- | --- |
| `WORKFLOW.md` | `constitution.json`: operating policy for the workspace |
| Issue | `inquiry.json`: bounded problem space |
| Workspace | `generated-workspace/`: persistent cognitive state |
| Agent | reasoning archetypes defined in the constitution |
| Retry | reflection/reframing around preserved tensions |
| Observability | rationale graph and reflection report |
| Human review | epistemic governance over open decisions |

## What This Shows

The demo makes the original idea concrete without trying to replace Symphony:

1. A design/research inquiry enters a bounded workspace.
2. The constitution defines what to preserve and what failure modes to avoid.
3. Archetypal passes extract evidence, tensions, decisions, and risks.
4. The runtime writes a rationale graph and memory artifact.
5. The reflection report names unresolved tensions rather than hiding them.
6. The continuation prompt gives the next run compact state instead of raw logs.

This is deliberately modest. It is a working state model, not a grand framework.
