---
title: MCP & CLI
description: Two equivalent ways for agents to use raph.
---

raph exposes the same capabilities two ways. **Prefer MCP** when it is
connected; fall back to the CLI otherwise.

## MCP server

Start the server (stdio):

```bash
raph start
```

Install project config for supported agents automatically:

```bash
raph agents mcp setup --path .
```

This writes the correct config for OpenCode (`opencode.json`), Claude Code
(`.mcp.json`), Codex (`.codex/config.toml`), Cursor (`.cursor/mcp.json`), and Pi
(`.pi/mcp.json`).

### Tools

- `search` — ripgrep-style search (auto/literal/regex/vector, type & scope filters)
- `search_codebase`, `index_codebase`
- `store_memory`, `update_memory`, `deprecate_memory`, `get_memory_history`
- `search_project_knowledge`, `search_shared_knowledge`, `search_global_preferences`
- `store_rule`, `list_rules`
- `add_document`, `list_documents`, `read_document`, `link_nodes`
- `crawl_url`, `crawl_website`
- `graph_neighbors`, `graph_neighbors_cross_corpus`, `best_vector_match`

## CLI for agents

Every command takes `--format json|text`. raph defaults to JSON when it detects
it is being called by an agent (via the `RAPH_FORMAT`/`RAPH_JSON` env or a
non-terminal stdout), and to text in an interactive terminal. So an agent can
just run:

```bash
raph search "auth middleware" --type func
raph mem search "deployment" --scope project
raph rules list --all
raph doc list --type handoff
```

and parse the JSON, with no flags required. Humans get readable output
automatically.
