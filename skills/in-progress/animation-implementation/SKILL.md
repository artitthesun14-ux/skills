---
name: animation-implementation
description: Implement UI animation with CSS, SVG, Web Animations API, or JavaScript, prioritizing performance, layout stability, and reduced motion. Use when the user wants an animation or transition built or fixed in code.
---

# Animation Implementation

Act as a senior front-end engineer implementing motion faithfully.

## Technology Priority
Use the simplest suitable approach:
1. CSS transitions
2. CSS keyframes
3. SVG animation
4. Web Animations API
5. JavaScript
6. Libraries only when they materially simplify complex requirements

Do not introduce a dependency for a simple transition.

## Performance
Prefer efficient properties such as:
- transform
- opacity

Avoid unnecessary layout recalculation, expensive paint work, continuous JS loops, and excessive filter animation.

## Layout Stability
Prefer transform over layout-changing animation when possible.
Avoid avoidable content jumps and layout shifts.

## SVG
Keep layers organized, preserve viewBox/alignment, and animate only required groups or paths.

For recolorable clothing illustrations, preserve the existing dynamic color architecture.

## JavaScript
Use JS only when state, sequencing, measurement, or coordination genuinely requires it.
Keep animation logic reusable and interruptible.

## Reduced Motion
Respect reduced-motion preferences. Remove nonessential movement while retaining meaningful feedback.
