---
name: abc
description: Research an investment thesis from megatrend to company, following the value chain and hunting for bottlenecks before naming a stock.
disable-model-invocation: true
---

Research tool whose output may be shared. Not investment advice. Write all analysis output in Thai; these instructions stay in English.

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
5. **Find bottlenecks.** Check supply constraint, capacity expansion difficulty, qualification barrier, switching cost, supplier concentration, geographic concentration, technology complexity, capital intensity. Use this to prioritize research, not as a trade recommendation. When several layers look constrained, rank them: a bottleneck outranks another when more of the chain has to pass through it (every alternative downstream still routes through this one rather than around it), when adding supply takes longer and money cannot shorten it (a qualification cycle or a line booked years out beats a shortage capital can clear), and when fewer suppliers are qualified to serve it. Then separate gating from capturing, because they are not the same layer: whoever controls the queue is not always whoever keeps the profit, and a regulated gatekeeper can hold total control on a capped return. The bottleneck that decides the thesis is the one that gates the chain and captures the value. Then, at every bottleneck, ask: if this jams, what can the buyer turn to? Walk the buyer's options: another technology (nuclear, or solar plus storage, in place of a gas turbine), capacity already built, making it themselves, another supplier, or waiting for new capacity, each with when it arrives and what it still depends on. An option that still routes through the same bottleneck is no way around it; say so. "No real alternative" is a valid answer and makes the bottleneck stronger; say why. The step is done when every gating layer carries this answer.
6. **Recursive deep dive.** For the layers that matter, keep asking "what does this consist of?" and go one level deeper (for example GPU to HBM to DRAM to Wafer to Manufacturing Equipment). Stop when the next layer stops adding meaningful economic understanding, or evidence runs out.
7. **Discover companies.** Only after the value chain is understood. Cover public, private, incumbent, challenger, supplier, customer, and substitute. For each: Layer, Exposure, Revenue relevance, Competitive advantage, Capacity, Customer concentration, Economics. Name real companies in every layer, the bottleneck layer first: a layer left as "not researched yet" is the one the thesis most depends on. Name the chokepoints between layers too, where a sole source or a three-player oligopoly gates everything downstream. When a search is unavailable, name them from what is already known about the industry's structure and tag it as such, keeping the two decay speeds under Evidence Rules apart.
8. **Validate economics.** For each listed company in contention for step 10, read five things in this order: revenue exposure to this chain; margin and operating leverage, with the pricing evidence behind them (backlog margin, price on new contracts); FCF against capex; ROIC, and incremental ROIC only where reported figures give it; whether the balance sheet can fund capacity growth; then valuation context: market value and the one or two multiples that fit the business, dated to the day of the price, set against the company's own history or its peers, and what growth or margin that price already assumes. Where sources disagree on a multiple, give the range. Exposure comes first because it decides whether the rest reads the thesis: when the chain is a small or undisclosed share of revenue, say so and read the reported segment instead, since a consolidated margin then describes a different business. Skip unlisted companies. Give every figure its period and source. Also check customer concentration, market share, switching cost, network effects, IP, scale, qualification barriers. Close the loop from step 5 by name: pricing power that leaves no trace in revenue mix, margin, or ROIC is a claim about the layer, not yet about the company holding it.
9. **Find second-order effects.** Ask who is affected at the second and third order if the thesis plays out (for example: AI inference up, GPU utilization up, memory bandwidth importance up, HBM demand up, packaging complexity up, yield importance up, testing/inspection importance up).
10. **Name the advantaged and the overlooked.** Two questions the finished chain can answer that a company list cannot. *Advantaged*: whose position is hardest to attack. Rank by the bottleneck test from step 5 (gates the chain and captures the value), then by whether this chain is significant to that company's own revenue, then by margin durability and switching cost. A company that is advantaged and obvious to everyone is still advantaged: say so rather than reaching for a less crowded name. *Overlooked*: who carries more of the chain than their visibility suggests. Hunt where attention does not go: layers deep enough that nobody prices them against this trend, the second-order beneficiaries from step 9, sole sources hidden behind a famous customer, and real exposure buried inside a much larger business. An overlooked name needs both halves, evidence that it matters and a reason attention misses it; with only the first it is just another company. This ranks structural position, not attractiveness at a price: valuation stays in the Financial Layer and never enters this ranking, and entry and timing stay out entirely. When a slot cannot be evidenced, leave it empty and name what would fill it.
11. **Build counter-thesis.** Check for: demand not growing as expected, technology shift, efficiency gains, supply growing faster than expected, substitutes entering, customers building in-house, margin compression, bottleneck disappearing.
12. **Identify key indicators.** List the numbers and events worth watching to confirm or break the thesis. Report them as part of the output; do not set up any tracking or monitoring.

