---
title: Plugins
description: Install raph as a packaged plugin for your agent.
---

raph ships as a plugin for the major coding agents. The plugin wires up the MCP
server so the tools are available immediately.

## Claude Code

raph is a Claude Code plugin under `plugins/raph` with a marketplace at the repo
root. Add the marketplace and install:

```bash
/plugin marketplace add tesh254/raph
/plugin install raph@raph
```

The plugin loads the bundled MCP server (`raph start`) and the raph skill.

## OpenCode

The repo ships an `opencode.json` and a plugin under `.opencode/plugins`. raph
registers as a local MCP server (`type: local`, `command: ["raph", "start"]`).

## Codex

A Codex plugin lives at `plugins/raph/.codex-plugin`. For a direct config,
`raph agents mcp setup` writes `[mcp_servers.raph]` into `.codex/config.toml`.

## Any agent

If your agent reads a standard MCP config, run:

```bash
raph agents mcp setup --path .
```

Use `raph agents mcp setup --path . --dry-run` to preview generated project
config before writing.
