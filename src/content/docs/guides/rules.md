---
title: Rules
description: Global and codebase-specific rules for agents.
---

Rules tell an agent how to behave. They are stored like memory but with a
dedicated `rule` knowledge type, scoped either globally or to a codebase.

- **global** rules govern the entire development cycle.
- **project** rules apply only to the current codebase.

## Commands

```bash
raph rules add "Always run go test before commit" --scope project
raph rules add "Prefer table-driven tests" --scope global
raph rules list --all        # both global and project rules
raph rules list --scope global
raph rules rm <node_id>
```

An agent should read rules at the start of a task — `--all` makes the
distinction between whole-cycle and repo-specific rules explicit.

Over MCP, the equivalent tools are `store_rule` and `list_rules`, each taking a
`scope` of `global` or `project`.
