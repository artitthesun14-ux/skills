# Thesis page

The company page introduces the company first, then tells the thesis as a story, and lets the reader dig for evidence last. A reader new to the company should know what it does and how it earns before the first thesis claim, grasp why the company wins, where the money goes and what survived the debate within a minute more, then open detail only where they care. The page changes how the analysis is shown, never what it says.

## Levels

Detail is disclosed in four levels. The first phone screens of the Company and Thesis tabs hold only Level 1.

1. **The first minute**: the profile's opening answer, and the thesis hero with its four short cards.
2. **The flows**: the product flow, the thesis chain and the debate, one line per step, link or exchange, each opening to its detail.
3. **Evidence**: label tags, evidence markers and the cards they open.
4. **Deep research**: full tables, charts, scorecard, history and sources, behind a disclosure or in the Evidence section.

## Layout

Seven sections in reading order, each one tab of the company's group in the library (`thesis-library.md`): who the company is, the thesis, the numbers, the price, the debate that tries to break it, and what is left to watch. Each tab has one job, and a fact sits in the tab whose job it serves: a business model in Company, a margin in Financials, a multiple in Valuation. Each tab opens with its question as the heading and a one-sentence answer beneath it, so a reader skimming headings alone gets the company and the thesis. Section numbers refer to `templates/thesis-template.md`.

