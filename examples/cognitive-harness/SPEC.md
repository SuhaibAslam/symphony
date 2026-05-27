# Cognitive Harness Spec

This spec describes the demo contract. It is small on purpose.

The runtime reads 3 inputs and writes 5 artifacts.

## Design Goals

The harness should preserve cognition that matters across runs:

- what is stable
- what was rejected
- what remains unresolved
- what evidence supports the current state
- what a reviewer should inspect
- where the next run should begin

## Inputs

### `fixtures/constitution.json`

The constitution is the workspace policy.

Required fields:

- `id`
- `name`
- `memory.preserve`
- `archetypes`
- `constraints.avoid`
- `reflection`

The constitution tells the runtime what to keep visible across runs.

### `fixtures/inquiry.json`

The inquiry is the bounded problem space.

Required fields:

- `id`
- `title`
- `domain`
- `prompt`
- `stakeholders`
- `tensions`

Each tension needs:

- `id`
- `summary`
- `preserve_reason`
- `tags`

Tensions are first-class state. They are carried forward even when no decision resolves them yet.

### `fixtures/signals.json`

Signals are the evidence and observations for one pass.

Required fields:

- `observed_at`
- `observations`
- `rejected_directions`
- `open_questions`
- `risks`

Signals are deliberately plain JSON. Another system could produce them from logs, notes, interviews,
tests, traces, or review comments.

## Outputs

### `COGNITIVE_STATE.json`

The compact state for the next run.

It includes:

- inquiry identity
- constitution identity
- summary
- decisions
- rejected directions
- tensions
- open questions
- known risks
- evidence
- next actions
- reflection policy

### `RATIONALE_GRAPH.json`

The graph links state together.

Node types:

- `inquiry`
- `evidence`
- `tension`
- `decision`
- `rejected_direction`
- `open_question`
- `risk`

Edge relations:

- `informs`
- `activates`
- `constrains`
- `shapes`
- `stabilizes`
- `bounds`
- `interrogates`
- `threatens`

### `REFLECTION_REPORT.md`

A human-readable review surface.

It names:

- stable decisions
- preserved tensions
- open questions
- known risks
- rationale graph size
- a short reflection note

### `CONTINUATION_PROMPT.md`

A warm-start prompt for the next run.

It carries the current state into a future attempt without replaying raw logs.

### `RUN_SUMMARY.json`

A small operational summary.

It includes generated paths and counts.

## Sample Output

The `sample-output/` directory commits one generated run.

Use it to inspect the end state without running Node locally.

## Runtime Rules

1. Read the inputs.
2. Load prior `COGNITIVE_STATE.json` when present.
3. Collect evidence from observations.
4. Activate tensions from tags.
5. Preserve decisions and rejected directions.
6. Generate open questions from explicit questions and active tensions.
7. Add risks.
8. Write state, graph, reflection, continuation, and summary artifacts.

## Safety Rules

- Keep generated artifacts inside `generated-workspace/`.
- Keep the committed fixtures generic.
- Keep secrets out of fixtures and generated files.
- Keep generated artifacts ignored by git.
- Prefer JSON for machine-readable state and Markdown for human handoff.

## Fit With Symphony

Symphony can provide the workspace, lifecycle, retry, continuation, and observability shell.

This demo focuses on the state that can live inside that shell.
