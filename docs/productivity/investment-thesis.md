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

The output is a thesis page with a multi-dimensional scorecard, a KPI tracker and a dated history, published into one thesis library artifact with a page per company. It is not a recommendation: the skill writes about thesis strength, risks and what must be true, and leaves the decision to you.

## When to reach for it

Type `/investment-thesis`, or the agent reaches for it when you ask whether a company can win, want a moat or bottleneck analysis, or ask what a valuation implies.

| What you want | How to ask |
| --- | --- |
| A full thesis | "Build an investment thesis for X." |
| One link only | "What is X's moat, and how durable is it?" The skill runs only that link and says which links it skipped. |
| What the price assumes | "What does X's valuation imply?" |
| An update | Bring the previous thesis plus new evidence (an earnings report, a competitor's announcement). It re-judges only the affected links and returns MAINTAIN, REVISE or BREAK. |

## How it keeps the thesis honest

- **Fact, inference, assumption, unknown.** Every key claim carries one of the four labels, so a conclusion never passes for evidence and a gap is named rather than filled.
- **Bottlenecks ranked from the company's side.** It ranks the constraints on the company's own path, separates who gates the chain from who keeps the profit, and asks what the buyer can turn to when each one jams.
- **Every input on the map.** It lists what one unit of the product consumes and goes a level deeper wherever the thesis leans, until every input is mapped or named as excluded.
- **Source hierarchy.** It ranks filings and official data above earnings calls and research, those above media, and forums last (used only for leads). With web access it searches before it concludes, and never pulls figures such as revenue, share, backlog or valuation from memory.
- **Disconfirmation.** It writes the counter-thesis as the bear's best case and searches for disconfirming evidence as hard as for confirming evidence. Each thesis breaker comes with a monitoring indicator and a threshold.
- **No single score.** The scorecard rates eleven dimensions separately, each with evidence, confidence and unknowns.

## The thesis library

Every run writes into one artifact: a shelf of companies, each with its own page. A new company adds a page; an update edits that company's page and adds a dated MAINTAIN, REVISE or BREAK row to its history, so you can see how the thesis moved. The chat gets a short brief and the link, not a reprint.

Each page reads as a story before it reads as a report. It opens with the thesis in one sentence and four 30-second cards (why now, why this industry, why this company, what can break it), then a tappable thesis chain. Below that sit five acts, each answering one question: The Setup (what is happening), The Battlefield (where the fight is), The Moat (why it wins), The Money (where the value goes), and The Test (what proves it wrong). Evidence, full tables and sources stay one tap away, so the first screens stay short without dropping any of the research.

## Progressive disclosure

`SKILL.md` holds the chain, the workflow, the routing table and the verification checklist. The method for each link lives in its own file under `references/`, loaded only when the analysis reaches that link. `templates/` holds the output shapes, and `examples/` holds one fictional worked example (a transformer maker in the AI power chain) that shows the reasoning, not a stock pick.

## It's working if

- The investment question is stated before any analysis.
- You can follow the thesis chain from megatrend to cash flow without a missing mechanism.
- Every number has a source and a date, and inferences are labelled as such.
- The counter-thesis is uncomfortable to read.
- You come away knowing what you would watch, and what reading would change your mind.
