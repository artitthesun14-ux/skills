# CLAUDE.md

## Project

Collection of agent skills for Claude Code and Codex.

Skills are written in Markdown + YAML and distributed through:
- Claude Code plugin
- `npx skills@latest add mattpocock/skills`

This repo contains no application code, build system, or application tests.

Correctness means:
- Skill manifests are valid.
- Skills are in the correct buckets.
- Promotion requirements are complete.
- Cross-references remain consistent.

## Commands

Use only when relevant to the current task.

- `npm run changeset` — record user-facing skill changes.
- `npm run version` — apply changesets and sync plugin version.
- `npm run check-plugin-version` — verify plugin version, read-only.
- `claude plugin validate . --strict` — validate plugin manifests after manifest changes.
- `scripts/link-skills.sh` — update local skill symlinks after adding, removing, or renaming skills.
- `scripts/list-skills.sh` — list all `SKILL.md` paths.

Do not run unrelated commands.

## Architecture

Skills live under `skills/` and belong to one bucket:

- `engineering/` — promoted, shipped in plugin.
- `productivity/` — promoted, shipped in plugin.
- `misc/` — kept but not promoted.
- `in-progress/` — public beta, excluded from plugin.
- `deprecated/` — normally empty. Delete skills instead of archiving them.

### Promotion Contract

Every promoted skill must have all three:

1. Entry in top-level `README.md`.
2. Path in `.claude-plugin/plugin.json` under `skills`.
3. Documentation page at `docs/<bucket>/<skill-name>.md`.

When adding, removing, renaming, or promoting a skill, check all affected references.

## Skill Rules

Every skill is either:

- User-invoked
- Model-invoked

Follow `.agents/invocation.md` for invocation behavior.

### User-invoked Skills

Must have:

- `disable-model-invocation: true`
- Matching `openai.yaml` configuration.

User-invoked skills must never call another user-invoked skill.

### Router

Update `ask-matt` whenever a user-reachable skill is:

- Added
- Renamed
- Removed

## Context Discipline

Optimize for minimal context.

- Read only files required for the current task.
- Do not read every `SKILL.md` by default.
- Do not read every documentation page unless cross-skill consistency requires it.
- Prefer targeted search over reading entire directories.
- Load a skill's `SKILL.md` only when working on that skill.
- When modifying a skill, inspect only directly affected manifests, docs, routers, and cross-references.
- Reuse existing project conventions instead of rediscovering them.
- Do not duplicate information from other project files into this file.
- Do not restate repository rules in responses unless relevant.
- If a task affects multiple skills, identify the affected files first, then load only those files.
- Treat source files as the source of truth. Do not create duplicate versions of the same information.

## Change Workflow

For a new or modified skill:

1. Identify affected files.
2. Read the relevant `SKILL.md`.
3. Check invocation rules.
4. Update required manifests, README, docs, and routers.
5. Run only relevant validation commands.
6. Record user-facing changes with a changeset when required.

For a promoted skill, verify the full Promotion Contract.

For an add/remove/rename operation, also run:

`scripts/link-skills.sh`

when local symlinks are affected.

## Validation

Use the smallest relevant validation set.

If plugin manifests changed:

`claude plugin validate . --strict`

If skill paths changed:

`scripts/list-skills.sh`

If plugin versioning changed:

`npm run check-plugin-version`

Do not run the full validation suite when the change does not require it.

## Cross-References

When changing a skill name, path, invocation mode, or promotion status, search for references across:

- `README.md`
- `.claude-plugin/plugin.json`
- `.agents/`
- `docs/`
- `skills/`
- `ask-matt`
- `openai.yaml`

Do not assume a reference is safe to leave unchanged.

## Style

- No em-dashes anywhere in this repo.
- Use commas, colons, periods, or parentheses instead.
- Preserve existing Markdown and YAML conventions.
- Prefer concise documentation.
- Do not introduce new conventions when an existing convention already exists.
