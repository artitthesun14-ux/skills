# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A collection of agent skills (Markdown instruction files + YAML metadata) for Claude Code and Codex, distributed two ways: as a Claude Code plugin (a managed, read-only bundle) and via `npx skills@latest add mattpocock/skills` (skills.sh, which copies editable files into a user's project). There is no application code, build step, or test suite; "correctness" here means the manifests, buckets, and cross-references described below are internally consistent.

## Commands

- `npm run changeset` — record a changeset for any user-facing skill change (new skill, rename, behavior change).
- `npm run version` — applies pending changesets and runs `scripts/sync-plugin-version.mjs` to copy `package.json`'s version into `.claude-plugin/plugin.json`.
- `npm run check-plugin-version` — CI-safe check (`--check` mode) that the two version fields already match; fails without writing anything.
- `claude plugin validate . --strict` — run after touching `.claude-plugin/plugin.json` or `.claude-plugin/marketplace.json`.
- `scripts/link-skills.sh` — symlinks every skill outside `deprecated/` and `misc/` into `~/.claude/skills` and `~/.agents/skills` for local dev; re-run after adding, removing, or renaming a skill.
- `scripts/list-skills.sh` — lists every `SKILL.md` path in the repo.

Releases are automated: `.github/workflows/release.yml` runs `changesets/action` on push to `main`, opening/merging a version PR and tagging.

## Architecture

### Bucket layout

Skills live in bucket folders under `skills/`:

- `engineering/`, `productivity/` — **promoted**: shipped in the plugin.
- `misc/` — kept around but rarely used, not promoted.
- `in-progress/` — beta, public on purpose, installable via skills.sh but excluded from the plugin and the top-level README.
- `deprecated/` — retired skills are deleted outright, not archived here; the bucket is normally empty.

**Promotion contract** — every skill in `engineering/` or `productivity/` must have all three, and non-promoted skills must have none:
1. An entry in the top-level `README.md`, name linked to its `SKILL.md`, grouped under **User-invoked** or **Model-invoked**.
2. A path entry in `.claude-plugin/plugin.json`'s `skills` array.
3. A docs page at `docs/<bucket>/<skill-name>.md` (the `docs/` tree mirrors `engineering/`/`productivity/` only), published externally at `https://aihero.dev/skills-<skill-name>` regardless of bucket.

Each bucket folder also has its own `README.md` listing every skill with a one-line description (promoted buckets split into User-invoked/Model-invoked; `misc/`/`in-progress/` use a flat list).

### Skill anatomy

Each skill directory holds `SKILL.md` (YAML frontmatter with `name`/`description`, plus optional reference files like `tests.md`) and `agents/openai.yaml` (Codex UI metadata: `interface.display_name`, `interface.short_description`).

**Invocation axis** (see `.agents/invocation.md`): every skill is either
- **User-invoked** — reachable only by the human typing its name. Set `disable-model-invocation: true` in `SKILL.md` frontmatter and `policy.allow_implicit_invocation: false` in `agents/openai.yaml`; description is human-facing, no trigger phrasing.
- **Model-invoked** — reachable by model or user (the default). Description keeps rich trigger phrasing so auto-invocation fires.

A user-invoked skill may call a model-invoked skill via the Skill tool (`Call the Skill tool with "grilling"`), but never another user-invoked skill; the two `agents/openai.yaml`/`SKILL.md` settings must always agree.

### Cross-cutting docs and routers

- [`ask-matt`](./skills/engineering/ask-matt/SKILL.md) is the router mapping every user-reachable skill; re-read and update it whenever a user-reachable skill is added, renamed, removed, or changes how it fits the flows.
- `.agents/writing-docs.md` is the template/spec for docs pages: fixed sections `What it does`, `When to reach for it`, `Where it fits`, plus free-form middle and (where earned) `Common questions` / `It's working if`. Docs pages use only absolute links and carry no install commands (the site renders those).
- `.agents/install-block.md` is the single source of truth for install wording; `README.md`, `.changeset/*`, and docs pages must match it verbatim rather than restate it.
- `.claude-plugin/marketplace.json` makes the repo its own single-plugin marketplace — a fallback, not the documented install route (the official `claude-plugins-official` marketplace listing is).
- `CONTEXT.md` is this repo's own domain glossary (Issue tracker, Issue, Decision ticket, Triage role), maintained under the same discipline the `domain-modeling`/`grill-with-docs` skills teach for consuming projects.
- `.agents/adr/` holds architecture decisions; notably ADR 0002 explains why there's a Claude Code plugin but not (yet) a Codex plugin (Codex's manifest can't curate a subset of a bucketed `skills/` layout the way Claude's array-based one can).
- `.out-of-scope/` records feature requests deliberately declined, with rationale and prior-request references — check here before re-proposing something like a declined idea.
- `AGENTS.md` is a symlink to `CLAUDE.md`; there is one file to keep current, not two.

### Style

No em-dashes anywhere in this repo's prose (`SKILL.md`, docs, `README.md`, `CHANGELOG.md`, ADRs, changesets, code comments). Rewrite with a comma, colon, period, parentheses, or conjunction instead of substituting a character.
