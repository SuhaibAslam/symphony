# Integration Guide

This demo is intentionally local and deterministic.

It uses committed fixtures instead of live Symphony traces. That keeps the idea easy to inspect, but
it also means `runtime.mjs` is a demonstrator. It proves the artifact shape and handoff flow. A real
harness would feed it run events, review comments, failure notes, traces, or operator decisions.

## Where This Could Live

In a Codex-oriented repository, the harness should live where agents already look for repo-local
knowledge.

One practical layout:

```text
AGENTS.md
docs/
  harness/
    cognitive-harness.md
    cognitive-state.schema.json
    rationale-graph.schema.json
    review-policy.md
    examples/
      product-onboarding/
workspaces/
  <issue-or-run-id>/
    COGNITIVE_STATE.json
    RATIONALE_GRAPH.json
    REFLECTION_REPORT.md
    CONTINUATION_PROMPT.md
```

`AGENTS.md` should stay short. It can point agents to the harness docs instead of carrying the full
policy inline.

For a Symphony-style repo, the same pattern can sit beside `WORKFLOW.md`:

```text
WORKFLOW.md
docs/
  harness/
examples/
  cognitive-harness/
workspace-root/
  <tracker-id>/
    COGNITIVE_STATE.json
    RATIONALE_GRAPH.json
    REFLECTION_REPORT.md
    CONTINUATION_PROMPT.md
```

## How To Wire It Into Runs

The demo has 3 fixture inputs:

- `inquiry.json`
- `constitution.json`
- `signals.json`

A real harness would replace those with live sources.

Suggested mapping:

| Demo input | Real source |
| --- | --- |
| `inquiry.json` | issue, Linear ticket, PR goal, project brief, research question |
| `constitution.json` | `WORKFLOW.md`, `AGENTS.md`, repo harness docs, review policy |
| `signals.json` | logs, tests, traces, review comments, agent notes, failed attempts |

Suggested lifecycle:

1. On workspace creation, write the initial inquiry and load the constitution.
2. Before an agent run, inject the latest `COGNITIVE_STATE.json` or its summary.
3. After failure, append failed attempts, risks, and recovery notes.
4. Before retry, generate a fresh `CONTINUATION_PROMPT.md`.
5. Before human review, publish `REFLECTION_REPORT.md`.
6. After review, update decisions, open questions, and rejected directions.

## What To Keep Stable

Keep these artifacts stable so tools and agents can rely on them:

- `COGNITIVE_STATE.json`
- `RATIONALE_GRAPH.json`
- `REFLECTION_REPORT.md`
- `CONTINUATION_PROMPT.md`
- `RUN_SUMMARY.json`

Keep these semantics stable:

- decisions can be carried forward
- rejected directions should stay visible
- active tensions require judgment
- open questions need owners or evidence
- risks should shape the next pass

## What To Customize

Customize the harness for the work:

- archetypes
- evidence sources
- tension tags
- review cadence
- graph relations
- next-action rules
- stale-memory policy

For coding work, the harness might preserve architectural tradeoffs and failed test attempts.

For research work, it might preserve hypotheses, citations, contradictions, and confidence changes.

For design work, it might preserve critique history, stakeholder tensions, rejected concepts, and
rationale.

## Practical Next Step

The smallest real integration would be a post-run script:

```bash
node examples/cognitive-harness/runtime.mjs
```

Then replace `fixtures/signals.json` with a file generated from real run data.

After that, the useful next step is schema validation. Once the state and graph contract are
validated, other tools can safely consume them.
