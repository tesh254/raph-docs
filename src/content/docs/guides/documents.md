---
title: Documents & handoffs
description: Typed local documents, handoffs, and graph links.
---

Documents attach durable knowledge to the graph. Each carries a `doc_type` so
an agent knows how it serves the work:

- **architecture** — durable design that rarely changes.
- **handoff** — a transfer of in-progress work to the next agent.
- **reference** — a fact to confirm against (e.g. a doc a user asked you to keep).
- **note** — anything else.

Documents are chunked for retrieval and can be linked to code or other
documents, so related material is one graph hop away instead of another search.

## Add documents

```bash
raph doc add ./NOTES.md --type architecture --title "Service layout"
raph doc add "Finished FTS. Next: vector rerank." --type handoff --title "FTS handoff"
echo "rate limits..." | raph doc add - --type reference --title "API limits"
```

## List and read

```bash
raph doc list --type handoff
raph doc read <id>            # read with chunks + related nodes
raph doc read <id> --no-mark  # peek without claiming
```

## Handoffs mark themselves used

When an agent reads a handoff with `raph doc read <id>`, raph flips its status
to `used` (recording who and when). The next agent listing handoffs sees it is
already taken and focuses elsewhere.

## Links

```bash
raph doc link <from_id> <to_id> --rel RELATES_TO
```

Follow links via the MCP `graph_neighbors` tool or the `related` field returned
by `read_document`.

## From the internet

```bash
raph crawl https://example.com/docs            # crawl a docs site into the graph
raph crawl https://example.com/page --single   # one page
```

Crawled content becomes searchable with `raph search`. Over MCP, agents use
`add_document`, `list_documents`, `read_document`, `link_nodes`, `crawl_url`,
and `crawl_website`.
