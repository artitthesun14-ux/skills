## What it does

`ui-design` takes a validated UX (a flow and a screen/state map) and turns it into an implementation-ready visual interface: layout hierarchy, typography and spacing, reusable components, responsive rules, component states, design tokens, and the accessibility checks over all of it. The output is a specification a build can follow, not a picture to admire.

It designs a system, not screens. The unit of work is a reusable component with its full set of states, not a one-off layout for one screen, and every visual decision has to be explicable rather than arbitrary. That is what separates it from styling a page directly: the goal is consistency you can carry across the whole interface, which is why it leans on tokens and shared components instead of per-screen choices.

## When to reach for it

Type `/ui-design`, or the agent reaches for it automatically when a task fits: it is model-invoked.

Reach for it once the UX is resolved and you need the visual system that dresses it. For the flows and states that come first, use [ux-design](https://aihero.dev/skills-ux-design); when the real question is "what should this actually look like" and you need to see options rather than read a spec, use [prototype](https://aihero.dev/skills-prototype), which builds several toggleable UI variations.

## Prerequisites

It expects a validated UX as input: the screen/state map [ux-design](https://aihero.dev/skills-ux-design) produces, or an equivalent. Without it, the skill has to invent the flow while styling it, which is the coupling it exists to avoid.

## A design system, not a screen

The leading idea is the reusable component with all its states. `ui-design` inventories the components an interface needs, defines each one's states (default, hover, active, disabled, loading, error, empty), sets the design tokens and responsive rules they share, and only then describes the screens as compositions of those components. Designing for real data rather than ideal placeholder content is part of the same discipline: a component that only looks right with a perfect three-word label is not finished.

## It's working if

- The output is a component inventory with tokens and states, not a set of standalone screen pictures.
- Every screen is described as a composition of reusable components, and the same component is not restyled per screen.
- Each visual decision has a stated reason; nothing is styled arbitrarily.
- Contrast, readability, touch targets, and component states are all accounted for, against real data rather than ideal placeholder content.

## Where it fits

`ui-design` is a chain step on the product-building flow, taking the resolved UX and handing a buildable visual spec to implementation:

```txt
ux-design → ui-design → prototype → implement
```

Its neighbours are [ux-design](https://aihero.dev/skills-ux-design), which gives it the flows and states to dress, and [prototype](https://aihero.dev/skills-prototype), the throwaway-code detour for when a visual question is easier to answer by seeing it than by specifying it. Downstream, [implement](https://aihero.dev/skills-implement) builds against the spec it produces.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
