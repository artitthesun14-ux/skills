# In Progress

Beta. These skills are public on purpose: try them and tell me what breaks. They're excluded from the plugin and the top-level README until they graduate to a stable bucket, they get no docs pages, and they can change or disappear without warning.

The plugin won't give you these. Install one directly:

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)**: Grill yourself into implementable workflow specs over multiple sessions, using the current directory as a stateful workspace. User-invoked.
- **[writing-beats](./writing-beats/SKILL.md)**: Shape an article as a journey of beats, choose-your-own-adventure style. Pick a starting beat, write only that beat, then pivot to the next, until the article reaches a natural end.
- **[writing-fragments](./writing-fragments/SKILL.md)**: Grilling session that mines you for fragments (heterogeneous nuggets of writing) and appends them to a single document as raw material for a future article.
- **[writing-shape](./writing-shape/SKILL.md)**: Take a markdown file of raw material and shape it into an article paragraph by paragraph, arguing format choices at each step.
- **[claude-handoff](./claude-handoff/SKILL.md)**: Hand the current conversation off to a fresh background agent that picks up the work immediately, seeded with a handoff summary via `claude --bg`. User-invoked.
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)**: Wire dependency-cruiser into a TypeScript repo so each package is a deep module: implementation hidden in subfolders, reachable only through its entry-point files, tests exercising it through those. User-invoked.
- **[implement-spec](./implement-spec/SKILL.md)**: Implement a whole spec on one branch. Works the tickets as a task graph rather than a list, running implementer subagents across the ready frontier for maximum concurrency, and lands the result as a single PR. User-invoked.
- **[retro](./retro/SKILL.md)**: Suggest improvements to the coding agent's environment (steering files, coding standards, automated checks, tooling) after a session. STUB: design notes only, not functional yet. User-invoked.
- **[karpathy-guidelines](./karpathy-guidelines/SKILL.md)**: Behavioral guidelines to reduce common LLM coding mistakes when writing, reviewing, or refactoring code: surface assumptions, keep changes surgical, avoid speculative complexity, and define verifiable success criteria.
- **[motion-design](./motion-design/SKILL.md)**: Design purposeful UI motion: timing, easing, sequencing, hierarchy, and continuity, before any animation code is written.
- **[interaction-motion](./interaction-motion/SKILL.md)**: Design motion feedback for interaction states such as hover, focus, drag, modal, loading, success, and error.
- **[animation-implementation](./animation-implementation/SKILL.md)**: Implement UI animation with CSS, SVG, Web Animations API, or JavaScript, prioritizing performance, layout stability, and reduced motion.
- **[animation-review](./animation-review/SKILL.md)**: Review UI animations for purpose, timing, easing, layout stability, performance, accessibility, and consistency, with severity-ranked fixes.
- **[visual-prototyping](./visual-prototyping/SKILL.md)**: Prototype a motion idea through storyboard, motion sequence, a runnable prototype, inspection, and iteration.
