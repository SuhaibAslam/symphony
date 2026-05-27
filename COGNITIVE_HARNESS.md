# Cognitive Harness

Cognitive Harness is a working demo for cognition-shaped workspaces on top of Symphony primitives.

It gives an agent run a bounded inquiry, a workspace policy, preserved state, a rationale graph, a
reflection surface, and a continuation prompt.

The demo lives under:

```text
examples/cognitive-harness/
```

![Cognitive Harness architecture](examples/cognitive-harness/media/cognitive-harness-architecture.svg)

## The Challenge

Symphony can create isolated workspaces and run agents against tracked work. That gives the work a
clean execution boundary.

The next boundary is cognition. A later run should be able to see what already happened without
reading an entire transcript. A reviewer should be able to see unresolved judgment calls without
guessing which summary sentence hides them.

This shows up as several practical problems:

- **continuity loss**: the next run repeats work or misses prior constraints
- **tension collapse**: unresolved tradeoffs get flattened into tidy summaries
- **weak review surfaces**: humans see outputs without the reasoning structure around them
- **brittle recovery**: retries restart from task text instead of accumulated state
- **domain drift**: each team invents its own ad hoc memory shape

## The Direction

This branch treats the workspace as a cognitive harness.

A run reads a bounded inquiry, a workspace constitution, and simulated signals. It writes the state
the next run needs:

- stable decisions
- rejected directions
- active tensions
- open questions
- known risks
- evidence
- next actions
- a rationale graph connecting the pieces

The idea is inspired by cognitive scaffolding: make the working structure visible enough that the
next person or run can continue the thought without starting cold.

The current runtime is intentionally small and deterministic. The contribution is the shape: what
gets preserved, how it is connected, and where a future Symphony implementation could attach real
agent traces, review comments, tests, or operator notes.

## Opportunity Directions

The demo focuses on continuity because it is easy to prove with files. The same harness shape could
support broader cognition work:

- **design cognition**: preserve critique history, stakeholder tensions, rejected concepts, and rationale
- **research synthesis**: track hypotheses, evidence, contradictions, confidence, and open questions
- **strategy work**: carry assumptions, scenarios, tradeoffs, signals, and decision checkpoints
- **architecture review**: keep constraints, risks, alternatives, prior failures, and recovery notes visible

Those directions should stay concrete. The harness is useful only when it produces artifacts a run,
reviewer, or operator can actually inspect.

## What Is Included

- `README.md` explains the demo.
- `CASE_STUDY.md` walks through the product onboarding example.
- `SPEC.md` defines the state contract.
- `ADAPT.md` shows how to make your own version.
- `runtime.mjs` runs the demo.
- `sample-output/` shows generated artifacts from one run.
- `media/` contains the architecture and output preview images.

Run it from the repo root:

```bash
node examples/cognitive-harness/runtime.mjs
```

The runtime writes:

- `COGNITIVE_STATE.json`
- `RATIONALE_GRAPH.json`
- `REFLECTION_REPORT.md`
- `CONTINUATION_PROMPT.md`
- `RUN_SUMMARY.json`

The sample output is committed, so the branch is inspectable even before you run it.
