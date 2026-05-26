# Cognitive Scaffolding Runtime

A small, dependency-free demo for cumulative reasoning inside a persistent Symphony-style
workspace.

The demo runs a product onboarding inquiry through a tiny state machine. It writes a compact state
file, a rationale graph, a reflection report, a continuation prompt, and a run summary.

Everything is local. No model call, no API key, no database, no service setup.

## Why This Exists

Symphony already has useful bones: isolated workspaces, lifecycle hooks, retries, continuation, and
observability.

This demo asks a narrow question:

```text
What state should live inside a workspace so the next run can pick up the reasoning and start warm?
```

The answer here is deliberately small:

- a bounded inquiry
- a constitution for the workspace
- simulated evidence
- stakeholder tensions
- stabilized decisions
- rejected directions
- open questions
- risks
- next actions
- a graph that connects the pieces

## Run

From the repository root:

```bash
node examples/cognitive-scaffolding-runtime/runtime.mjs
```

The script reads fixtures and writes generated artifacts under:

```text
examples/cognitive-scaffolding-runtime/generated-workspace/
```

Generated artifacts:

- `COGNITIVE_STATE.json`
- `RATIONALE_GRAPH.json`
- `REFLECTION_REPORT.md`
- `CONTINUATION_PROMPT.md`
- `RUN_SUMMARY.json`

For the full walkthrough, read `CASE_STUDY.md`.

For the state contract, read `SPEC.md`.

For guidance on making your own version, read `ADAPT.md`.

## Example Output

```text
Cognitive scaffolding pass complete

Generated artifacts:
- generated-workspace/COGNITIVE_STATE.json
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

Reflection excerpt:

```text
Preserved tension is a governance signal. It marks where a future run or human reviewer needs
explicit judgment.
```

Continuation excerpt:

```text
Run a focused review of the active tensions before selecting a primary concept direction.
```

Reset generated output:

```bash
node examples/cognitive-scaffolding-runtime/runtime.mjs --reset
```

## Folder Structure

```text
examples/cognitive-scaffolding-runtime/
  README.md
  CASE_STUDY.md
  SPEC.md
  ADAPT.md
  runtime.mjs
  fixtures/
    constitution.json
    inquiry.json
    signals.json
  generated-workspace/
    .gitignore
    .gitkeep
```

## How It Maps To Symphony

| Symphony primitive | Demo role |
| --- | --- |
| `WORKFLOW.md` | `constitution.json`, the workspace operating policy |
| Issue | `inquiry.json`, the bounded problem space |
| Workspace | `generated-workspace/`, the persistent state boundary |
| Agent | reasoning archetypes in the constitution |
| Retry | continuation from preserved state |
| Observability | rationale graph, reflection report, run summary |
| Human review | explicit judgment over unresolved questions |

## State Model

The runtime writes 5 artifacts:

- `COGNITIVE_STATE.json`: compact state for the next run
- `RATIONALE_GRAPH.json`: evidence, decisions, tensions, questions, and risks as nodes and edges
- `REFLECTION_REPORT.md`: human-readable review surface
- `CONTINUATION_PROMPT.md`: warm-start prompt for a later run
- `RUN_SUMMARY.json`: small operational summary

The generated files are ignored by git. Run the demo to regenerate them.

## What The Demo Produces

1. The inquiry enters a bounded workspace.
2. The constitution defines what should be preserved.
3. The runtime reads evidence, tensions, questions, and risks.
4. It writes a state artifact and a rationale graph.
5. It writes a reflection report for human review.
6. It writes a continuation prompt for the next run.

It is a working state model. Small enough to inspect. Big enough to show the shape.
