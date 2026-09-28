---
name: animation-review
description: Review existing UI animations for purpose, timing, easing, hierarchy, layout stability, performance, accessibility, mobile behavior, and consistency. Use when the user asks to review, critique, or audit an animation or transition.
---

# Animation Review

Review animation as a product interaction, not merely as visual decoration.

## Review Areas

### Purpose
- What problem does the motion solve?
- Is it necessary?

### Timing
- Too fast to perceive?
- Too slow and blocking?

### Easing
- Does it communicate entering, exiting, or movement?
- Is bounce/overshoot unnecessary?

### Hierarchy
- Is the intended focal point obvious?
- Are multiple elements competing?

### Continuity
- Can the user understand where an element came from or went?

### Layout
- Any unwanted layout shift or content jump?

### Performance
- Are expensive properties being animated?
- Could CSS replace unnecessary JavaScript?

### Accessibility
- Is focus clear?
- Is information understandable without motion?
- Is reduced motion supported?

### Mobile
- Does it work correctly with touch?
- Does it remain useful without hover?

### Consistency
- Does it match the product's motion language?

## Output
Use:
- Critical: usability, accessibility, functionality
- Important: clarity, consistency, quality
- Polish: small refinements

For each finding: Problem → Why it matters → Concrete fix.

Do not use numeric scores.
