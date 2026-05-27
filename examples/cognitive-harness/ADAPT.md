# Make It Your Own

Use this demo as a pattern, then replace the fixtures.

The product onboarding example is a template. Use it to decide what cognition your own workspace
should preserve, then make that state explicit.

## 1. Pick A Harness Challenge

Choose the cognition problem you want the workspace to preserve.

Useful starting points:

- continuity across retries or handoffs
- unresolved tension tracking
- evidence and contradiction handling
- human review of reasoning state
- recovery after failed attempts

## 2. Pick A Bounded Inquiry

Start with a problem that has real ambiguity.

Good examples:

- onboarding a complex product
- planning a migration
- exploring a product strategy
- reviewing a risky architecture change
- preparing a research synthesis

Weak examples:

- a tiny bug fix
- a one-command task
- anything with no meaningful tradeoff

## 3. Write The Inquiry

Edit `fixtures/inquiry.json`.

Keep it specific:

- title
- domain
- prompt
- stakeholders
- tensions

Tensions matter. They are the parts a future run should keep seeing.

## 4. Write The Constitution

Edit `fixtures/constitution.json`.

Choose:

- what state gets preserved
- which archetypes inspect the work
- which failure modes to avoid
- when reflection should happen

The included archetypes are:

- `explorer`
- `critic`
- `synthesizer`

Those are boring names in a good way. They are easy to replace.

## 5. Add Signals

Edit `fixtures/signals.json`.

Signals can come from:

- notes
- logs
- tests
- interviews
- design critique
- review comments
- incidents
- planning docs

Each observation can carry tags. Tags activate tensions.

## 6. Run The Demo

```bash
node examples/cognitive-harness/runtime.mjs
```

Read the generated files:

- `generated-workspace/COGNITIVE_STATE.json`
- `generated-workspace/RATIONALE_GRAPH.json`
- `generated-workspace/REFLECTION_REPORT.md`
- `generated-workspace/CONTINUATION_PROMPT.md`
- `generated-workspace/RUN_SUMMARY.json`

Compare them with `sample-output/` if you want a known-good run.

## 7. Check The Handoff

Ask 3 questions:

```text
Can a future run see what is stable?
Can a reviewer see what still needs judgment?
Can the next prompt start from state instead of from scratch?
```

If the answer is yes, the harness is doing its job.

## 8. Decide What To Keep Stable

A useful harness has a stable core and a flexible edge.

Keep stable:

- artifact names
- required state fields
- graph node and edge shape
- reflection report purpose
- continuation prompt purpose

Customize:

- domain
- archetypes
- tension tags
- evidence sources
- review policy
- next-action logic

## 9. Connect It To A Real Harness

For a Symphony-style implementation, the natural attachment points are:

- after workspace creation: write or load the starting inquiry
- after agent failure: update risks, failed attempts, and recovery notes
- before retry: load `COGNITIVE_STATE.json`
- before human review: write `REFLECTION_REPORT.md`
- before continuation: write `CONTINUATION_PROMPT.md`

That keeps the harness operational. It produces files a run can consume and a reviewer can inspect.
