---
title: Search
description: Ripgrep-style search over the indexed graph.
---

`raph search` looks up code, docs, and knowledge in the graph with familiar
ripgrep ergonomics — no raph-specific query syntax to learn. It emits JSON when
called by an agent or through a pipe, and text in a terminal.

## Modes

```bash
raph search "database connection"        # ranked keyword (bm25), default
raph search "ResponseWriter" --literal   # exact substring
raph search "Open[A-Z]\w+" --regex        # regular expression
raph search "config loader" --vector      # semantic (needs an embedding provider)
```

## Filters

```bash
raph search "auth" --type func --type type   # only functions and types
raph search "TODO" --global                    # across all workspaces
raph search "handler" --path ../other-repo     # scope to a specific workspace
raph search "router" --limit 20
```

Node types include `func`, `type`, `file`, `markdown_chunk`, `file_chunk`,
`doc`, and `doc_chunk`.

## Output

Each match returns the node id, type, name, url (`path#symbol`), and an excerpt.
In text mode results are grouped ripgrep-style by location; in JSON mode they
come back as a structured `matches` array ready for an agent to consume.

The same engine is exposed to agents as the MCP `search` tool — see
[MCP & CLI](/agents/mcp-and-cli/).
