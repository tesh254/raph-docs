---
title: Concepts
description: The graph model, workspaces, scopes, and how raph stays current.
---

## The graph

raph stores everything as **nodes** and **edges** in a local SQLite database
(`~/.raph/data/brain.db`). Nodes are files, code symbols (functions, types),
document chunks, memory records, rules, and local documents. Edges connect them
— a file `DECLARES` a function, a document `HAS_CHUNK` chunks, a note
`RELATES_TO` a symbol.

Every node carries typed **properties** (JSON) and timestamps, so documents can
record their `doc_type`, `status`, and freshness, and listings can filter on
them.

## Fast lookup

A trigram **FTS5** index over node text powers ranked keyword search (bm25),
literal substring search, and is the candidate source for regex search — all
without loading every node into memory. The index is kept in lockstep with
every write, so results are never stale.

Vector (semantic) search is available when an embedding provider is configured,
ranked by cosine similarity.

## Workspaces

Each indexed codebase is a **workspace**, identified by its git root (or path).
Searches and documents can be scoped to one workspace or run globally across
all of them.

## Scopes

Memory and rules are **scoped**:

- **project** — tied to the current codebase's identity.
- **shared** — keyed by an explicit id you choose, to share across repos.
- **global** — affects all of your work.

This lets an agent tell apart what governs the whole development cycle from what
applies to a single codebase.

## Staying current

A filesystem watcher (fsnotify) reacts to saves with a short debounce and
incrementally re-indexes only the changed files, so the graph refreshes within
a few hundred milliseconds. A periodic reconcile runs as a safety net and the
system degrades to polling if a watcher cannot be created.