## Decision Log

The artifact carries the current read of each topic, and a refresh overwrites that topic's page. The decision log is what survives underneath it: `decision-log.md`, append-only. Head every entry with the topic slug and the date, so one file holds the whole library.

The log lives in the private GitHub repo `artitthesun14-ux/abc-decision-log`, cloned at `~/.cache/abc/`, beside `artifact-url`. The repo is the source of truth because a container is ephemeral: a file only in `~/.cache/abc/` is lost with it. Sync before reading either file: pull when the clone exists, otherwise clone it there (in a cloud session, attach the repo with `add_repo` first). After every write to either file, commit and push. When the repo is unreachable, work on the local files and say in the chat brief that the log was not pushed, so the next run reconciles it first.

Read this topic's entries before step 1, and skim the slugs of the others for a chain that already touches this one. Earlier entries already name what would invalidate them, so they say where this run starts looking, and a run that only re-derives what the log already holds is a run spent twice.

Append one entry at the end of the run, slugged and dated, covering the judgments the run actually turned on: the thesis, the bottleneck call, and any evidence tag that moved. Carry each one over with the evidence and the invalidation conditions step 3 already attached to it, in a few lines each. Leave the rest out.

Let earlier entries stand as written. When a run overturns one, write the reversal as a new entry naming the entry it overturns and what changed the read. The log is then a record of how the thesis moved, which is the thing a later run cannot reconstruct from the artifact.

## Output Format

The artifact carries the analysis; the chat carries a short brief pointing at it. What sits in the artifact is never reprinted in chat, tables and cards alike: one reading, not two.

### Chat brief

In Thai, roughly 150 to 250 words, in this order:

1. What changed since this topic's last run: evidence that moved a tag, judgments that changed and why, figures that went stale. Build this by diffing against the decision log rather than from memory. On a topic new to the library, say in one line that it is new, and name the topics already on the shelf whose chains it touches.
2. The thesis in two or three sentences: the mechanism, the bottleneck, who gates it and who captures the value.
3. The unknown that matters most, and what would settle it.
4. What you stopped short of, so a later run starts there instead of repeating this one.
5. The link.

Go past that only for a section the user asks to see in full.

### Artifact

Publish the run's topic page, in Thai, holding the whole analysis. It goes into a library of topics rather than replacing what is there; Library below has the mechanics. Before writing it, call the Skill tool with "artifact-design", then call the Skill tool with "artifact-diagramming".

