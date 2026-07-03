---
title: Search
description: Agent-friendly CLI search over the indexed graph.
---

`raph search` looks up code, docs, and knowledge in the graph from the CLI when
an agent does not have the raph MCP server connected. It uses familiar search
switches, so agents can get better graph-backed results without learning a new
query language. It emits JSON when called by an agent or through a pipe, and
compact text in a terminal.

## Modes

```bash
raph search "database connection"        # ranked keyword (bm25), default
raph search "ResponseWriter" --literal   # exact substring
raph search "Open[A-Z]\w+" --regex        # Go regexp
raph search "config loader" --vector      # semantic graph search (needs provider)
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
Default mode is ranked keyword search; `--literal` performs exact substring
search; `--regex` uses Go `regexp`; `--vector` searches indexed graph nodes with
embeddings. In JSON mode results come back as a structured `matches` array ready
for an agent to consume.

The same engine is exposed to agents as the MCP `search` tool when MCP is
available — see [MCP & CLI](/agents/mcp-and-cli/).
