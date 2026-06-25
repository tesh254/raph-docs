---
title: Code intelligence
description: How raph resolves cross-file symbol references, and how to upgrade to compiler-grade accuracy.
---

raph links symbol references across your codebase so an agent can ask "where is
this global read or written?" and get an answer from the graph instead of
guessing. Resolution comes in tiers — the higher the tier available for a
language, the more accurate the `USES` / `MUTATES` edges.

## The tiers

| Tier | Languages | How |
| --- | --- | --- |
| **Compiler (Go)** | Go | `go/types` — always on, type-accurate. |
| **Compiler (SCIP)** | any with an installed indexer | An external compiler-backed indexer (e.g. `scip-typescript` uses `tsc`, `scip-python` uses pyright). Cross-file accurate. |
| **Import-aware (bundled)** | JS/TS/JSX/TSX, Python | Pure-Go fallback that resolves references through `import` bindings. No install, offline. |
| **Within-file (bundled)** | every other tree-sitter language | Symbol + reference extraction within a single file. |

Every language always gets *at least* the bundled tiers — installing a resolver
only raises precision, it is never required.

## See what you have

```bash
raph code-intel
```

```text
Code-intelligence resolvers (compiler-grade tier)
  typescript   scip-typescript  installed (/usr/local/bin/scip-typescript)
  python       scip-python      not installed
               raph code-intel install python   (pip install scip-python)
  ...
```

After an index, `raph init` reports the same: which languages got compiler-grade
resolution and a one-line `raph code-intel install <language>` for any that
could be upgraded.

## Upgrade a language

```bash
raph code-intel install python   # installs scip-python
raph init --path .               # re-index to use it
```

Use `--dry-run` to print the command without running it. The install shells out
to the language's package manager, so the matching runtime must be present:

| Language | Installs via | Requires |
| --- | --- | --- |
| typescript / javascript | `npm i -g @sourcegraph/scip-typescript` | Node.js |
| python | `pip install scip-python` (or npm) | Python+pip (or Node.js) |
| rust | `rustup component add rust-analyzer` | rustup |
| ruby | `gem install scip-ruby` | Ruby+gem |
| java | coursier (`scip-java`) | JVM |
| c / c++ | prebuilt `scip-clang` release | manual download |

If a prerequisite is missing, `raph code-intel install` tells you exactly which
tool to install first. raph does **not** bundle these indexers — they are large
native/runtime programs in other languages, and embedding them would bloat the
binary and require license review.

## For agents

The MCP `index_codebase` result carries `scip_active` (languages resolved
compiler-grade) and `scip_suggestions` (languages that could be upgraded, each
with an `agent_action` command).

**Protocol:** an agent must ask the user for permission before running an
install command. If the user declines, the agent hands them the command to run
themselves and continues with the bundled resolver. Agents never install
unattended.

## Disable it

Set `RAPH_NO_SCIP=1` to skip the compiler-grade tier entirely and rely on the
bundled resolvers (useful in sandboxes or offline CI).