The page opens on the **Layer Map**: the chain's nodes as a vertical stack of cards, upstream first, for a reader who does not yet know the industry. Each card names the layer, says in one plain Thai line what the layer makes or does (`product`: "transmission lines, substations and the interconnection queue", never a finding), and says who trades there: `sellers`, the companies that make or sell what the layer makes, and `customers`, who buys it, named as companies where known (a demand layer carries customers only). Keep the two lists apart, since a layer's company list often mixes in its buyers, and write each customer so the next layer up reads as the seller list of the one below where that is true. A layer with neither falls back to its companies. A layer with sellers also lists `sells_to`: the ids of the layers where its customers appear, read off those lists. The map ends on the **end consumer**, `chain.end`: who finally uses what the chain delivers (`label`, `product`, `who`, `icon`), a plain card after the last layer with no panel and no weight. A layer whose customers sell on to those people, or are those people, lists `"end"` in `sells_to`; any other customer outside every layer adds nothing. The stack runs in causal order, so a buyer layer can sit above or below its seller; the shell draws each `sells_to` link as a line in the map's gutter, all of them behind a toggle, or one layer's full upstream and downstream path when the reader presses that layer's line button. A hardware layer carries a small line drawing chosen by `icon` from the set the shell holds (chip, memory, wafer, server, tower, turbine, transformer, plant, generator, pipeline, mine, cylinder, centrifuge, fuelrod, rocket, satellite, dish, device); a software, market or policy layer carries none. The map keeps one encoding only, the bottleneck, set by `role`: `both` for the layer that gates and captures, `gate` for one that gates without capturing, `capture` for one that captures without gating, absent for the rest; those cards get the red frame. The weight colours and evidence tags live in the detail panel, so the map stays readable at a glance. Each competing pressure in `chain.pressures` names the node it pushes on as `target` and sits folded shut under that card: its label and effect on top, its lines and companies inside. Each bottleneck carries the step 5 answer as a pressure with `kind: "alternative"`: `label` ("ถ้ากังหันก๊าซติด"), `verdict` (one line on how good the way around is), `tag` (its evidence), and `options`, each with `label`, `when` ("ตอนนี้" or when it arrives), `note` (what it still depends on), and `via` when the option is itself a layer on the map, so the reader can jump to that card. It sits under the bottleneck card above any other pressure. A buyer's way around belongs here and a force from outside the chain stays a plain pressure, so each idea has one box. Money runs opposite to goods: `chain.flows` gives, for every `sells_to` link, the payment going back as `from` (the buyer, who pays), `to` (the seller) and `label` (what the payment is for, in plain Thai: "ซื้อกังหันเพื่อสร้างโรงไฟใหม่"). Direction stays in `sells_to`; `flows` carries only the label, and every link needs one, including links into `"end"`, paid `from` `"end"`. Where little or no money moves (volunteer work, a free model), the label says so. The reader switches the map between goods lines and money lines. Clicking a card opens the detail panel.

The second view, **บทวิเคราะห์**, holds only the written sections listed below: a chain diagram and a Value Chain table would repeat the map and the panel. Still write every node's `summary`, `companies_short`, weight and tag, and the `value_chain` rows, because the panel shows the weight and tag, and a topic without `product` falls back to the rest. That fallback view is a branching diagram of the Causal Chain (fall back to the Value Chain if it has more layers worth showing). Draw one branch per link in the chain, with a short callout beside each node giving its role and its FACT / ASSUMPTION / INFERENCE / UNKNOWN tag.

Each node also names the companies sitting in that layer, so the chain reads as a map of who is where. Keep the node itself to the two or three that matter most, and make every node clickable: selecting one opens a detail panel carrying that layer's function, why it is or is not a bottleneck, its full company list with each one's exposure and why it is listed, the economics, and the evidence behind the claims. The panel is where the depth goes; the drawing stays readable without it. This is plain client-side JavaScript in the page, not a runtime capability.

Dock that panel so a click shows the detail where the reader already is. Fix it to the side of the viewport on a wide screen and let it rise from the bottom on a narrow one, with a control that dismisses it. Two properties make this worth the wiring. The diagram stays on screen and stays clickable, so moving from one layer to the next is a single click rather than a click away and a click back. And the drawing keeps its own width, because the panel floats over the space the chain leaves empty instead of taking a column from it. A chain drawn as a tall column of nodes uses well under half its width for most of its height, which is exactly the space a floating panel wants and exactly why splitting the figure and the panel into two grid columns is the wrong move: it shrinks the drawing by roughly the width of the panel and takes the node type down with it. Where the panel would cover something drawn, dismissing it is the answer, not moving the drawing.

