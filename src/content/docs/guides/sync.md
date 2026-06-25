---
title: Realtime sync
description: Keep the graph current automatically as an agent works.
---

When an agent works on a codebase, raph keeps the graph updated in the
background so lookups always reflect the latest code.

## How it works

A filesystem watcher observes the indexed repositories. On a save it coalesces
events with a ~150ms debounce, then incrementally re-indexes only the files
that changed. Directories like `.git`, `node_modules`, `vendor`, and `dist` are
ignored. A periodic reconcile catches anything missed and picks up newly
registered repositories; if a watcher can't be created, raph falls back to
polling.

## Commands

```bash
raph init --path .       # index and arm the watcher
raph sync --path .       # ensure the background worker is running
raph sync --status       # show worker status and registered repos
raph sync --stop         # stop the background worker
raph sync --remove --path .   # stop syncing a repo (and drop its graph data)
```

The worker starts automatically on `raph init` and when the MCP server starts,
so in normal use you never manage it directly.
