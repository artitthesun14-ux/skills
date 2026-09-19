---
name: abc
description: Research an investment thesis from megatrend to company, following the value chain and hunting for bottlenecks before naming a stock.
disable-model-invocation: true
---

Personal research tool. Not investment advice, not for distribution. Write all analysis output in Thai; these instructions stay in English.

## Principles

- Start with a trend, not a ticker. Begin from a change in the world, never from a stock.
- Think in layers. Break a trend into a chain, for example: AI, Models, Compute, GPU/ASIC, HBM, Packaging, Networking, Optical, Data Center, Power, Cooling.
- Follow the bottleneck. For each layer, ask: what does it do, why is it needed, are there alternatives, how fast can supply grow, who makes it, is the market concentrated, is there a switching or qualification barrier, who captures the economic value.
- Separate evidence into FACT, ASSUMPTION, INFERENCE, and UNKNOWN.
- Always build a counter-thesis. Every thesis needs both supporting and challenging evidence.

## Workflow

Work through these steps in order. Do not skip ahead to a company before the value chain and bottlenecks are understood.

1. **Discover trend.** Identify the megatrend. Separate structural, cyclical, and temporary drivers.
2. **Define question.** State the specific question this research answers.
3. **Build initial thesis.** Draft the causal chain: Trend, Demand, Technology, Required Components, Constraint, Economic Value, Companies. Tag each link with Evidence, Assumption, Confidence, and what would invalidate it.
4. **Map value chain.** From upstream to downstream. For each node, capture Function, Inputs, Outputs, Suppliers, Customers, Alternatives, Bottlenecks, Economics.
5. **Find bottlenecks.** Check supply constraint, capacity expansion difficulty, qualification barrier, switching cost, supplier concentration, geographic concentration, technology complexity, capital intensity. Use this to prioritize research, not as a trade recommendation.
6. **Recursive deep dive.** For the layers that matter, keep asking "what does this consist of?" and go one level deeper (for example GPU to HBM to DRAM to Wafer to Manufacturing Equipment). Stop when the next layer stops adding meaningful economic understanding, or evidence runs out.
7. **Discover companies.** Only after the value chain is understood. Cover public, private, incumbent, challenger, supplier, customer, and substitute. For each: Layer, Exposure, Revenue relevance, Competitive advantage, Capacity, Customer concentration, Economics.
8. **Validate economics.** Check revenue mix, growth, gross margin, operating margin, FCF, ROIC, capex, customer concentration, market share, switching cost, network effects, IP, scale, qualification barriers.
9. **Find second-order effects.** Ask who is affected at the second and third order if the thesis plays out (for example: AI inference up, GPU utilization up, memory bandwidth importance up, HBM demand up, packaging complexity up, yield importance up, testing/inspection importance up).
10. **Build counter-thesis.** Check for: demand not growing as expected, technology shift, efficiency gains, supply growing faster than expected, substitutes entering, customers building in-house, margin compression, bottleneck disappearing.
11. **Identify key indicators.** List the numbers and events worth watching to confirm or break the thesis. Report them as part of the output; do not set up any tracking or monitoring.

## Output Format

Print the result in the chat, in Thai, using these sections. The chat text itself is not saved to a file.

### Executive Summary
Trend, core thesis, key mechanism, most important bottleneck, major unknowns.

### Causal Chain
Trend, Demand, Technology, Bottleneck, Economics, Companies.

### Value Chain
Table with columns: Layer, Function, Bottleneck, Companies, Evidence.

### Company Map
Table with columns: Company, Layer, Exposure, Business relevance, Key risk.

### Counter-Thesis
Table with columns: Thesis, Evidence for, Counter-thesis, Evidence against, Key unknown, Thesis breaker.

### Sources
List what was used, grouped as: primary sources / filings, technical documentation, industry sources, reliable secondary research.

### Diagram (Artifact)
In addition to the sections above, publish a branching diagram of the Causal Chain (fall back to the Value Chain if it has more layers worth showing) as an Artifact. Before writing it, call the Skill tool with "artifact-design", then call the Skill tool with "artifact-diagramming". Draw one branch per link in the chain, with a short callout beside each node giving its role and its FACT / ASSUMPTION / INFERENCE / UNKNOWN tag, in Thai.

Reuse one artifact across runs instead of publishing a new one each time: check `~/.cache/abc/artifact-url` for a saved URL first.
- If it exists, republish to that URL (this overwrites its previous diagram with the current one).
- If it doesn't, publish a new artifact, then save the returned URL to `~/.cache/abc/artifact-url` (create the directory if needed).

Give the user the link either way.

## Evidence Rules

Priority order when searching and citing (via WebSearch/WebFetch; no dedicated financial API is available, so treat this as a search priority, not a guarantee of access):

1. Regulatory filings
2. Annual / quarterly reports
3. Investor presentations
4. Official technical documentation
5. Earnings calls
6. Government / industry data
7. Reputable research
8. News
9. Forums / social media

Never build a causal relationship from a headline alone. Every important conclusion must trace back to evidence.

## Agent Behavior

Do:
- Reason from first principles.
- Ask "why" multiple layers deep.
- Separate Fact, Inference, and Assumption.
- Actively look for evidence that contradicts the thesis.
- Look at the whole value chain, not one company in isolation.
- Find the bottleneck before looking for a company.
- Check whether a company's revenue exposure is actually significant.
- State what is still unknown.
- Never express more confidence than the evidence supports.

Don't:
- Start from a stock and reason backward to justify it.
- Conclude which stock is "best."
- Treat a score as an investment recommendation.
- Substitute a pile of news for a causal model.

Before finalizing a thesis, the analysis should be able to answer: what the trend is, why it's happening now, how demand flows through the value chain, which layer matters most, where the bottleneck is, what causes it, who controls it, which companies have exposure, whether that exposure is significant to their business, where the economics sit, who has a substitute, who could lose out, what the second-order effects are, what would break the thesis, what to monitor, and which claims are fact versus inference. If it can't answer these yet, say so explicitly instead of forcing a conclusion.

## Compliance

Evidence status only, never investment advice. For personal research; do not distribute the output.
