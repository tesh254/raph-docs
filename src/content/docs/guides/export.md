---
title: Export & transfer
description: Move knowledge between machines.
---

Export turns graph knowledge into portable files and optionally publishes them
so they transfer between machines. `raph import` loads them back.

## Export to a file

```bash
raph export --doc <id> --out doc.json                   # a single document (JSON, default)
raph export --bundle --out kb.json                      # the whole workspace
raph export --doc <id> --out-format md --out notes.md   # human-readable Markdown
```

Export defaults to **JSON** — a versioned, round-trippable envelope:

```json
{
  "raph_export_version": 1,
  "kind": "bundle",
  "workspace": "ws:…",
  "nodes": [ /* documents with content + properties */ ],
  "edges": [ /* relations, best-effort */ ]
}
```

It is plain JSON with no binary blobs and no embedded vectors, so a file drops
straight into a gist and reads back cleanly. Markdown (`--out-format md`) is for
human reading only — it includes properties as frontmatter but is not importable.

## Import

```bash
raph import kb.json                     # from a local file (project scope)
raph import kb.json --scope global      # into the global scope
raph import https://gist.github.com/…/raw/kb.json   # from a raw URL
raph import <gist-id>                    # from a gist id (via gh)
cat kb.json | raph import -              # from stdin
```

Documents are **reconstructed** through the normal document path — chunks and
embeddings are regenerated locally rather than carried in the file. Re-importing
the same export updates the existing documents (matched on their stable key)
instead of duplicating them. Use `--no-embed` to skip embedding regeneration.

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
