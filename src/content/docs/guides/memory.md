---
title: Memory
description: Durable, scoped memory for agents.
---

Memory records are durable facts an agent should remember across sessions. Each
record has a scope, a knowledge type, a stable key, and revision history.

## Scopes

- **project** — affects only the current codebase. The id is derived from the
  enclosing git worktree root, so every subdirectory of a repository resolves to
  the same project.
- **shared** — keyed by an explicit id, to share across repos.
- **global** — affects all of your work, across every project and every agent.
  It uses a single fixed bucket, so two agents writing the same preference land
  on the same record instead of duplicating it.

### Project identity

A project id is `project:<sha1>` over the resolved worktree root. Symlinks are
followed first, so a repository reached through two paths is one project. Set
`project.identity_override` in `~/.raph/raph.json` to pin one identity when the
same repo is checked out in several places.

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

## Agents and MCP

Agents reach memory through `search_memory`, `store_memory`, `update_memory`,
`deprecate_memory`, and `get_memory_history`.

**Recall is one tool.** `search_memory` takes a query and ranks *every* memory by
meaning — this project's, other projects', shared, and global — then boosts the
memories belonging to the project you are working in. It has no scope filter, so
a lookup cannot be narrowed to a scope that turns out to be empty, and a global
preference is never hidden by a project search.

**Pass `working_directory`.** Every memory tool accepts the absolute path the
agent is working in, and raph derives the project from it:

```json
{
  "tool": "search_memory",
  "arguments": {
    "query": "how do we deploy",
    "working_directory": "/abs/path/to/repo"
  }
}
```

This matters because the MCP server's own working directory is wherever the
client launched it — often unrelated to the code being worked on. Without
`working_directory`, a memory can be filed under, or recalled from, a project
that has nothing to do with the task at hand.

For a project-scoped write, supply `working_directory` and omit `scope_id`; for
a global write, `scope_type: "global"` needs no `scope_id` at all. Only `shared`
requires one, because it names the group the memory is shared with.
