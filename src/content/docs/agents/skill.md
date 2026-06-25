---
title: Skill
description: Install the raph agent skill via skills.sh.
---

For agents that use the [Agent Skills](https://skills.sh) ecosystem, raph ships
an installable skill that teaches the agent to use raph for memory, rules,
documents, handoffs, wikis, and search — through the CLI when no MCP is
connected. The MCP server is still preferred when available.

## Install

```bash
npx skills add tesh254/raph
```

Or target the skill explicitly and an agent:

```bash
npx skills add tesh254/raph --skill raph -a claude-code
```

The skill is also bundled with the Claude Code plugin (see
[Plugins](/agents/plugins/)), so installing the plugin makes it available too.

## What it covers

The skill gives an agent a concise command reference for `raph search`,
`raph mem`, `raph rules`, `raph doc` (including handoff mark-on-read),
`raph export`, `raph crawl`, and indexing/sync — all with JSON output for
machine consumption.
