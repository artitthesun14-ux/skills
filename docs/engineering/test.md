## What it does

`test` validates a change against its acceptance criteria before it goes to review. It maps tests back to the criteria, runs focused unit, component, and integration tests, walks the important user flows, exercises the error, empty, loading, permission, and boundary states, and checks that nothing in related functionality regressed. Where the change touches UI, it checks responsive and accessibility behaviour too.

Its defining rule is that an untested requirement is never marked as passed. The skill validates behaviour rather than implementation detail, and it prioritises the critical user journeys and the highest-risk parts of the change rather than chasing uniform coverage. That makes it a validation pass tied to what the work was supposed to do, not a request to write a test suite from scratch.

## When to reach for it

Type `/test`, or the agent reaches for it automatically when a task fits: it is model-invoked, so [implement](https://aihero.dev/skills-implement) or another flow can hand off to it.

Reach for it when something is built and you want it checked against its acceptance criteria before review. It is distinct from its neighbours: for the red-green loop that writes a failing test first and then the code to pass it, use [tdd](https://aihero.dev/skills-tdd); for reviewing the diff against standards and spec once it works, use [code-review](https://aihero.dev/skills-code-review).

## Prerequisites

It validates against acceptance criteria, so it needs them: the criteria on the originating [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) or [spec](https://www.aihero.dev/ai-coding-dictionary/spec). Without a statement of what "done" means, there is nothing to map the tests to, and step one has nothing to anchor on.

## Behaviour over implementation

The leading idea is that a test proves a requirement, and the two are mapped to each other explicitly. Coverage of lines is not the target; coverage of the acceptance criteria and the states a feature can be in is. That is why the workflow spends as much on the failure and edge cases (error, empty, loading, permission, boundary) as on the happy path, and why a failure is recorded with reproduction steps rather than just a red mark: the record is what makes the fix, and the re-test after it, honest.

## It's working if

- Each acceptance criterion has a test pointed at it, and none is quietly marked passed without one.
- The failure and edge states get exercised, not just the happy path.
- Failures come back with reproduction steps you can follow, and fixes are re-tested rather than assumed.
- The tests survive a refactor of the code underneath them, because they assert behaviour rather than internals.

## Where it fits

`test` is the validation step of the build chain, between implementation and review:

```txt
implement → test → code-review
```

Its neighbours are [implement](https://aihero.dev/skills-implement), which produces the change it validates; [tdd](https://aihero.dev/skills-tdd), the test-first loop that runs inside implementation at each seam; and [code-review](https://aihero.dev/skills-code-review), the two-axis review that follows once the behaviour is confirmed. Where `test` proves the work does what was asked, `code-review` judges how it was built.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
