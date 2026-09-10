---
name: test
description: Validate functionality, UX-critical behaviour, regressions, edge cases, and acceptance criteria before review. Use when the user wants a change tested against its acceptance criteria, asks to cover happy-path and failure/edge cases, or wants to catch regressions before the work goes to review.
---

# Test

## Purpose

Confirm that what was built matches its acceptance criteria and does not break the existing system, covering both the happy path and the failure and edge cases.

## Workflow

1. Map tests to acceptance criteria.
2. Run focused unit/component/integration tests as appropriate.
3. Test important user flows.
4. Test error, empty, loading, permission, and boundary states where relevant.
5. Check responsive/accessibility behaviour for UI work.
6. Check regressions in related functionality.
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

- Test behaviour, not implementation details only.
- Never mark an untested requirement as passed.
- Prioritise critical user journeys and high-risk changes.
