---
tracker:
  kind: linear
  project_slug: "example"
workspace:
  root: ~/code/symphony-workspaces
hooks:
  after_create: |
    git clone git@github.com:your-org/your-repo.git .
agent:
  max_concurrent_agents: 4
  max_turns: 12
codex:
  command: codex app-server
memory:
  enabled: true
  path: WORKSPACE_MEMORY.json
  max_bytes: 65536
  expose_to_prompt: true
  update:
    after_run: true
    on_failure: true
    on_handoff: true
---

You are working on Linear issue {{ issue.identifier }}.

Title: {{ issue.title }}

Body:
{{ issue.description }}

{% if workspace_memory %}
Prior workspace memory:
{{ workspace_memory.summary }}

Decisions already made:
{% for decision in workspace_memory.decisions %}
- {{ decision.summary }}
{% endfor %}

Open questions:
{% for question in workspace_memory.open_questions %}
- {{ question.question }}
{% endfor %}

Known risks:
{% for risk in workspace_memory.known_risks %}
- {{ risk.summary }}
{% endfor %}
{% endif %}

Work carefully, preserve useful rationale, and leave the workspace in a state that a future run or
human reviewer can understand.

