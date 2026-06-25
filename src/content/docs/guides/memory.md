---
title: Memory
description: Durable, scoped memory for agents.
---

Memory records are durable facts an agent should remember across sessions. Each
record has a scope, a knowledge type, a stable key, and revision history.

## Scopes

- **project** — affects only the current codebase (id derived from its git root).
- **shared** — keyed by an explicit id, to share across repos.
- **global** — affects all of your work.

## Knowledge types

`decision`, `workflow`, `preference`, `incident` (and `rule` — see
[Rules](/guides/rules/)).

## Commands

```bash
raph mem set "We use modernc sqlite (no cgo)" \
  --scope project --type decision --title "sqlite driver"

raph mem set "Prefer small PRs" \
  --scope global --type preference --title "PR size"

raph mem search "sqlite" --scope project
raph mem rm <node_id> --reason "superseded"
```

`mem set` is idempotent: writing the same scope/type/key again updates the
record and keeps the previous version in history.

## Attribution

Set `RAPH_WRITER=<your-agent-id>` so memory writes are attributed to the agent
that made them.

Agents can also reach memory through the MCP tools `store_memory`,
`update_memory`, `deprecate_memory`, `search_project_knowledge`,
`search_shared_knowledge`, and `search_global_preferences`.
