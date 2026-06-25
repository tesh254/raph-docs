---
title: Export & transfer
description: Move knowledge between machines.
---

Export turns graph knowledge into portable files and optionally publishes them
so they transfer between machines.

## Export to a file

```bash
raph export --doc <id> --out notes.md                  # a single document (Markdown)
raph export --doc <id> --out-format json --out doc.json # as JSON
raph export --bundle --out-format json --out kb.json    # the whole workspace
```

Markdown exports include the document's properties as frontmatter.

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
