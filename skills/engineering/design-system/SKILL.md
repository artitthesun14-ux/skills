---
name: design-system
description: Create and maintain a coherent visual design system for digital products, with strong focus on color, typography, spacing, components, states, accessibility, consistency, and implementation-ready design tokens.
---

# Design System Skill

## Purpose

Turn UI decisions into a reusable, consistent, implementation-ready design system.

This skill owns the visual rules between `/ui-design` and `/prototype`.

```text
/ui-design
    ↓
/design-system
    ↓
/prototype
```

The goal is not simply to choose attractive colors. The system should explain why the visual system works, how its parts relate, and how another agent can implement it without guessing.

---

## Core Responsibilities

Own:

1. Color system
2. Typography system
3. Spacing system
4. Layout rules
5. Border radius
6. Shadows / elevation
7. Component visual rules
8. Component states
9. Responsive behavior
10. Accessibility
11. Design tokens
12. Visual consistency
13. Theme / dark mode when needed

Do not own:

- User research
- Product strategy
- User journeys
- Backend architecture
- Feature implementation

Use `/research`, `/grill-with-docs`, `/to-spec`, `/ux-design`, and `/ui-design` for those.

---

# 1. Visual Direction

Define:

```text
Visual Direction
- Personality:
- Mood:
- Density:
- Contrast:
- Visual emphasis:
- Avoid:
```

Possible directions:

- Minimal
- Premium
- Friendly
- Playful
- Professional
- Technical
- Futuristic
- Editorial
- Calm
- Energetic

Choose a direction that fits the product and users, not merely current trends.

---

# 2. Color System

Color is a system, not a collection of random hex values.

Prefer semantic roles:

```text
Primary
Primary Hover
Primary Active
Primary Foreground

Secondary
Secondary Hover
Secondary Foreground

Background
Surface
Surface Elevated
Border

Text
Text Muted
Text Subtle

Success
Warning
Error
Info
```

Implementation example:

```css
--color-primary
--color-primary-hover
--color-background
--color-surface
--color-text
--color-text-muted
--color-border
--color-success
--color-warning
--color-error
```

Prefer semantic names over component-specific names such as `--blue-button`.

---

# 3. Color Selection Rules

Evaluate every palette using:

### Brand fit
Does it communicate the intended personality?

### Hierarchy
Is the primary action clearly distinguishable?

### Contrast
Can text and important UI elements be read easily?

### Saturation
Avoid making every element highly saturated.

### Balance
Use strong accent colors selectively.

### Consistency
The same semantic meaning should normally use the same color family.

Do not use color as the only way to communicate meaning.

Example:

```text
Error = color + icon + message
```

not color alone.

---

# 4. Color Variants

When the visual direction is uncertain, create 2-4 deliberate variants.

Example:

```text
Variant A: Clean / Professional
Variant B: Premium / Dark
Variant C: Friendly / Warm
Variant D: Tech / Futuristic
```

For each variant define:

```text
Primary
Secondary
Background
Surface
Text
Border
Accent
Success
Warning
Error
```

Then recommend one based on product goals.

Do not generate dozens of random palettes.

---

# 5. Typography System

Define:

```text
Font family
Display
Heading 1
Heading 2
Heading 3
Body
Small
Caption
Button
Label
```

For each important level define:

```text
Font size
Font weight
Line height
Letter spacing
```

Example:

```text
Display: 48px / 56px / 700
H1:      36px / 44px / 700
H2:      28px / 36px / 700
H3:      22px / 28px / 600
Body:    16px / 24px / 400
Small:   14px / 20px / 400
Caption: 12px / 16px / 400
```

Keep the scale small enough to remain consistent and readable.

---

# 6. Spacing System

Use a consistent spacing scale.

Example:

```text
4
8
12
16
20
24
32
40
48
64
80
```

Example usage:

```text
4   → icon/text gap
8   → compact element gap
12  → input internal spacing
16  → standard component gap
24  → card padding
32  → section spacing
48+ → major section spacing
```

Avoid arbitrary spacing values unless there is a strong reason.

---

# 7. Layout System

Define:

```text
Max content width
Page horizontal padding
Grid behavior
Column count
Gap
Section spacing
Mobile behavior
```

Example:

```text
Desktop
max-width: 1200px
12-column grid

Tablet
8-column grid

Mobile
4-column grid
```

Use a grid only when it helps the product.

---

# 8. Border Radius

Create a small radius scale.

Example:

```text
sm → 6px
md → 10px
lg → 16px
xl → 24px
pill → 999px
```

Map radius to components:

```text
Input → md
Card → lg
Modal → xl
Tag → pill
```

Avoid many unrelated radius values.

---

