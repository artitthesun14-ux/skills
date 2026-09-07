## What it does

`experiment` runs a controlled loop to decide between alternatives from measured evidence: hypothesis, change, run, measure, compare, keep or reject, record, repeat. You use it when you have two or more versions of something (a product decision, a UX or UI choice, a prompt, an implementation approach) and want to know which is better rather than guess.

Its defining rule is that the metric and the success threshold are defined before the experiment runs, not after the results are in. That, plus changing as few variables as practical, is what lets a result actually attribute a difference to a cause. It measures rather than asserts: manufactured metrics are out, and measured results are kept distinct from subjective judgment throughout.

## When to reach for it

Type `/experiment`, or the agent reaches for it automatically when a task fits: it is model-invoked.

Reach for it when a choice is worth settling with evidence instead of opinion, and you can define a metric for "better". It is not the skill for interviewing yourself toward a decision you can reason out: that is [grill-me](https://aihero.dev/skills-grill-me). It is for when the answer depends on a measurement only a run can produce.

## The loop

The leading idea is the experimental loop, and each turn of it leaves a record:

| Step | What happens |
| --- | --- |
| Hypothesis | State one clear thing you expect to be true |
| Metric + threshold | Define what you will measure and what counts as success, before running |
| Change | Alter as few variables as practical |
| Run | Execute under repeatable conditions |
| Measure + compare | Collect results against a baseline or alternative |
| Keep / reject / iterate | Decide from the evidence |
| Record | Write down the result so the same failed experiment is not run again |

The loop stops when improvement is marginal, the target is met, or the evidence is sufficient. Recording the failures matters as much as keeping the wins: a documented dead end is what stops a future session repeating it.

## It's working if

- The metric and threshold were written down before the run, not chosen to fit the result.
- Each run changes few enough variables that a difference can be attributed to a cause.
- Kept versions are preserved and rejected approaches are documented, so nothing is silently lost or silently repeated.
- Measured numbers and subjective impressions are reported as two different things.

## Where it fits

`experiment` is a reach-for-it-anytime standalone: it sits off the main build chain and runs whenever a decision is better made from data than from argument. In the product-building flow it is the loop that feeds improvements back in, most often looping a result back into [ux-design](https://aihero.dev/skills-ux-design) or [ui-design](https://aihero.dev/skills-ui-design) once a variation proves out.

Its closest neighbour by shape is [prototype](https://aihero.dev/skills-prototype): both answer a question with a small, disposable run, but a prototype answers "does this feel right" by building one throwaway thing to look at, while `experiment` answers "which is better" by measuring alternatives against a threshold.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
