# Thesis page

The company page tells the thesis as a story first and lets the reader dig for evidence second. A reader should grasp why the company wins, where the money goes and what breaks it within a minute, then open detail only where they care. The page changes how the analysis is shown, never what it says.

## Levels

Detail is disclosed in four levels. The first phone screens hold only Level 1.

1. **The 30-second thesis**: the hero and four short cards.
2. **The thesis chain**: one line per link, each opening to its detail.
3. **Evidence**: label tags, evidence markers and the cards they open.
4. **Deep research**: full tables, charts, scorecard, history and sources, behind a disclosure or in the Evidence section.

## Layout

Six sections in story order, each one tab of the company's group in the library (`thesis-library.md`). Each act opens with its question as the heading and a one-sentence answer beneath it, so a reader skimming headings alone gets the thesis. Section numbers refer to `templates/thesis-template.md`.

| Nav | Contents | Template sections |
| --- | --- | --- |
| 01 Thesis | **Hero**: ticker, company, price, as-of date, the thesis in one sentence, a short flow from megatrend to the company, thesis strength on Industry, Moat, Economic Capture and Durability (from the scorecard, with confidence, no overall score), the not-a-recommendation notice. **The thesis in 30 seconds**: four cards, Why now, Why this industry, Why this company, What can break it, at most three sentences each. **Thesis chain**: Megatrend, Industry demand, Bottleneck, Company position, Competitive advantage, Economic capture, Financial outcome, Thesis; one open at a time; the last node holds the investment question and the executive thesis. | 1, 2, 17 (four rows) |
| 02 Industry | **Act I, The Setup** (what is happening, why now): a vertical causal flow from megatrend to industry demand, and the importance rating with its reasons. **Act II, The Battlefield** (where the fight is): the value chain as a horizontally scrolling map with the company's stage highlighted and toggles that light up the bottleneck stages and the stage where the company captures; tapping a stage shows its role. Market share as bars. Structure verdict, bottleneck evidence, revenue mix and current versus future business behind a disclosure. | 3, 4, 5, 6, 7 |
| 03 Moat | **Act III, The Moat** (why it wins): the visual hero of the page. One expandable card per advantage showing how hard it is to copy and how long it lasts; open, it shows why it exists, evidence, what strengthens it and what can destroy it (linking the matching breaker). A durability timeline across 0 to 3, 3 to 7 and 7 to 15+ years. A competitive landscape table comparing the company with its direct peers on the dimensions the thesis uses. | 7 (peers), 8, 9 |
| 04 Money | **Act IV, The Money** (where the value goes): a value creation chain from industry growth through demand, position, pricing power, revenue, margin and FCF to ROIC, each node marked supports, mixed, contradicts or unknown, with the capture points and the leaks highlighted. A value capture map: value created, where it accumulates, who captures it, the company's share and its leaks, showing that industry growth is not company profit. Valuation as what the price assumes, then Bear, Base and Bull cards showing only the assumptions that move the result. Full figures, multiples and the reverse DCF behind disclosures. | 10, 11, 15, 16 |
| 05 Risks | **Act V, The Test** (what proves us wrong): thesis and counter-thesis side by side with equal visual weight, then evidence for and against (second-order effects sort into these two columns). Thesis breakers, each with its trigger, current status and what to monitor; opening one highlights its KPI or assumption. What would change my mind. KPI cards. Key assumptions. The final conclusion. | 12, 13, 14, 18, 19, 20 |
| 06 Evidence | The legend of the four labels, the evidence cards, the full scorecard, Thesis History, limitations and sources. | 17, 21 |

## Rules

- **Same substance.** Every claim, figure, label, verdict and source of the analysis appears on the page; a fact moves to a deeper level, never off the page. Visual levels (a difficulty meter, a horizon bar, a status mark) come from the analysis's own ratings, and the page says so. Where a visual needs a value the analysis lacks, show UNKNOWN in that slot. If the analysis contradicts itself, show both figures and flag the conflict as UNKNOWN.
- **Labels on key claims.** FACT, INFERENCE, ASSUMPTION and UNKNOWN tags go on the claims a conclusion rests on, not on every sentence.
- **Evidence markers.** A compact bracketed marker named by source type (Company Filing, Industry Data, Management, Research, Media) opens its evidence card in place. Each card states source (linked), date, claim and why it matters to the thesis. Write a card only when the analysis names the claim's source; other claims keep their label tag alone.
- **Mobile first.** The host's sticky tab bar is the navigation: it marks the act in view and fits all six tabs in one row on a phone. The acts stack in one column; the value chain and wide tables scroll sideways inside their own containers; cards expand in place.
- **Black and white.** Ink and greys only, oxblood for what is critical or contradicts the thesis, petrol for the second side of a pair (`thesis-library.md`, The company page).
- **Visuals answer questions.** Each visual answers its act's question. Prefer causal flows, value chains, timelines, comparisons, scenario cards and evidence cards to paragraphs; keep a paragraph where a visual would only decorate.
- **Interaction teaches.** Tapping a bottleneck toggle lights the bottleneck on the map; tapping a breaker highlights the KPI that monitors it; tapping a durability row opens that advantage; tapping an evidence marker opens its card.

## Done when

- Hero and 30-second cards fit roughly the first two phone screens.
- Every section of the thesis template is placed per the layout table, and every figure of the analysis appears on the page.
- No act opens with a wall of text: each opens with its question, its answer, then a visual.
- At 375px wide the page body has no horizontal scroll.
- Every evidence marker opens a card, every breaker highlights its monitor or says none exists, and the value chain toggles light their stages.
