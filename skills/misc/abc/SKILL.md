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
3. **Build initial thesis.** Draft the causal chain: Trend, Demand, Technology, Required Components, Constraint, Economic Value, Companies. Tag each link with its evidence, the assumptions it rests on, and what would invalidate it.
4. **Map value chain.** From upstream to downstream. For each node, capture Function, Inputs, Outputs, Suppliers, Customers, Alternatives, Bottlenecks, Economics.
5. **Find bottlenecks.** Check supply constraint, capacity expansion difficulty, qualification barrier, switching cost, supplier concentration, geographic concentration, technology complexity, capital intensity. Use this to prioritize research, not as a trade recommendation. When several layers look constrained, rank them: a bottleneck outranks another when more of the chain has to pass through it (every alternative downstream still routes through this one rather than around it), when adding supply takes longer and money cannot shorten it (a qualification cycle or a line booked years out beats a shortage capital can clear), and when fewer suppliers are qualified to serve it. Then separate gating from capturing, because they are not the same layer: whoever controls the queue is not always whoever keeps the profit, and a regulated gatekeeper can hold total control on a capped return. The bottleneck that decides the thesis is the one that gates the chain and captures the value.
6. **Recursive deep dive.** For the layers that matter, keep asking "what does this consist of?" and go one level deeper (for example GPU to HBM to DRAM to Wafer to Manufacturing Equipment). Stop when the next layer stops adding meaningful economic understanding, or evidence runs out.
7. **Discover companies.** Only after the value chain is understood. Cover public, private, incumbent, challenger, supplier, customer, and substitute. For each: Layer, Exposure, Revenue relevance, Competitive advantage, Capacity, Customer concentration, Economics. Name real companies in every layer, the bottleneck layer first: a layer left as "not researched yet" is the one the thesis most depends on. Name the chokepoints between layers too, where a sole source or a three-player oligopoly gates everything downstream. When a search is unavailable, name them from what is already known about the industry's structure and tag it as such, keeping the two decay speeds under Evidence Rules apart.
8. **Validate economics.** Check revenue mix, growth, gross margin, operating margin, FCF, ROIC, capex, customer concentration, market share, switching cost, network effects, IP, scale, qualification barriers. Close the loop from step 5 by name: pricing power that leaves no trace in revenue mix, margin, or ROIC is a claim about the layer, not yet about the company holding it.
9. **Find second-order effects.** Ask who is affected at the second and third order if the thesis plays out (for example: AI inference up, GPU utilization up, memory bandwidth importance up, HBM demand up, packaging complexity up, yield importance up, testing/inspection importance up).
10. **Name the advantaged and the overlooked.** Two questions the finished chain can answer that a company list cannot. *Advantaged*: whose position is hardest to attack. Rank by the bottleneck test from step 5 (gates the chain and captures the value), then by whether this chain is significant to that company's own revenue, then by margin durability and switching cost. A company that is advantaged and obvious to everyone is still advantaged: say so rather than reaching for a less crowded name. *Overlooked*: who carries more of the chain than their visibility suggests. Hunt where attention does not go: layers deep enough that nobody prices them against this trend, the second-order beneficiaries from step 9, sole sources hidden behind a famous customer, and real exposure buried inside a much larger business. An overlooked name needs both halves, evidence that it matters and a reason attention misses it; with only the first it is just another company. This ranks structural position, not attractiveness at a price, so say nothing about valuation, entry, or timing. When a slot cannot be evidenced, leave it empty and name what would fill it.
11. **Build counter-thesis.** Check for: demand not growing as expected, technology shift, efficiency gains, supply growing faster than expected, substitutes entering, customers building in-house, margin compression, bottleneck disappearing.
12. **Identify key indicators.** List the numbers and events worth watching to confirm or break the thesis. Report them as part of the output; do not set up any tracking or monitoring.

## Decision Log

The artifact is overwritten on every run, so it carries only the current read. The decision log is what survives: `~/.cache/abc/decision-log.md`, append-only (create the directory if needed).

Read it before step 1. Earlier entries already name what would invalidate them, so they say where this run starts looking, and a run that only re-derives what the log already holds is a run spent twice.

Append one entry at the end of the run, dated, covering the judgments the run actually turned on: the thesis, the bottleneck call, and any evidence tag that moved. Carry each one over with the evidence and the invalidation conditions step 3 already attached to it, in a few lines each. Leave the rest out.

Let earlier entries stand as written. When a run overturns one, write the reversal as a new entry naming the entry it overturns and what changed the read. The log is then a record of how the thesis moved, which is the thing a later run cannot reconstruct from the artifact.

## Output Format

The artifact carries the analysis; the chat carries a short brief pointing at it. What sits in the artifact is never reprinted in chat, tables and cards alike: one reading, not two.

### Chat brief

In Thai, roughly 150 to 250 words, in this order:

1. What changed since the last run, when the artifact covered the same subject: evidence that moved a tag, judgments that changed and why, figures that went stale. Build this by diffing against the decision log rather than from memory. On a new subject, say in one line that the artifact held a different one.
2. The thesis in two or three sentences: the mechanism, the bottleneck, who gates it and who captures the value.
3. The unknown that matters most, and what would settle it.
4. What you stopped short of, so a later run starts there instead of repeating this one.
5. The link.

