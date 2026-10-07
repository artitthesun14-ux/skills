# Thesis tracker

Turn the thesis into something you can check when new evidence arrives.

## The loop

```
THESIS → KEY ASSUMPTIONS → KEY INDICATORS → MONITOR → NEW EVIDENCE → UPDATE
→ THESIS VALID? → REVISE / MAINTAIN / BREAK
```

## Build the tracker

For each key assumption and each thesis breaker, one row:

| Assumption or breaker | Indicator | Current value (date) | Supports if | Breaks if | Source | Check frequency |
| --- | --- | --- | --- | --- | --- | --- |

Typical indicators: revenue exposure, market share, backlog, pricing, margin, ROIC, capex, capacity, lead time, customer concentration, competitor capacity.

## Updating an existing thesis

When the user brings new evidence (an earnings report, a competitor announcement):

1. Load the previous thesis and its tracker from the company's page in the thesis library (`thesis-library.md`). Its earlier history rows name what would invalidate the thesis, so they say where this run starts looking.
2. Map the new evidence to the rows it affects; leave unaffected rows unchanged.
3. Update each affected value with source and date.
4. Re-judge only the chain links those rows feed.
5. Decide: **MAINTAIN** (assumptions intact), **REVISE** (a link changed, the thesis survives in altered form; state the new version), or **BREAK** (a breaker threshold crossed; state which).
6. Record the decision and its reason as a new row at the top of the page's history, newest first. Earlier rows stay as written; a reversal names the row it overturns and what changed.
