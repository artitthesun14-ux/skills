---
name: test
description: Validate a finished piece of work against its acceptance criteria, covering the happy path, edge cases, and regressions, before review. Use when the user wants to verify a completed feature or fix works, rather than build it test-first.
---

# Test

Check that what got built matches what was asked for, and that it didn't break anything else. This is post-hoc verification; for building test-first, use `tdd` instead.

## Workflow

1. Map tests to acceptance criteria.
2. Run focused unit, component, and integration tests as appropriate.
3. Exercise the important user flows.
4. Test error, empty, loading, permission, and boundary states wherever relevant.
5. Check responsive and accessibility behavior for UI work.
6. Check for regressions in related functionality.
7. Record failures with reproduction steps.
8. Re-test fixes.

## Output

- Test matrix
- Commands/checks performed
- Pass/fail results
- Reproduction steps for failures
- Regression findings
- Remaining risk

## Rules

- Test behavior, not just implementation details.
- Never mark an untested requirement as passed.
- Prioritize critical user journeys and high-risk changes.