Carry a second reading beside the evidence tag: your own judgment of how much each node and company matters, and why it is worth attention. The two layers answer different questions and must stay visually separate. The evidence tag says how well supported a claim is; the judgment says how much it matters if true. A node can be UNKNOWN and critical at once, and that pair is usually the most valuable thing on the page.

Rate every node and company as one of: critical (a chokepoint with no substitute, the chain breaks without it), watch (a risk or assumption that could break the thesis), interesting (an asymmetry worth digging into next), or context (background, not a decision point). Colour those four red, amber, green and neutral, and move the evidence tags to a quiet monochrome ramp so the two encodings never compete for the same red. Write the judgment in your own voice, one or two sentences, saying what makes the point worth attention and what would change your mind. It explains reasoning and never recommends buying or selling.

The บทวิเคราะห์ view opens with a layer overview: one row per node with its weight and evidence tag, the important nodes (critical or watch) resting on anything short of FACT first, since that pair is where the next search pays most. The chain's `caption` sits under the Layer Map, so write it about the map's bottlenecks. Then it carries the rest of the analysis as sections:

- **Executive Summary**: trend, core thesis, key mechanism, most important bottleneck, major unknowns.
- **Value Chain**: Layer, Function, Bottleneck, Companies, Evidence. Shown only in the fallback chain view.
- **Company Map**: Company, Layer, Exposure, Business relevance, Key risk.
- **Most Advantaged**: up to three, strongest first. For each: company, layer, what makes the position hard to attack, how significant this chain is to its own revenue, and what would erode the advantage. Mark which of them are already obvious to the market.
- **Overlooked but Critical**: up to three. For each: company or layer, what it actually carries in the chain, why attention misses it, what the exposure is worth to its own revenue, and what would confirm or kill the case. A slot left empty with the gap named beats a slot filled with plausible prose.
- **Counter-Thesis**: one card per claim the thesis rests on, never a row in a wide table. A six column row lays the supporting and the opposing reading end to end and asks the reader to hold the first half in memory while scanning the second; the opposition is the content here, so the layout carries it. Each card puts the claim at the top, the evidence for it and the evidence against it in two columns facing each other, and closes with the key unknown sitting between them and the thesis breaker that would settle it. Keep each card compact enough that several stack on one page: the count follows the claims the thesis actually rests on. When a claim has no opposing column yet, it is not a counter-thesis but an unchallenged assumption, so label it that way and name the evidence that would fill the column.
- **Key Indicators**: the numbers and events worth watching to confirm or break the thesis.
- **Sources**: grouped as primary sources / filings, technical documentation, industry sources, reliable secondary research.

The topic page has a third view, **Financial Layer**, switched from the header beside the layer map and the บทวิเคราะห์ view. It carries step 8's reading as one card per listed company that Most Advantaged or Overlooked but Critical names, in step 8's order: exposure, margin and pricing evidence, FCF and capex, ROIC, balance sheet. Each line carries its evidence tag, period and source; an undisclosed figure is shown as undisclosed. Then one verdict, whether the thesis already shows in this company's numbers (seen, partial, not yet, undisclosed), with a line saying why; it reads evidence only, never price. Valuation context sits below the verdict as the card's last line, because it is the figure that goes stale fastest and answers a different question: how much of the thesis the market already prices. It describes and never judges: no fair value, no target price, no cheap or expensive call, no DCF. A node's detail panel links to the cards of the companies in that layer.

Mark in the company tables whichever names the Most Advantaged and Overlooked but Critical sections carry, as a third encoding kept clear of the weight colours and the evidence ramp.

Fold each section to what the thesis turns on, with the rest behind a "ดูข้อมูลเพิ่มเติม (อีก N)" button that expands in place and folds back. What stays open: in the summary, the core thesis, the bottleneck and the major unknown; in the value chain, the bottleneck rows; in the company map, the marked names; the first of the advantaged and of the overlooked; the first two counter-thesis cards; the first three indicators. Sources stay folded. The shell decides this from fields the topic already carries, so every topic on the shelf folds the same way.