| Nav | Contents | Template sections |
| --- | --- | --- |
| 01 Company | **Masthead**: ticker, company, price, as-of date, the not-a-recommendation notice. Then the six parts of `company-profile.md`, each under its question: the opening answer; the product flow drawn as a sequence (animated or tappable for a technology business) with each step opening to its detail; one card per customer group with payer and user; the business model, with a goods-and-money diagram when it has more than one stream; a simple value chain of what the company receives, does and delivers; the four-line snapshot. Segment names and sources behind a disclosure. | 1 |
| 02 Thesis | **Hero**: the thesis in one sentence (the After version from the debate), a short flow from megatrend to the company, thesis strength on Industry, Moat, Economic Capture and Durability (from the scorecard, with confidence, no overall score), the debate's thesis status and confidence. **The thesis in 30 seconds**: four cards, Why now, Why this company, What must be true, What the debate found, at most three sentences each. **Thesis chain**: Megatrend, Industry demand, Bottleneck, Company position, Competitive advantage, Economic capture, Financial outcome, Thesis; one open at a time; the last node holds the investment question and the executive thesis. Then three parts, each a disclosure opening on its question. **Why now**: a vertical causal flow from megatrend to industry demand, the importance rating with its reasons, the value chain map scrolling sideways with the company's stage highlighted and toggles that light the bottleneck stages and the stage where the company captures; structure verdict and bottleneck evidence behind a disclosure. **Why this company**: market share bars, one expandable card per advantage (how hard to copy, how long it lasts; open: why it exists, evidence, what strengthens it, the exchange that attacked it), a durability timeline across 0 to 3, 3 to 7 and 7 to 15+ years, the peer table on the dimensions the thesis uses, current versus future exposure. **Where the value goes**: the value capture map (value created, where it accumulates, who captures it, the company's share and its leaks). | 2, 3, 4 to 11, 16 (status), 17 (four rows) |
| 03 Financials | Do the numbers back the thesis: the value creation chain from revenue through margin and FCF to ROIC, each node marked supports, mixed, contradicts or unknown; revenue and growth, revenue by product or segment, gross and operating margin, net income and EPS, cash flow and FCF, capex and the balance sheet, ROIC, and the quality of revenue and profit; the financial verdict and its deciding figures. Full tables behind a disclosure. | 12 |
| 04 Valuation | What the price assumes: the required growth, margin and conditions as figures, then Bear, Base and Bull cards showing only the assumptions that move the result. Multiples and the reverse DCF behind disclosures. | 13, 14 |
| 05 Debate | The investment committee (Debate UI below): What must be true as a numbered list, each item showing where the debate left it; the exchanges in order, each with its rounds, evidence conflicts and breakers where the debate found them, closing on What did we learn. It closes on the **verdict**: a framed thesis verdict and confidence, at most three reasons, the weakest assumption, and What changed as Before and After. | 15, 16 |
| 06 What to watch | One KPI card per indicator, each naming the breaker or unknown it comes from and its supports-if and breaks-if readings; key events ahead where the analysis names them; What would change our mind. | 16 (change our mind), 18 |
| 07 Evidence | The legend of the four labels, the evidence cards, the full scorecard, Thesis History, what this run stopped short of, limitations and sources. | 17, 19, 20 |

## Debate UI

The debate reads as an investment committee stress-testing a thesis, never as a chat: editorial, typographic, no bubbles, no avatars, no typing rhythm, no dashboard widgets.

- **Two sides, one table.** The Bull speaks in ink from the left, the Bear in petrol from the right (`--cool`, the second side of a pair). Each side is marked by a small label and a rule; alignment and color carry the side, so no extra badge is needed. Oxblood (`--crit`) marks only a breaker the debate found and a point that broke an assumption.
- **The exchange head.** A small "Debate NN" label, the lens when there is one, the core question as a full-width line between two rules, then Under test (the quoted What must be true item) and the status in words. Open, the head stays pinned under the tab bar while its rounds scroll past, so the reader never loses the question.
- **Rounds.** Each round opens with a small indicator, "Round 01 · The challenge". On a wide screen the two sides answer in two columns beneath it; on a phone the turns stack in speaking order, Bull aligned left and Bear indented from the right. Each turn starts with its attack target as a small label ("Challenging: pricing power").
- **Key question** sits between rounds as a full-width separator line between hairlines, so the question that drives the next round reads as the hinge of the exchange.
- **Thesis impact** is a small mark at the end of a round that moved the thesis: ↑ Strengthens, → Neutral, ↓ Weakens, ? Creates uncertainty, in words with the arrow.
- **Evidence, claim first.** A turn shows its claim and a compact source line (source type, date, label); Proves and Does not prove open beneath it on tap, with the evidence card behind its marker. The visible text stays as short as today's.
- **Concession** shows what changed as Before → After in Strengthened, Unchanged, Weakened or Unresolved, never as points; a side's position move (Maintain, Withdraw, Reframe) sits in words beside it.
- **Short first, deep on tap.** Closed, an exchange shows its head, one line per side and its status. Opened, it shows its rounds, key questions, concessions, second-order layers, any conflict or breaker it produced, and What did we learn. One exchange open at a time.
- **What did we learn** closes each open exchange as three short rows, Bull proved, Bear proved, Unresolved.
- **Evidence conflict** sits inside its exchange as two facing cells, A and B, with why they disagree and its status; UNKNOWN when unresolved.
- **Breaker found** sits inside its exchange in oxblood, next to the turn that found it, and links to its card in What to watch.
- **What must be true** links each item to the exchanges that attacked it, and shows where the debate left it: held, weakened, broken, unknown or unchallenged.
- **The verdict** is the one framed box of the tab: thesis verdict in large type, confidence beside it, at most three reasons beneath.

## Rules

- **Same substance.** Every claim, figure, label, verdict and source of the analysis appears on the page; a fact moves to a deeper level, never off the page. Visual levels (a difficulty meter, a horizon bar, a status mark) come from the analysis's own ratings, and the page says so. Where a visual needs a value the analysis lacks, show UNKNOWN in that slot. If the analysis contradicts itself, show both figures and flag the conflict as UNKNOWN.
- **Labels on key claims.** FACT, INFERENCE, ASSUMPTION and UNKNOWN tags go on the claims a conclusion rests on, not on every sentence.
- **Glossed terms.** When the page is in a language other than English, a term left in English (switching cost, ROIC, royalty, Concession) carries a short gloss in the page's language in parentheses the first time it appears in each section and each exchange, since exchanges open one at a time; every English label gets one wherever it appears. Company and product names, evidence-marker names and the four label tags stay unglossed (the legend covers the tags). A gloss says what the term means here in a few words, and comes from the analysis or a plain definition; where the analysis never defines a term, gloss its role on the page.
- **Evidence markers.** A compact bracketed marker named by source type (Company Filing, Industry Data, Management, Research, Media) opens its evidence card in place. Each card states source (linked), date, claim and why it matters to the thesis. Write a card only when the analysis names the claim's source; other claims keep their label tag alone.
- **Mobile first.** The host's sticky tab bar is the navigation: it marks the tab in view and keeps all seven tabs reachable on a phone. Sections stack in one column; the value chain and wide tables scroll sideways inside their own containers; cards expand in place.
- **Black and white.** Ink and greys only, oxblood for what is critical or contradicts the thesis, petrol for the second side of a pair (`thesis-library.md`, The company page).
- **Visuals answer questions.** Each visual answers its tab's question. Prefer causal flows, value chains, timelines, comparisons, scenario cards and evidence cards to paragraphs; keep a paragraph where a visual would only decorate.
- **Interaction teaches.** Tapping a bottleneck toggle lights the bottleneck on the map; tapping a breaker found in the debate opens the KPI that monitors it; tapping an item of What must be true opens the exchange that attacked it; tapping a durability row opens that advantage; tapping an evidence marker opens its card.

## Done when

- The Company tab lets a reader with no finance background say what the company does, how the product works, who pays and how it earns; it holds no margin, multiple or thesis claim.
- The thesis hero and 30-second cards fit roughly the first two phone screens of the Thesis tab.
- Every section of the thesis template is placed per the layout table, every figure of the analysis appears on the page, and no fact is repeated across tabs.
- No tab opens with a wall of text: each opens with its question, its answer, then a visual.
- Every exchange of the debate opens and closes, every breaker reaches its KPI card, and the verdict is visible without opening an exchange.
- Every exchange shows its core question, Under test and status; every round its indicator; every turn its attack target; and the debate tab reads no longer than the debate needs.
- On a page not in English, every English term and label has its gloss per Glossed terms, and the gloss stays secondary to the text it explains.
- At 375px wide the page body has no horizontal scroll.
- Every evidence marker opens a card, every breaker reaches its monitor or says none exists, and the value chain toggles light their stages.
