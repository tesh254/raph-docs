---
title: CLI commands
description: Reference for the raph command-line interface.
---

All commands accept the global `--format text|json` flag (default: auto — JSON
for agents/pipes, text for terminals) and `-q/--quiet` to suppress verbose logs.

## Indexing & sync

| Command | Purpose |
| --- | --- |
| `raph init --path .` | Index a workspace and arm the background watcher. |
| `raph sync --path .` | Ensure the background sync worker is running. |
| `raph sync --status` | Show worker status and registered repositories. |
| `raph sync --stop` | Stop the background worker. |
| `raph sync --remove --path .` | Stop syncing a repo and drop its graph data. |

## Search

| Command | Purpose |
| --- | --- |
| `raph search "<q>"` | Ranked keyword search (bm25). |
| `raph search "<q>" --literal` | Exact substring search. |
| `raph search "<q>" --regex` | Regular-expression search. |
| `raph search "<q>" --vector` | Semantic search (needs a provider). |
| `... --type func --type file` | Filter by node type. |
| `... --global` | Search across all workspaces. |

## Memory & rules

| Command | Purpose |
| --- | --- |
| `raph mem set "<text>" --scope <s> --type <t> --title <x>` | Create/update memory. |
| `raph mem search "<q>" --scope <s>` | Search memory in a scope. |
| `raph mem rm <id>` | Deprecate a memory record. |
| `raph rules add "<rule>" --scope global\|project` | Add a rule. |
| `raph rules list --all` | List global + project rules. |
| `raph rules rm <id>` | Remove a rule. |

## Documents

| Command | Purpose |
| --- | --- |
| `raph doc add <file\|-\|text> --type <t> --title <x>` | Add a document. |
| `raph doc list --type <t> --status <s>` | List documents. |
| `raph doc read <id>` | Read a document (marks handoffs used). |
| `raph doc link <from> <to> --rel <R>` | Link two nodes. |

## Export

| Command | Purpose |
| --- | --- |
| `raph export --doc <id> --out <file>` | Export a document. |
| `raph export --bundle --out <file>` | Export a whole-workspace bundle. |
| `... --gist [--public]` | Publish as a GitHub gist. |
| `... --repo owner/name --repo-path <p>` | Commit into a repo. |
| `... --s3 s3://bucket/key [--r2-endpoint <url>]` | Upload to S3/R2. |

## Other

| Command | Purpose |
| --- | --- |
| `raph start` | Start the MCP server over stdio. |
| `raph studio` | Launch the local graph explorer UI. |
| `raph crawl <url> [--single]` | Crawl documentation into the graph. |
| `raph agents mcp setup --path .` | Install MCP config for supported agents. |
| `raph config init` | Create `~/.raph` config files. |
| `raph clear --yes` | Wipe all graph data. |
