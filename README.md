# Cognitive Harness

Branch demo for cognition-shaped workspaces on top of Symphony primitives.

Symphony turns tracked work into isolated implementation runs. It gives Codex a practical execution
substrate: workspace isolation, lifecycle hooks, retries, observability, and human review.

That leaves a second layer worth exploring: the reasoning state around the run.

Long-running agent work can lose useful cognition between attempts. A later run may repeat prior
exploration, miss rejected directions, flatten unresolved tradeoffs, or hand a reviewer a final
answer without the judgment structure around it.

This branch proposes **Cognitive Harness**: a small working structure for bounded inquiry,
workspace policy, preserved reasoning state, rationale, reflection, and continuation. It keeps
continuity concrete while pointing at a broader pattern for cumulative cognition in agent harnesses.

```mermaid
flowchart TB
    work["Tracked work<br/>Issue, task, or project request"] --> workspace["Isolated workspace<br/>Files, hooks, retries, logs"]
    workflow["Workflow policy<br/>WORKFLOW.md and repo guidance"] --> workspace
    workspace --> codex["Codex run<br/>Implementation pass"]
    codex --> normal["Normal run output<br/>Diffs, tests, summaries, review evidence"]

    workspace --> harness["Cognitive Harness layer"]
    codex --> harness

    subgraph harness_detail["What the harness preserves"]
        inquiry["Bounded inquiry<br/>Problem, stakeholders, tensions"]
        constitution["Workspace constitution<br/>Policy, archetypes, constraints"]
        signals["Signals<br/>Evidence, rejected directions, risks"]
        state["Cognitive state<br/>Stable decisions and open questions"]
        graph["Rationale graph<br/>Why things connect"]
        reflection["Reflection report<br/>Human review surface"]
        continuation["Continuation prompt<br/>Warm start for the next run"]
    end

    harness --> inquiry
    harness --> constitution
    harness --> signals
    inquiry --> state
    constitution --> state
    signals --> graph
    state --> reflection
    graph --> reflection
    state --> continuation
    graph --> continuation

    reflection --> reviewer["Reviewer<br/>Inspect judgment"]
    continuation --> retry["Retry or later run<br/>Resume with context"]
    normal --> reviewer

    classDef substrate fill:#eef6ff,stroke:#2563eb,color:#172554,stroke-width:1px
    classDef harness fill:#f5f3ff,stroke:#7c3aed,color:#2e1065,stroke-width:1px
    classDef artifact fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:1px
    classDef human fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:1px

    class work,workspace,workflow,codex,normal substrate
    class harness,inquiry,constitution,signals harness
    class state,graph,reflection,continuation artifact
    class reviewer,retry human
```

## What Changed In This Branch

- Added a branch guide: [COGNITIVE_HARNESS.md](COGNITIVE_HARNESS.md)
- Added a runnable example: [examples/cognitive-harness/](examples/cognitive-harness/)
- Added a case study with 5 stakeholders and 3 preserved tensions
- Added a deterministic runtime that writes state, graph, reflection, continuation, and summary artifacts
- Added committed sample output from one run, including 28 rationale graph edges
- Added a state contract, adaptation guide, integration guide, and future development notes

## What The Runtime Does

The runtime is a fixture-backed demonstrator. It does real file generation, but it reads committed
sample inputs instead of live Symphony run traces.

That is deliberate. The branch proves the artifact shape first:

- what state should be preserved
- how rationale should be connected
- what a reviewer should inspect
- where a continuation run should begin
- where real harness integration could attach

## Reader Path

1. Read [COGNITIVE_HARNESS.md](COGNITIVE_HARNESS.md) for the challenge, approach, and open questions.
2. Inspect [sample-output/](examples/cognitive-harness/sample-output/) to see one generated run.
3. Run the demo locally.
4. Use [ADAPT.md](examples/cognitive-harness/ADAPT.md) to apply the harness shape to your own workflow.
5. Use [INTEGRATE.md](examples/cognitive-harness/INTEGRATE.md) to see where it could live in a real harness.

Run it from the repo root:

```bash
node examples/cognitive-harness/runtime.mjs
```

The original Symphony README continues below.

# Symphony

Symphony turns project work into isolated, autonomous implementation runs, allowing teams to manage
work instead of supervising coding agents.

[![Symphony demo video preview](.github/media/symphony-demo-poster.jpg)](.github/media/symphony-demo.mp4)

_In this [demo video](.github/media/symphony-demo.mp4), Symphony monitors a Linear board for work and spawns agents to handle the tasks. The agents complete the tasks and provide proof of work: CI status, PR review feedback, complexity analysis, and walkthrough videos. When accepted, the agents land the PR safely. Engineers do not need to supervise Codex; they can manage the work at a higher level._

> [!WARNING]
> Symphony is a low-key engineering preview for testing in trusted environments.

## Running Symphony

### Requirements

Symphony works best in codebases that have adopted
[harness engineering](https://openai.com/index/harness-engineering/). Symphony is the next step --
moving from managing coding agents to managing work that needs to get done.

### Option 1. Make your own

Tell your favorite coding agent to build Symphony in a programming language of your choice:

> Implement Symphony according to the following spec:
> https://github.com/openai/symphony/blob/main/SPEC.md

### Option 2. Use our experimental reference implementation

Check out [elixir/README.md](elixir/README.md) for instructions on how to set up your environment
and run the Elixir-based Symphony implementation. You can also ask your favorite coding agent to
help with the setup:

> Set up Symphony for my repository based on
> https://github.com/openai/symphony/blob/main/elixir/README.md

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).
