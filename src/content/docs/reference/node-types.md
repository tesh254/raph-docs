---
title: Symbol & node types
description: The node types, code-symbol properties, and edge types raph stores in the graph — and where each is produced in the source.
---

The graph is built from typed **nodes** joined by typed **edges**. This page is
the reference for every type raph emits and the properties code symbols carry.
Source links point at the indexer on the `feat/major-revamp` branch.

## Node types

| `type` | Domain | What it is | Produced by |
| --- | --- | --- | --- |
| `file` | code / documentation | One indexed file. | [`indexFile`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L224) |
| `func` | code | A function or method. Go methods are receiver-qualified (e.g. `(Indexer) Run`). | [`indexGoFile`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L336), [`indexTreeSitterFile`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/treesitter.go#L121) |
| `type` | code | A class, struct, enum, trait, interface, or type alias. | same as `func` |
| `var` | code | A package-level / top-level **variable**. Indexed per name. | [`indexGoFile`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L370), tree-sitter globals pass |
| `const` | code | A package-level / top-level **constant**. Indexed per name. | same as `var` |
| `markdown_chunk` | documentation | A heading-delimited section of a Markdown/text file. | [`indexDocumentSections`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L303) |
| `file_chunk` | code / documentation | A fixed-size chunk of a file with no language parser. | [`indexFallbackChunks`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L441) |

Memory records, rules, local documents, and crawled web pages are also nodes,
produced by their own subsystems (`internal/memory`, `internal/knowledge`,
`internal/crawler`).

### The variable kinds

`var` and `const` are the headline addition. Package-level globals are exactly
what an agent tends to guess at, so each declared name becomes its own node
rather than being folded into the file. For Go this comes from the
`*ast.ValueSpec` branch of
[`indexGoFile`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L370);
for tree-sitter languages it comes from the
[globals pass in `indexTreeSitterFile`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/treesitter.go#L181),
driven by each language's `globals` set in
[`langSpecs`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/treesitter.go#L34).

## Code-symbol properties

Every node carries a JSON `properties` map. Code symbols set:

| Property | Values | Meaning | Set in |
| --- | --- | --- | --- |
| `global` | `"true"` | The symbol is a package-/module-level declaration. | [Go](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L382) · [tree-sitter](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/treesitter.go#L181) |
| `decl` | `"var"` \| `"const"` | Which keyword declared it. | same |
| `lang` | grammar name (`python`, `typescript`, `rust`, …) | Source language, on tree-sitter symbols only (Go symbols omit it). | [tree-sitter](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/treesitter.go#L181) |

## Edge types

| `type` | Meaning | Produced by |
| --- | --- | --- |
| `DECLARES` | A file declares a symbol; a parent owns a chunk's sibling. | [`saveSymbol`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L396) |
| `USES` | An owning symbol references another symbol. | resolution tiers (below) |
| `MUTATES` | A reference that **writes** a variable (supersedes `USES`). | [`go/types`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/gosem.go#L82), [SCIP](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/scip.go#L445) |
| `HAS_SECTION` | A document file owns a Markdown section. | [`indexDocumentSections`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L303) |
| `HAS_CHUNK` | A file owns a fallback chunk. | [`indexFallbackChunks`](https://github.com/tesh254/raph/blob/feat/major-revamp/internal/indexer/indexer.go#L441) |
| `RELATES_TO` | A memory/note relates to a node. | `internal/knowledge` |
| `HAS_PAGE` / `LINKS_TO` | Web corpus structure and inter-page links. | `internal/crawler` |

`USES` and `MUTATES` are the cross-file reference edges produced by the
[resolution tiers](/guides/code-intel/) — the higher the tier available for a
language, the more accurate they are.
