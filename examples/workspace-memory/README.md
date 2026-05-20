# Workspace Memory Example

This example demonstrates a workspace-local memory pattern for Symphony-style runs.

Workspace memory is a small, structured state file that lives inside a per-issue workspace. It gives
future retries, continuation runs, and human reviewers a compact view of prior decisions, unresolved
questions, failed attempts, validation evidence, and next actions.

It is not a replacement for logs, tracker state, or `WORKFLOW.md`. It is a bounded handoff artifact
that implementations can choose to load into prompt templates as `workspace_memory`.

## Files

- `WORKFLOW.md` shows an example `memory` front matter block and prompt usage.
- `WORKSPACE_MEMORY.json` shows the recommended state shape.

## Demo Flow

1. A first run starts with no memory file. The prompt renders from the issue and workflow.
2. The run makes decisions, hits a test failure, and stops before completion.
3. The implementation writes `WORKSPACE_MEMORY.json` in the issue workspace.
4. A retry or later continuation run loads the memory file and exposes it as `workspace_memory`.
5. The prompt can now avoid repeating prior exploration and can focus on the unresolved state.

This keeps the extension useful even for implementations that do not support native memory writes
yet: a hook, operator script, or agent instruction can produce the same workspace-local file.
