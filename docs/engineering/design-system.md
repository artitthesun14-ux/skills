## What it does

`design-system` turns the visual decisions in a [ui-design](https://aihero.dev/skills-ui-design) into a coherent, reusable system: semantic colour roles, a type scale, a spacing scale, radius and elevation steps, component visual rules and states, accessibility, and the implementation-ready [design tokens](https://www.aihero.dev/ai-coding-dictionary/design-token) that encode all of it.

It owns the visual layer as a single source of truth, not a one-off screen. The defining move is that every value earns a semantic name and a reason: `--color-primary` rather than `--blue-button`, a spacing step rather than an arbitrary pixel, a token that represents a decision rather than a copied CSS value. That is what lets another agent (or `prototype`) build any screen from the system without guessing, and what keeps the design, the prototype, and the implementation from drifting into three different visual languages.

## When to reach for it

Type `/design-system`, or the agent reaches for it automatically when a task fits: it is model-invoked.

Reach for it once the UX and the rough visual direction are settled and you need those choices systematised before anything gets built or duplicated across screens. For the flows and states that come first, use [ux-design](https://aihero.dev/skills-ux-design); for the screen-level visual composition it consumes, use [ui-design](https://aihero.dev/skills-ui-design); to try the system out on real interface and get feedback, use [prototype](https://aihero.dev/skills-prototype).

## Prerequisites

It works from a resolved UX and UI direction: the screen/state map from [ux-design](https://aihero.dev/skills-ux-design) and the visual intent from [ui-design](https://aihero.dev/skills-ui-design). Without them the system has nothing to systematise and turns into palette-picking. It produces a `design-system.md` as its artifact, so it also needs somewhere in the repo to keep it.

## Tokens are decisions, not values

The leading idea is the **design token**: a named decision the whole product reads from. The skill's discipline is that colour is a system of semantic roles (primary, surface, border, text, success/warning/error) rather than a bag of hexes; that type, spacing, radius, and elevation each run on a small fixed scale; and that meaning is never carried by colour alone (error = colour plus icon plus message). It designs both themes as token sets rather than inverting one into the other, and it treats the prototype as a feedback loop: a visual problem found there updates the system first, then the prototype, so the source of truth stays singular.

## Common questions

**How is this different from `ui-design`?**

`ui-design` decides what a screen looks like; `design-system` extracts the rules behind those decisions so every screen can reuse them. One composes an interface, the other guarantees the interface is one system. On a small piece you can stay in `ui-design`; reach for `design-system` when the visual language has to hold across many screens and components.

**Do I always need it between `ui-design` and `prototype`?**

No. It is worth its weight when consistency across screens is the risk. For a single view or a throwaway check, going straight from `ui-design` to `prototype` is fine.

## It's working if

- Colours are named by role (`--color-primary`, `--color-surface`), not by appearance or component.
- Type, spacing, radius, and elevation each sit on one small scale, and new screens pull from it instead of inventing values.
- Important components have their states defined, and keyboard focus stays visible.
- No meaning rides on colour alone.
- A visual change is recorded as a decision and flows back into the tokens, so the prototype and the system never contradict each other.

## Where it fits

`design-system` is a chain step, sitting between the visual design and the build:

```txt
ux-design → ui-design → design-system → prototype → implement
```

Its neighbours are [ui-design](https://aihero.dev/skills-ui-design), whose visual choices it systematises, and [prototype](https://aihero.dev/skills-prototype), which exercises the system on real interface and feeds problems back to it; a measured comparison from [experiment](https://aihero.dev/skills-experiment) can also send a change back here. It holds the accepted visual decisions so the rest of the chain implements them consistently.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
