---
name: interaction-motion
description: Design motion feedback for interaction states (hover, focus, press, drag, expand/collapse, modal, drawer, navigation, loading, success, error). Use when the user asks how a specific component or state change should animate in response to user action.
---

# Interaction Motion

Treat motion as part of the interaction model.

## Core Rule
User action → State change → Visual response

The user should understand what caused the change.

## States
Consider:
- Default
- Hover
- Focus
- Pressed
- Disabled
- Loading
- Success
- Error
- Enter
- Exit

Do not animate every state automatically. Animate where motion improves feedback or continuity.

## Patterns
Cover appropriate motion for:
- hover/focus
- selection/toggle
- drag and drop
- expand/collapse
- modal/drawer
- dropdown/tooltip
- navigation
- loading/progress
- success/error

## Cause & Effect
Motion should connect the user's action with the resulting state.
Avoid unrelated movement, delayed feedback, large movement for tiny actions, or animation that blocks interaction.

## Accessibility
Keep focus visible and provide reduced-motion alternatives.
