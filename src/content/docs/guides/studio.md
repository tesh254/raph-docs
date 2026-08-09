---
title: Studio
description: Inspect projects, repositories, memory, and the graph in a local dashboard.
---

Studio serves a local dashboard over the same graph your agents read. Start it
with:

```bash
raph studio --port 4545
```

It binds to `127.0.0.1` and opens at `http://localhost:4545`. Use
`raph --verbose studio` when something looks wrong.

The dashboard at [raph-studio](https://github.com/tesh254/raph-studio) is a
separate frontend that reads this same local API, so both views show identical
data.

:::caution[Trust boundary]
Studio's API is local-only and unauthenticated, and some endpoints delete graph
data. Run it on machines you trust.
:::

## Projects and repositories

**Projects** is the view to reach for when recall looks wrong. A project is what
memories and documents are scoped to, and one project can hold several indexed
repositories — a monorepo's packages each index separately but share a project.
Each entry shows:

- the **project id** (`project:<sha1>`), the scope value memories and documents
  are stored under. This is what explains why two repositories recall different
  things.
- the repositories indexed under it, with their roots and file counts
- how many files, directories, memories, and documents the project holds

**Repos** is the flat view: one entry per indexed root, with node totals and a
per-domain breakdown of what was indexed.

If a repository shows no project — or the Projects view is empty for a graph
that clearly has code in it — it was indexed before projects existed. Run
[`raph backfill`](/reference/cli/) once; it rebuilds the structure from data
already in the graph without re-indexing or re-embedding anything.

## Other views

- **Graph** — explore nodes and edges, expand neighbors, inspect properties.
- **Memory** — durable knowledge and rules with their lifecycle metadata.
- **Handovers** — documents and handoffs, including whether one has been used.
- **Attribution** — which agents read and wrote what, over time.

## HTTP API

Studio serves JSON on the same port as the UI. Requests are `GET` unless noted.

### Projects and repositories

| Endpoint | Returns |
| --- | --- |
| `GET /api/projects` | Projects with the repositories under each, plus file, directory, memory, and document counts. Each item carries the `id` memories and documents are scoped by. |
| `GET /api/repos` | One entry per indexed root: node and file totals with a per-domain breakdown. |
| `GET /api/stats` | Graph totals. |

```bash
curl -s http://localhost:4545/api/projects
```

```json
{
  "items": [
    {
      "id": "project:23e4a587ae3e293d0cef8f7d457e08e62c346213",
      "name": "merl",
      "root": "/Users/you/code/merl",
      "workspaces": [
        {
          "workspace": "ws:23e4a587ae3e293d0cef8f7d457e08e62c346213",
          "root": "/Users/you/code/merl",
          "name": "merl",
          "files": 873
        }
      ],
      "files": 873,
      "directories": 168,
      "memories": 5,
      "documents": 1,
      "last_indexed": "2026-08-08T17:14:39Z"
    }
  ]
}
```

### Graph

| Endpoint | Returns |
| --- | --- |
| `GET /api/graph` | Nodes and edges for the canvas. Content is truncated and embeddings are never sent. |
| `GET /api/node?id=` | One node with its memory, corpus, and crawl details. |
| `POST /api/neighbors` | Structural neighbors of a node, by `node_id`. |
| `POST /api/edge/create` | Relate two nodes. |
| `POST /api/node/delete` | Delete a node. |

### Memory and documents

| Endpoint | Returns |
| --- | --- |
| `GET /api/memories?query=` | Durable memory with lifecycle metadata. |
| `GET /api/memory?id=` | One memory with its revision history. |
| `POST /api/memory/update`, `POST /api/memory/delete` | Edit or retire a memory. |
| `GET /api/handoffs?query=` | Documents and handoffs. |
| `GET /api/document?id=` | One document with chunks and relations. |
| `POST /api/document/update`, `POST /api/document/delete` | Edit or delete a document. |

### Search, activity, maintenance

| Endpoint | Returns |
| --- | --- |
| `POST /api/search` | The same hybrid search agents use (`query`, `limit`). |
| `GET /api/sqlite?limit=` | Bounded table dumps. |
| `GET /api/activity`, `GET /api/analytics`, `GET /api/timeline` | Access history and attribution. |
| `POST /api/actions/init`, `POST /api/actions/clear` | Destructive: these wipe local graph data. |
