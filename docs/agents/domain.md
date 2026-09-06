# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root.
- **`.agents/adr/`**: read ADRs that touch the area you're about to work in. This repo uses `.agents/adr/` rather than `docs/adr/` for its architectural decision records; `docs/` here is reserved for the per-skill human-facing docs pages (`docs/<bucket>/<skill-name>.md`).

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo (this repo has no monorepo signals: no `pnpm-workspace.yaml`, no `workspaces` field, a single top-level package):

```
/
├── CONTEXT.md
├── .agents/adr/
│   ├── 0001-explicit-setup-pointer-only-for-hard-dependencies.md
│   └── 0002-ship-as-a-claude-code-plugin.md
└── skills/
```

There is no `CONTEXT-MAP.md` at the root, so this repo is not multi-context. If that ever changes (a `CONTEXT-MAP.md` appears), switch to per-context `CONTEXT.md` + `docs/adr/` under each context, per the general convention.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR in `.agents/adr/`, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (ship as a Claude Code plugin), but worth reopening because…_
