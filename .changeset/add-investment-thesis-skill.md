---
"mattpocock-skills": minor
---

Add the `investment-thesis` model-invoked productivity skill. It builds a deep investment thesis for a chosen company along one causal chain (megatrend, industry, value chain, bottleneck, company position, advantage, moat, economic capture, financials, second-order effects, counter-thesis, thesis breakers, valuation, tracker), labels key claims as fact, inference or assumption, and stops short of buy or sell calls. Method detail lives in progressively disclosed `references/`, with output `templates/` and a fictional worked example.

Wired into the promoted set: `.claude-plugin/plugin.json`, the top-level and `productivity/` `README.md` (Model-invoked), a docs page at `docs/productivity/investment-thesis.md`, and a route in `ask-matt`'s Standalone section.

It also ranks bottlenecks on the company's path (gate versus capture, the buyer's way around), maps every input the product consumes, compares direct peers, adds an UNKNOWN label and claim-by-claim counter-thesis cards, and publishes each thesis as a company page in a single thesis library artifact with a dated history.

Each company page is laid out in five acts with progressive disclosure (a 30-second thesis, a tappable thesis chain, then The Setup, The Battlefield, The Moat, The Money and The Test, with evidence cards one tap away), per the new `references/thesis-page.md`.
