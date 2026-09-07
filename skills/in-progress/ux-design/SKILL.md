---
name: ux-design
description: Design user experience, information architecture, user flows, states, and interaction behavior from a product spec. Use when the user wants to design a flow, information architecture, or the states a screen needs before visual design starts.
---

# UX Design

Design the experience before the visuals: how a user reaches their goal, what the flow looks like end to end, and what happens when things go wrong.

## Workflow

1. Identify the primary user goals from the spec.
2. Map the end-to-end user journey.
3. Design the information architecture and navigation.
4. Define the core flow and its alternative paths.
5. Define empty, loading, success, error, offline, permission, and destructive states wherever they're relevant.
6. Check accessibility and usability.
7. Resolve any UX issues against the product spec, flagging conflicts rather than silently picking a side.
8. Produce a screen/state map to hand to `ui-design`.

## Output

- User journey
- Information architecture
- Screen map
- Primary and alternative flows
- Interaction rules
- System states
- Accessibility considerations
- Rationale for the decisions made

## Rules

- Optimize for clarity before decoration.
- Minimize unnecessary steps.
- Every important action needs understandable feedback.
- Don't design screens the product requirements don't support without labeling them as proposals.