Go past that only for a section the user asks to see in full.

### Artifact

Publish one page, in Thai, holding the whole analysis. Before writing it, call the Skill tool with "artifact-design", then call the Skill tool with "artifact-diagramming".

Open with a branching diagram of the Causal Chain (fall back to the Value Chain if it has more layers worth showing). Draw one branch per link in the chain, with a short callout beside each node giving its role and its FACT / ASSUMPTION / INFERENCE / UNKNOWN tag.

Each node also names the companies sitting in that layer, so the chain reads as a map of who is where. Keep the node itself to the two or three that matter most, and make every node clickable: selecting one opens a detail panel carrying that layer's function, why it is or is not a bottleneck, its full company list with each one's exposure and why it is listed, the economics, and the evidence behind the claims. The panel is where the depth goes; the drawing stays readable without it. This is plain client-side JavaScript in the page, not a runtime capability.

Carry a second reading beside the evidence tag: your own judgment of how much each node and company matters, and why it is worth attention. The two layers answer different questions and must stay visually separate. The evidence tag says how well supported a claim is; the judgment says how much it matters if true. A node can be UNKNOWN and critical at once, and that pair is usually the most valuable thing on the page.

Rate every node and company as one of: critical (a chokepoint with no substitute, the chain breaks without it), watch (a risk or assumption that could break the thesis), interesting (an asymmetry worth digging into next), or context (background, not a decision point). Colour those four red, amber, green and neutral, and move the evidence tags to a quiet monochrome ramp so the two encodings never compete for the same red. Write the judgment in your own voice, one or two sentences, saying what makes the point worth attention and what would change your mind. It explains reasoning and never recommends buying or selling.

Below the diagram, carry the rest of the analysis as sections on the same page:

- **Executive Summary**: trend, core thesis, key mechanism, most important bottleneck, major unknowns.
- **Value Chain**: Layer, Function, Bottleneck, Companies, Evidence.
- **Company Map**: Company, Layer, Exposure, Business relevance, Key risk.
- **Most Advantaged**: up to three, strongest first. For each: company, layer, what makes the position hard to attack, how significant this chain is to its own revenue, and what would erode the advantage. Mark which of them are already obvious to the market.
- **Overlooked but Critical**: up to three. For each: company or layer, what it actually carries in the chain, why attention misses it, what the exposure is worth to its own revenue, and what would confirm or kill the case. A slot left empty with the gap named beats a slot filled with plausible prose.
- **Counter-Thesis**: one card per claim the thesis rests on, never a row in a wide table. A six column row lays the supporting and the opposing reading end to end and asks the reader to hold the first half in memory while scanning the second; the opposition is the content here, so the layout carries it. Each card puts the claim at the top, the evidence for it and the evidence against it in two columns facing each other, and closes with the key unknown sitting between them and the thesis breaker that would settle it. Keep each card compact enough that several stack on one page: the count follows the claims the thesis actually rests on. When a claim has no opposing column yet, it is not a counter-thesis but an unchallenged assumption, so label it that way and name the evidence that would fill the column.
- **Key Indicators**: the numbers and events worth watching to confirm or break the thesis.
- **Sources**: grouped as primary sources / filings, technical documentation, industry sources, reliable secondary research.

Mark in the company tables whichever names the Most Advantaged and Overlooked but Critical sections carry, as a third encoding kept clear of the weight colours and the evidence ramp.

Reuse one artifact across runs instead of publishing a new one each time: check `~/.cache/abc/artifact-url` for a saved URL first.
- If it exists, read the artifact at that URL, then republish to it (this overwrites its previous contents with the current run).
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

Facts here decay at two speeds, and mixing them is the easiest way to be confidently wrong. Industry structure (who is sole-source, how concentrated a layer is, what a qualification cycle demands) holds for years. Figures (lead times, backlogs, market shares, capex guidance, prices) can be stale within a quarter. State structure plainly, and give every figure the date it was true along with where it came from. A figure older than the pace of its own layer is a lead to verify, not evidence.

Stop searching when another search stops changing the shape of the chain, not when it stops returning results. A counter-thesis still unresolved keeps the search open even once the chain has settled: a stable shape and an answered objection are different things, and step 11 is where this one is owed. Then say what you stopped short of, so a later run starts there instead of repeating this one.

When a layer cannot be evidenced at all, say so and name what would settle it. Put durable structure in its place where the structure is known, tagged as structure. Never fill the gap with plausible prose: an unsupported paragraph reads exactly like a researched one, which is what makes it dangerous.

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

Before finalizing a thesis, the analysis should be able to answer: what the trend is, why it's happening now, how demand flows through the value chain, which layer matters most, where the bottleneck is, what causes it, who controls it, which companies have exposure, whether that exposure is significant to their business, where the economics sit, who has a substitute, who could lose out, who holds the strongest position and why, who is carrying more of the chain than their visibility suggests, what the second-order effects are, what would break the thesis, what to monitor, and which claims are fact versus inference. If it can't answer these yet, say so explicitly instead of forcing a conclusion.

## Compliance

Evidence status only, never investment advice. For personal research; do not distribute the output.
