## What it does

`visual-forms` decides how a piece of content should be shown before anyone writes it. It runs one fixed order:

```
CORE POINT → RELATIONSHIP → FORM → FEWEST WORDS → DETAIL BEHIND A DISCLOSURE
```

First it finds the one point and the few points that hold it up. Then it reads how those points relate, because the relationship picks the form:

| Relationship | Form |
| --- | --- |
| Category and sub-category | Tree |
| Layers resting on each other | Stack (a pyramid only when the layers really narrow) |
| Order, with branches | Flow |
| Parts exchanging something | System diagram, every arrow labelled with what moves |
| Change over time | Timeline |
| Options on shared dimensions | Matrix |
| A state that changes, and why | Animation |
| Short items with no structure | Cards or bullets |

Each form carries a fit test that says when to use another one, so a tree never forces an item under two parents and a pyramid never implies a ranking the evidence lacks. Words then cover only what the form cannot show: the why, the condition, the exception. The rest drops a level (evidence, then deep dive) without leaving the page.

## When to reach for it

The agent reaches for it on its own when it explains a business, product, system or process on a page, picks a diagram or chart type, decides whether something should animate, or tightens a long explanation. Type `/visual-forms` to run it on something you already have.

Other skills call it rather than repeating its rules: `investment-thesis` before laying out each section of a company page, `ui-design` when a screen explains content, and the animation skills before animating anything that explains a mechanism.

## Accuracy over polish

- A simpler picture that changes the meaning is wrong.
- A causal arrow needs evidence, and a node carries the same FACT, INFERENCE or UNKNOWN label its sentence would.
- Missing data shows as UNKNOWN in its slot.
- When no form shows it correctly, it stays text.

## It's working if

- Each section opens on its point, not a lead-in.
- You can tell how the parts relate from the picture before reading the words.
- No sentence repeats what the picture beside it shows, and no figure, risk or exception went missing.
- Nothing on the page moves or branches just to look good.
