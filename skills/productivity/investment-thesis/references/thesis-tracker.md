# Thesis tracker

Turn the thesis into something you can check when new evidence arrives.

## The loop

```
THESIS → KEY ASSUMPTIONS → KEY INDICATORS → MONITOR → NEW EVIDENCE → UPDATE
→ THESIS VALID? → REVISE / MAINTAIN / BREAK
```

## Build the tracker

For each load-bearing assumption, each thesis breaker and each unresolved unknown from the debate (`investment-debate.md`), one row. This table is the page's What to watch:

| Assumption or breaker | Indicator | Current value (date) | Supports if | Breaks if | Source | Check frequency |
| --- | --- | --- | --- | --- | --- | --- |

Typical indicators: revenue exposure, market share, backlog, pricing, margin, ROIC, capex, capacity, lead time, customer concentration, competitor capacity.

## Updating an existing thesis

When the user brings new evidence (an earnings report, a competitor announcement):

1. Load the previous thesis and its tracker from the company's page in the thesis library (`thesis-library.md`). Its earlier history rows name what would invalidate the thesis, so they say where this run starts looking.
2. Map the new evidence to the rows it affects; leave unaffected rows unchanged.
3. Update each affected value with source and date.
4. Re-judge only the chain links those rows feed, then reopen the debate on the assumptions they touch: re-run those exchanges with the new evidence, and add an exchange where the evidence raises a question the debate never asked. Write a new verdict and What changed.
5. Decide: **MAINTAIN** (assumptions intact), **REVISE** (a link changed, the thesis survives in altered form; state the new version), or **BREAK** (a breaker threshold crossed; state which).
6. Record the decision, the new thesis status and the reason as a new row at the top of the page's history, newest first. Earlier rows stay as written; a reversal names the row it overturns and what changed.
