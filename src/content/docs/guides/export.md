---
title: Export & transfer
description: Move knowledge between machines.
---

Export packages the portable **brain** — the knowledge an agent accumulates that
isn't derivable from your codebase — and `raph import` loads it back on another
machine. Indexed files, code symbols, and document chunks are deliberately
**not** exported: they regenerate the next time you index.

What travels:

- **Memory** and **rules** (rules are memory with `knowledge_type=rule`).
- **Handoffs** (documents marked `--type handoff`).

## Export the brain

```bash
raph export --bundle --out brain.json                        # portable: global + shared scopes (default)
raph export --bundle --scope all --out brain.json            # also include project-scoped memory (all repos)
raph export --bundle --scope global --out brain.json
raph export --bundle --scope project --path . --out brain.json  # only this repo's project memory + handoffs
raph export --bundle --out-format md --out brain.md          # human-readable digest (not importable)
```

`--scope` selects which memory scopes to gather: `portable` (default, global +
shared), `all`, `global`, `shared`, or `project`. Handoffs are included alongside
the memory.

`--scope project` is scoped to the **current repository**: it exports only the
project-scoped memory and handoffs for the repo at `--path` (default `.`), so a
published bundle can't leak another repository's project memory. The other
scopes are not repo-specific — `all` includes project-scoped memory across every
indexed repo.

Export defaults to **JSON** — a versioned, round-trippable envelope:

```json
{
  "raph_export_version": 1,
  "kind": "brain",
  "memory":   [ /* memory + rule records with scope, type, key, tags */ ],
  "handoffs": [ /* handoff documents */ ]
}
```

It is plain JSON with no binary blobs and no embedded vectors, so a file drops
straight onto a raw URL or disk and reads back cleanly.

## Import the brain

```bash
raph import brain.json                          # from a local file
raph import https://example.com/raw/brain.json  # from a raw JSON URL
cat brain.json | raph import -                  # from stdin
```

Memory and rules are restored under their **original scope** (idempotent — a
re-import updates records in place via their natural key); handoffs are
reconstructed, regenerating chunks and embeddings locally. Use `--no-embed` to
skip embedding regeneration.

## Share a single document

For ad-hoc sharing of one document (any type), export it on its own:

```bash
raph export --doc <id> --out doc.json                  # single document as JSON
raph export --doc <id> --out-format md --out notes.md  # as readable Markdown
```

## Publish

```bash
raph export --doc <id> --gist --public                 # GitHub gist (via gh)
raph export --doc <id> --repo owner/name --repo-path docs/notes.md
raph export --doc <id> --s3 s3://bucket/key            # S3
raph export --doc <id> --s3 s3://bucket/key \
  --r2-endpoint https://<account>.r2.cloudflarestorage.com   # Cloudflare R2
```

Uploads shell out to `gh` (gist/repo) and `aws` (S3/R2), so they use your
existing credentials and keep the binary dependency-light.
