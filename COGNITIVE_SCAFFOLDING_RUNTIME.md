# Cognitive Scaffolding Runtime Demo

This branch contains a self-contained demo under:

```text
examples/cognitive-scaffolding-runtime/
```

Start there:

- `README.md` explains the demo.
- `CASE_STUDY.md` walks through the product onboarding example.
- `SPEC.md` defines the state contract.
- `ADAPT.md` shows how to make your own version.
- `runtime.mjs` runs the demo.
- `sample-output/` shows generated artifacts from one run.

Run it from the repo root:

```bash
node examples/cognitive-scaffolding-runtime/runtime.mjs
```

The runtime writes:

- `COGNITIVE_STATE.json`
- `RATIONALE_GRAPH.json`
- `REFLECTION_REPORT.md`
- `CONTINUATION_PROMPT.md`
- `RUN_SUMMARY.json`

## Branch Story

Symphony already gives agent work a practical shell: isolated workspaces, lifecycle hooks, retries,
continuation, and reviewable artifacts.

The gap explored here is continuity between runs. When a run stops, retries, or hands off to a
person, useful reasoning should survive as structured state, with raw logs still available for
detail.

The design note behind this branch framed agent work as cognitive scaffolding: preserve the inquiry,
the tensions, the rationale, the reflection, and the next move. This demo turns that frame into a
small runtime you can inspect and run.

The goal is simple: show how a persistent workspace can carry reasoning state across runs.