# 9. Elevation and Shadows

Define a small number of levels:

```text
none
sm
md
lg
```

Explain when each is used.

Do not solve every hierarchy problem with shadows. Borders, spacing, and surface contrast can often communicate hierarchy more cleanly.

---

# 10. Component Visual System

For important components define:

```text
- Anatomy
- Size
- Typography
- Color
- Radius
- Border
- Shadow
- Padding
- States
```

Consider:

```text
Button
Input
Select
Card
Badge
Tag
Navigation
Modal
Dropdown
Tooltip
Tabs
Table
Toast
Empty State
Loading State
```

Example:

```text
Button / Primary

Default
Hover
Active
Focus
Disabled
Loading
```

---

# 11. Component States

Consider:

```text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
Success
```

Not every component needs every state.

Focus indicators must remain visible for keyboard users.

---

# 12. Accessibility

Check:

- Contrast
- Keyboard focus
- Text readability
- Clear interaction states
- Color-blind usability
- Reduced-motion considerations

Do not rely on color alone to communicate state.

When exact compliance is required, validate against the relevant WCAG requirements instead of relying only on visual judgment.

---

# 13. Design Tokens

Convert the design system into implementation-friendly tokens.

Example:

```css
:root {
  --color-primary: ...;
  --color-primary-hover: ...;

  --color-background: ...;
  --color-surface: ...;
  --color-border: ...;

  --color-text: ...;
  --color-text-muted: ...;

  --color-success: ...;
  --color-warning: ...;
  --color-error: ...;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;

  --shadow-sm: ...;
  --shadow-md: ...;
}
```

Tokens should represent design decisions, not merely copied CSS values.

---

# 14. Dark Mode

Only create dark mode when the product needs it.

Do not simply invert every color.

Define semantic dark-mode tokens separately and preserve hierarchy and contrast.

---

# 15. Prototype Feedback Loop

Prototype is an experimentation environment.

If the prototype reveals:

```text
"Primary color feels too aggressive."
```

do not permanently patch only the prototype.

Use:

```text
Prototype feedback
        ↓
Identify design decision
        ↓
Update Design System
        ↓
Update Prototype
        ↓
Continue
```

This prevents the UI design, prototype, and implementation from developing different visual rules.

The design system is the source of truth for accepted visual decisions.

---

# 16. Design Decision Log

For important visual changes record:

```text
Decision:
Change primary color from A → B

Reason:
Better matches the intended visual direction.

Evidence:
Prototype feedback / experiment / accessibility review

Status:
Accepted

Affected components:
Button
Navigation
Links
Map markers
```

---

# 17. Output

Produce:

```text
design-system.md
```

with:

```text
# Design System

## 1. Visual Direction
## 2. Color System
## 3. Color Variants
## 4. Typography
## 5. Spacing
## 6. Layout
## 7. Border Radius
## 8. Shadows / Elevation
## 9. Components
## 10. Component States
## 11. Accessibility
## 12. Design Tokens
## 13. Dark Mode
## 14. Design Decisions
## 15. Implementation Notes
```

Keep decisions explicit enough that another agent can implement them without guessing.

---

# Quality Checklist

- [ ] Visual direction is clear
- [ ] Colors have semantic roles
- [ ] Primary action is visually obvious
- [ ] Palette is coherent
- [ ] Contrast has been considered
- [ ] Color is not the only signal
- [ ] Typography hierarchy is clear
- [ ] Spacing follows a consistent scale
- [ ] Radius is consistent
- [ ] Shadows are purposeful
- [ ] Important components have defined states
- [ ] Focus states are visible
- [ ] Responsive rules are defined
- [ ] Tokens are implementation-ready
- [ ] Dark mode is addressed if needed
- [ ] Important design changes are recorded
- [ ] Prototype and design system do not contradict each other

---

# Workflow Position

Recommended pipeline:

```text
/research
      ↓
/grill-with-docs
      ↓
/to-spec
      ↓
/ux-design
      ↓
/ui-design
      ↓
/design-system
      ↓
/prototype
      ↓
/experiment
      ↓
/to-tickets
      ↓
/implement
      ↓
/test
      ↓
/code-review
```

The workflow is iterative.

Visual problem:

```text
/prototype
    ↓
visual problem
    ↓
/design-system
    ↓
/prototype
```

UX problem:

```text
/prototype
    ↓
UX problem
    ↓
/ux-design
```

Measured comparison:

```text
/prototype
    ↓
/experiment
    ↓
/design-system
```

---

# Principle

> Design once, systematize it, test it, then implement it consistently.

The purpose of this skill is to ensure that the final product does not merely have one good-looking screen. It should have a coherent visual language that every screen and component can reuse.
