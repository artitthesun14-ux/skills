## What it does

`investment-thesis` builds a deep thesis for a company you pick. It answers one question: **why can this company win its industry, and what can break that advantage?**

It walks a fixed causal chain, industry before company:

```
MEGATREND → INDUSTRY IMPORTANCE → INDUSTRY STRUCTURE → VALUE CHAIN → BOTTLENECK
→ COMPANY POSITION → COMPETITIVE ADVANTAGE → MOAT → ECONOMIC CAPTURE
→ FINANCIAL OUTCOME → SECOND-ORDER EFFECTS → COUNTER-THESIS → THESIS BREAKERS
→ VALUATION → THESIS → THESIS TRACKER
```

Each link has to show the mechanism that carries value to the next one. "The industry is growing" never jumps straight to "this company is attractive": the value chain, the bottleneck, pricing power and the financials stand in between.

The output is a 20-section thesis with a multi-dimensional scorecard and a KPI tracker. It is not a recommendation: the skill writes about thesis strength, risks and what must be true, and leaves the decision to you.

## When to reach for it

Type `/investment-thesis`, or the agent reaches for it when you ask whether a company can win, want a moat or bottleneck analysis, or ask what a valuation implies.

| What you want | How to ask |
| --- | --- |
| A full thesis | "Build an investment thesis for X." |
| One link only | "What is X's moat, and how durable is it?" The skill runs only that link and says which links it skipped. |
| What the price assumes | "What does X's valuation imply?" |
| An update | Bring the previous thesis plus new evidence (an earnings report, a competitor's announcement). It re-judges only the affected links and returns MAINTAIN, REVISE or BREAK. |

## How it keeps the thesis honest

- **Fact, inference, assumption.** Every key claim carries one of the three labels, so a conclusion never passes for evidence.
- **Source hierarchy.** It ranks filings and official data above earnings calls and research, those above media, and forums last (used only for leads). With web access it searches before it concludes, and never pulls figures such as revenue, share, backlog or valuation from memory.
- **Disconfirmation.** It writes the counter-thesis as the bear's best case and searches for disconfirming evidence as hard as for confirming evidence. Each thesis breaker comes with a monitoring indicator and a threshold.
- **No single score.** The scorecard rates eleven dimensions separately, each with evidence, confidence and unknowns.

## Progressive disclosure

`SKILL.md` holds the chain, the workflow, the routing table and the verification checklist. The method for each link lives in its own file under `references/`, loaded only when the analysis reaches that link. `templates/` holds the output shapes, and `examples/` holds one fictional worked example (a transformer maker in the AI power chain) that shows the reasoning, not a stock pick.

## It's working if

- The investment question is stated before any analysis.
- You can follow the thesis chain from megatrend to cash flow without a missing mechanism.
- Every number has a source and a date, and inferences are labelled as such.
- The counter-thesis is uncomfortable to read.
- You come away knowing what you would watch, and what reading would change your mind.
