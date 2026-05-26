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

The goal is simple: show how a persistent workspace can carry reasoning state across runs.
