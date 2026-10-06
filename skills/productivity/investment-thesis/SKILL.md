---
name: investment-thesis
description: Build or stress-test a deep investment thesis for a company the user picks, tracing value from megatrend through industry, value chain and bottleneck to the company's advantage, economic capture, financials, counter-thesis and valuation. Use when the user asks whether a company can win its industry, wants an investment thesis, moat or bottleneck analysis, wants to know what a valuation implies, or wants to track or update an existing thesis.
---

# Investment Thesis

Explain **why this company can win its industry, and what can break that advantage**. The deliverable is a thesis, not a recommendation: the user makes the investment decision.

## The causal chain

Every thesis walks this chain in order. Each link must show the **mechanism** that carries value to the next one; a link with no mechanism is a gap, and the thesis says so.

```
MEGATREND → INDUSTRY IMPORTANCE → INDUSTRY STRUCTURE → VALUE CHAIN → BOTTLENECK
→ COMPANY POSITION → COMPETITIVE ADVANTAGE → MOAT → ECONOMIC CAPTURE
→ FINANCIAL OUTCOME → SECOND-ORDER EFFECTS → COUNTER-THESIS → THESIS BREAKERS
→ VALUATION → THESIS → THESIS TRACKER
```

Industry comes before company. "The industry grows" reaches "this company captures it" only through the value chain, the bottleneck, pricing power and the financials.

## Workflow

1. **Frame the investment question.** Write it before any research, e.g. "How structural is X's advantage in industry Y, and how much of Y's growth can X capture?" Resolve ambiguity yourself; ask the user only when the answer would change the company, the industry, or the time horizon. Done when the question names company, industry, and what "winning" means.
2. **Gather evidence** per the research principles below. Done when every number you will cite has a source and a date.
3. **Walk the chain**, loading only the reference for the link you are on (routing table). Done when each link has a conclusion, its evidence, and its unknowns.
4. **Attack the thesis**: counter-thesis, then thesis breakers with indicators. Done when you have searched for disconfirming evidence as hard as for confirming evidence.
5. **Value it**: reverse-engineer what today's price assumes, then bear, base, bull.
6. **Write the output** into [`templates/thesis-template.md`](templates/thesis-template.md), scored with [`templates/thesis-scorecard.md`](templates/thesis-scorecard.md).
7. **Verify** against the checklist below, fix what fails, then deliver.

For a narrower request (only the moat, only valuation, only an update), run just the matching links and say which links were skipped.

## Routing

Load a reference only when you reach its link.

| Link or question | Load |
| --- | --- |
| Investment question, megatrend, first-principles "why" chain | [`references/investment-framework.md`](references/investment-framework.md) |
| Industry importance and structure | [`references/industry-analysis.md`](references/industry-analysis.md) |
| Value chain, where the company sits | [`references/value-chain-analysis.md`](references/value-chain-analysis.md) |
| Bottlenecks and who profits from them | [`references/bottleneck-analysis.md`](references/bottleneck-analysis.md) |
| Company position and exposure | [`templates/company-analysis.md`](templates/company-analysis.md) |
| Sources of advantage | [`references/competitive-advantage.md`](references/competitive-advantage.md) |
| Moat durability | [`references/moat-analysis.md`](references/moat-analysis.md) |
| How much value the company keeps | [`references/economic-capture.md`](references/economic-capture.md) |
| Financials versus the thesis | [`references/financial-analysis.md`](references/financial-analysis.md) |
| Second- and third-order effects | [`references/second-order-effects.md`](references/second-order-effects.md) |
| Counter-thesis and thesis breakers | [`references/counter-thesis.md`](references/counter-thesis.md) |
| Valuation and embedded expectations | [`references/valuation.md`](references/valuation.md) |
| Tracking or updating an existing thesis | [`references/thesis-tracker.md`](references/thesis-tracker.md) |
| Unsure what good output looks like | [`examples/example-thesis.md`](examples/example-thesis.md) |

## Research principles

- **Search before concluding** when web access exists. Revenue, market share, valuation, competitors, capacity, pricing, backlog, industry growth and guidance come from current sources, never from memory. Without web access, label such figures as possibly stale and give their as-of date.
- **Source hierarchy.** Tier 1: annual and quarterly reports, regulatory filings, investor presentations, official company documents, government data, official technical documentation. Tier 2: earnings calls, industry associations, reputable and academic research. Tier 3: financial and industry media. Tier 4: forums and social media, used only for leads and sentiment. Trace every key claim to the highest tier available, and cross-check it against a second source when possible.
- **Label every key claim** as one of:
  - **FACT**: directly supported by cited evidence.
  - **INFERENCE**: your conclusion drawn from evidence; name the evidence.
  - **ASSUMPTION**: not yet supported; state what would confirm it.
- **Ask why until you reach economics.** Each answer gets a further "why?" until it lands on who captures the money and the evidence for it (see `investment-framework.md`).
- **Disconfirm actively.** For each link, look for the evidence that would make it wrong. Treat these as separate claims that each need their own proof: industry growth versus company success, growth versus moat, high margin versus moat, brand versus moat, low P/E versus undervaluation. Check how each market share figure is defined before using it.

## Decision boundary

Write about thesis strength, risks, required assumptions, and what would prove it wrong ("The thesis is strong because...", "It breaks if..."). Leave buy, sell and hold calls to the user. Answer in the user's language.

## Verification

Before delivering, confirm each item and fix any that fail:

- [ ] Investment question stated up front.
- [ ] Every chain link present, or marked skipped with the reason.
- [ ] Each link shows its mechanism, not just a label.
- [ ] Industry analysed before the company.
- [ ] Bottleneck exposure and pricing power evidenced for this company specifically.
- [ ] Moat has a cause, evidence, replication difficulty and a durability horizon.
- [ ] Financials explicitly confirm or contradict the advantage.
- [ ] Counter-thesis built from real disconfirming evidence.
- [ ] Every thesis breaker has a monitoring indicator.
- [ ] Valuation states what must be true for today's price.
- [ ] Key claims labelled FACT / INFERENCE / ASSUMPTION, with sources and dates.
- [ ] Scorecard is multi-dimensional, with no single overall score.
- [ ] No buy or sell call.
