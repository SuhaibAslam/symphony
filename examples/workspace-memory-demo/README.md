# Workspace Memory Continuity Demo

This is a small end-to-end demonstration of workspace-local memory for Symphony-style runs.

It shows how a first run can leave behind a compact state artifact, and how a continuation run can
use that artifact instead of rediscovering prior decisions from raw logs or hidden model context.

The demo is intentionally simple:

- no external services
- no package install
- no API keys
- no local machine paths in committed files
- no database or vector store

## Run

From the repository root:

```bash
node examples/workspace-memory-demo/demo.mjs
```

The script will:

1. read a fixture issue
2. simulate a first run that made decisions and hit unresolved work
3. write `demo-workspace/WORKSPACE_MEMORY.json`
4. validate the memory artifact
5. render the continuation prompt that a future run would receive

To reset the generated memory file:

```bash
node examples/workspace-memory-demo/demo.mjs --reset
```

## Why This Exists

Symphony already preserves per-issue workspaces across retries and continuation runs. This demo
explores one small extra convention: a workspace-local state file that captures the useful context a
future run or human reviewer should not have to reconstruct.

This pattern is useful when a run:

- makes architectural or implementation decisions
- rejects a tempting direction
- discovers a failing validation path
- leaves unresolved questions for a human
- needs a future agent turn to continue without starting cold

## Files

- `demo.mjs`: runnable continuity demo
- `fixtures/issue.json`: sample normalized issue
- `fixtures/first-run-observations.json`: sample state extracted from a first run
- `demo-workspace/.gitkeep`: placeholder for generated output

Generated file:

- `demo-workspace/WORKSPACE_MEMORY.json`
