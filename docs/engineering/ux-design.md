## What it does

`ux-design` turns a product [spec](https://www.aihero.dev/ai-coding-dictionary/spec) into a user experience: the goals a user is trying to reach, the information architecture and navigation around them, the primary and alternative flows, and the empty, loading, success, error, offline, permission, and destructive states along the way. Its output is a screen and state map, not a screen.

It stops at the boundary of how a thing looks. Colour, type, spacing, and component styling are out of scope by design; that is `ui-design`'s job downstream. What `ux-design` commits to is the structure of the experience and the states it has to survive, so the visual layer that follows has a resolved flow to dress rather than a flow it has to invent while styling.

## When to reach for it

Type `/ux-design`, or the agent reaches for it automatically when a task fits: it is model-invoked, so a step in another flow can hand off to it.

Reach for it when the spec is settled but the experience is not: you know what the feature must do and now need the flows, screens, and states worked out before anyone touches visuals. For the visual layer instead, use [ui-design](https://aihero.dev/skills-ui-design); for sharpening the idea that becomes the spec in the first place, use [grill-with-docs](https://aihero.dev/skills-grill-with-docs).

## Prerequisites

It designs against a product specification. Have the spec (or an equivalently settled agreement about what the feature does) in front of you before you start, or the flows have nothing to anchor to. [to-spec](https://aihero.dev/skills-to-spec) is the usual source of that input.

## The screen/state map

The artifact is a map, and the leading idea is that states are first-class, not afterthoughts. A flow is not just its happy path: it is the empty state before there is data, the loading state while it arrives, the error state when it does not, and the permission and destructive states at the edges. The map names each state a flow can be in and how the user moves between them, which is exactly the input [ui-design](https://aihero.dev/skills-ui-design) needs to know which screens it owes a visual for.

## It's working if

- The output is a flow-and-state map, not a mockup: you can read how a user gets from goal to done without seeing a single colour.
- Empty, loading, error, and permission states are named for each flow, not just the success case.
- Every screen on the map traces back to something the spec asked for, and any screen that does not is labelled as a proposal.
- What comes out is directly usable as the input to `ui-design`.

## Where it fits

`ux-design` is a chain step on the product-building flow, sitting after the spec and before the visual layer:

```txt
to-spec → ux-design → ui-design → prototype → implement
```

Its neighbours are [to-spec](https://aihero.dev/skills-to-spec), which produces the specification it designs against, and [ui-design](https://aihero.dev/skills-ui-design), which takes its screen/state map and gives it a visual system. Where a flow needs to be felt rather than read, [prototype](https://aihero.dev/skills-prototype) answers that question with throwaway code.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
