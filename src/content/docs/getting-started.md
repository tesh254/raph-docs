---
title: Getting started
description: Install raph, index a codebase, and connect your agent.
---

raph is a single Go binary. It stores everything locally under `~/.raph` — no
server, no account, no network required for the core graph.

## Install

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/tesh254/raph/main/install.sh | sh
```

Or build from source:

```bash
git clone https://github.com/tesh254/raph
cd raph
go build -o raph ./cmd/raph
```

## Index a codebase

```bash
raph init --path .
```

This scans the workspace, builds the graph, and arms a background watcher that
keeps the graph current as you edit.

## Optional: enable semantic search

Keyword, literal, and regex search work fully offline. To also enable vector
(semantic) search, configure an embedding provider:

```bash
raph config init
# then set OPENROUTER_API_KEY in your environment
```

## Connect an agent

Install the project MCP config for supported agents:

```bash
raph agents mcp setup --path .
```

This writes the right config for OpenCode, Claude Code, Codex, Cursor, and Pi.
See [MCP & CLI](/agents/mcp-and-cli/) for details, or [Plugins](/agents/plugins/)
to install raph as a packaged plugin.

## Try it

```bash
raph search "database connection" --limit 5
raph mem set "We use modernc sqlite (no cgo)" --type decision --title "sqlite driver"
raph rules add "Run go test before commit" --scope project
```