#### Library

The artifact is one library, not one report. Each run adds a topic or refreshes a topic already on the shelf, and every other topic stays exactly as it was. Opening the artifact lands on the shelf, and a topic opens from there.

Structure it as a multi-file artifact:

- `index.html`, the shell: the shelf, the topic switcher, and all rendering and styling for a topic page.
- `topics/<slug>.json`, one per topic: everything that run researched, as data.
- `topics/index.json`: one entry per topic, carrying slug, title, the date of its last run, and the thesis in a line.

A topic file's `tickers` field maps each company name, exactly as the topic writes it, to its ticker: a bare symbol for a US listing, an exchange suffix otherwise (`.T`, `.HK`, `.L`), `A · B` for a company reached through its listed owners, and `ไม่จดทะเบียน` for one that cannot be bought. A combined name such as `Dell / HPE / Lenovo` takes one entry per part. Confirm each ticker by search before writing it, since listings move (a secondary listing, an IPO, a delisting).

A run touches only its own topic file, the index, and the shell. Files left out of a publish are kept, so earlier topics survive without being read back or re-emitted, which is what stops a run from costing more as the library grows.

Steps for a run:

1. Read `~/.cache/abc/artifact-url` after the sync under Decision Log. No file means a fresh library: build the shell, publish, then save the returned URL there and push it.
2. Read `topics/index.json` and one existing topic file from the artifact. Match the subject against the slugs already there before minting a new one, so a refresh lands on the existing topic instead of forking it into a near-duplicate. The topic file's fields are the current shape: write the new topic in that shape, adding fields only where it has none for what this run found.
3. Serve the shell with every topic locally and click every node of every topic in a browser. The check is done when each node opens its panel and the page raises no error. It covers the whole shelf, not this run's topic, because a new topic changes the cross-links drawn in the older ones.
4. Publish `topics/<slug>.json`, the updated `topics/index.json`, and the shell. Pass no other topic file. A change to the shell alone publishes the shell alone, after the same check. Removing a topic is the same publish with its index entry dropped and its file mapped to null.

A saved URL pointing at an artifact built before the library existed is the one case that needs a migration, and it happens once. List the artifact's files: no `topics/index.json` means the URL holds a single-page report from an earlier run. Read that page, lift the analysis it already carries into `topics/<slug>.json` under the current shape, and publish it together with the new shell and index, before the topic this run researched. Two things keep the migration honest. Date the migrated topic by the run that produced it, never by today, because its figures are as old as they were. And carry across only what the page actually says: a field the old page has no answer for is left absent, which the shell already renders as a missing section, rather than filled in from a guess. Nothing is re-researched here, the page is only moved onto the shelf. Head the decision log entries that pre-date slugs with that topic's slug at the same time.

Two rules keep the older topics from rotting as the shell moves on. Add fields, never repurpose one, because a field that quietly changes meaning corrupts every topic written before the change. And render defensively, so a topic missing a field the shell now knows about drops that section instead of failing to draw. The shell holds the rendering, so a later improvement to the diagram or the counter-thesis cards reaches topics researched months earlier.

Where a company or a layer appears in more than one topic, say so on its detail panel and link across to the other topic. This is the part a stack of separate pages cannot do: the same chokepoint surfacing in two unrelated chains is a finding, not a coincidence.

The shelf carries each topic's title, the date of its last run, the thesis in a line, and a mark where that date is old enough that its figures need re-checking under Evidence Rules.

Give the user the link to the topic, not to the shelf.

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

Evidence status only, never investment advice. The output may be shared, so every page carries a notice that it reports evidence status and is not investment advice, and that its figures carry the dates and sources they were true at. Because readers other than the user may act on it, hold the Don't list under Agent Behavior strictly: name no best stock, give no fair value, target price, or cheap or expensive call, and say nothing on entry or timing. Valuation appears only as dated context on a Financial Layer card.
