# Thesis library

Every thesis lives in the **Investment Thesis** category of one artifact, Rack to Chip:

**https://claude.ai/artifact/H9siQaJEitHLDuQ3Zsmu8t**

The artifact is built from source in the repository `artitthesun14-ux/chip-artifacts` and published as a small shell (`rack-to-chip/index.html`) plus one file per view (`rack-to-chip/v/<hash>.html`). Never edit the published page by hand: edit the source, rebuild, publish. A run adds a company or updates one already in the category; every other topic and company stays exactly as it was. When the repository is not in the session, add it (read and push access) before starting. When the user cannot edit the artifact, publish the built page as a new artifact and give the user its link instead.

Read `HANDOFF.md` in that repository first: its design system and motion sections are the rules every tab follows. Per-topic notes live in `handoff/`; a thesis run needs none of them.

## Structure

- `build.py`: `GROUPS` lists every topic as a group of tabs, `CATS` the categories on the home page, `THESIS` the thesis companies (exchange, ticker, as-of date, latest decision). The category card shows the as-of date and marks it for re-checking when it is more than a quarter old.
- A company is one group whose id is its slug (the lowercase ticker, `snps`) with eight tabs, one per section of `thesis-page.md`: `<slug>`, `<slug>-now`, `<slug>-company`, `<slug>-debate`, `<slug>-capture`, `<slug>-valuation`, `<slug>-watch`, `<slug>-evidence`. `#<slug>` opens the company directly.
- `thesis/<slug>/01-thesis.html` to `08-evidence.html`: one source file per tab, page fragments with no `<!doctype>`, `<head>` or `<style>`.
- `thesis/thesis.css` and `thesis/thesis.js`: the one stylesheet and the one runtime that every company page shares. The build inlines each once.

## The company page

The page carries every section of `templates/thesis-template.md`, written in the user's language and laid out per [`thesis-page.md`](thesis-page.md). Every page shows the as-of date, the notice that it analyses a thesis and is not a recommendation to buy or sell, the legend of the four evidence labels, the Thesis History, and its sources.

Pages share one design: the host's black-and-white design system. Build a new company from the newest company's eight files, replacing the content, and use only classes that `thesis.css` already defines.

- **Color.** Ink and greys from the host tokens only. `--crit` (oxblood) marks only bottlenecks, breakers the debate found, leaks and what broke an assumption. `--cool` (petrol) marks only the second side of a pair: the Bear against the Bull, the main rival against the company, FCF after SBC against reported FCF. No other color.
- **Each tab** opens with the host header: `header.ds-hd` with the tab's question as `h1`, its one-sentence answer as the lead and the tab number as `ds-num`. Deep research folds into `details.more`.
- **Names.** Every class starts with `th-`, or is a child class written only under a `th-` parent. Every id starts with the slug (`snps-ev-mix`, `snps-br-1`). Pages of other topics define global classes (`.f`, `.u`, `.note`, `.stage`, `.cap`), so a bare short class collides; the build stops and names the class when one does.
- **Links between parts** are buttons: `button.th-ev[data-ev=<card id>]` opens an evidence card, `button.th-go[data-to=<tab or element id>]` jumps to a tab or an element. The viewer app intercepts taps on `<a>`, so keep `<a>` for external sources only.
- **Glosses** (`thesis-page.md`, Glossed terms) are `<span class="th-gl">(gloss)</span>` right after the term; inside a `.th-k` label, put the span inside the label.
- Change `thesis.css` or `thesis.js` only for something every company needs. Before such a change call the Skill tool with "artifact-design"; before adding or changing a chart, with "dataviz".

## A run

1. **Read** `HANDOFF.md`, `THESIS` in `build.py`, and this company's eight files if it is already in the category, otherwise the newest company's files for their structure. Match the company against the slugs before minting a new one, so an update lands on the existing page instead of forking a near-duplicate.
2. **Write** the page. A new company gets eight files, a group in `GROUPS` with its eight tabs, its slug in the `thesis` category of `CATS`, and its `THESIS` entry, plus one NEW history row. An update edits the existing files per `thesis-tracker.md`, adds its history row at the top (earlier rows stay as written), and updates the as-of date and decision in `THESIS`. An update reopens only the exchanges its new evidence touches and rewrites the verdict. A narrow request (one link only) on a company already in the category updates only those parts and still adds a history row. A narrow request on a company not in the category is answered in chat, with an offer to publish a full page.
3. **Build** with `python3 build.py`. A class collision stops it; rename the class and rebuild.
4. **Check** with `node check/check.js` (run `npm install` in `check/` once per session). It opens every view at 390 and 1280 wide, light and dark, and exits 0 when nothing fails. Done when it passes, the home page and the category list every company, every company opens on `#<slug>`, its eight tabs show, no page raises an error, the body has no horizontal scroll, and the page meets the done-when list of `thesis-page.md`.
5. **Publish** per the "Publish" note in `HANDOFF.md`: read the artifact URL (only the shell comes back), list its files (`scope: "files"`), copy `rack-to-chip/` to the scratchpad, and publish `index.html` with `root` set to that copy and `files` naming only the `v/` files this run changed. A new company adds views, so it always sends `index.html` too. Then commit and push the source.

## Chat brief

The page carries the analysis; the chat carries a brief pointing at it, never a reprint. In the user's language, roughly 150 to 250 words, in this order:

1. What changed since this company's last run, read from its Thesis History. On a new company, say so in one line.
2. The thesis in two or three sentences.
3. The unknown that matters most, and what would settle it.
4. What this run stopped short of.
5. The link to the company's page (`<artifact url>#<slug>`).
