---
title: Concepts
description: The graph model, workspaces, scopes, and how raph stays current.
---

## The graph

raph stores everything as **nodes** and **edges** in a local SQLite database
(`~/.raph/data/brain.db`). Nodes are files, code symbols, document chunks,
memory records, rules, and local documents. Edges connect them — a file
`DECLARES` a function, a document `HAS_SECTION`/`HAS_CHUNK` chunks, and a symbol
`USES` or `MUTATES` another.

Code symbols are extracted per language: functions and types, plus the
**variable kinds** agents most often hallucinate about — package-level `var` and
`const` declarations are each indexed as their own node, so you can ask "where is
this global read or written?" and get an answer from the graph. See
[Symbol & node types](/reference/node-types/) for the full set of node types,
edge types, and the properties each carries.

Every node carries typed **properties** (JSON) and timestamps. Code symbols tag
`global=true` and `decl=var|const` (and `lang=<grammar>` for non-Go languages);
documents record their `doc_type`, `status`, and freshness — so listings can
filter on them.

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

## Memory footprint

raph is built to stay light. Indexing streams its work — the symbol index is
loaded with a lean projection (no content or embeddings), per-run caches are
released as soon as they're done, and reference edges are flushed in bounded
batches rather than held in memory. The studio graph and stats views read
through a lean query that caps node content in SQL and never loads embedding
vectors.

As a backstop, startup installs a **soft heap ceiling** (Go's
`debug.SetMemoryLimit`): it honors `GOMEMLIMIT` if you set it, then
`RAPH_MEMORY_LIMIT` (e.g. `RAPH_MEMORY_LIMIT=2GiB`), otherwise defaults to 80%
of detected host/cgroup memory. It is *soft* — the GC works harder near the
ceiling instead of crashing — so it guards against runaway memory without
slowing normal runs.

## Staying current

A filesystem watcher (fsnotify) reacts to saves with a short debounce and
incrementally re-indexes only the changed files, so the graph refreshes within
a few hundred milliseconds. A periodic reconcile runs as a safety net and the
system degrades to polling if a watcher cannot be created.
