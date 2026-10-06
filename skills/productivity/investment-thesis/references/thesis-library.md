# Thesis library

Every thesis lives in one artifact, a library with one page per company:

**https://claude.ai/artifact/A1VHjzGjRtJz6JSh4hzNpL**

A run adds a company or updates one already on the shelf, and every other page stays exactly as it was. Read the library with the Artifact tool (`action: "read"`) before writing. When the read says you cannot edit it (you are not its owner), publish a new library in the same shape and give the user its link instead.

## Structure

A multi-file artifact:

- `index.html`: the shelf. It reads `companies/index.json` and shows one entry per company: name, ticker, as-of date, the thesis in a line, the latest decision, and a mark when the as-of date is more than a quarter old (its figures need re-checking). `#<slug>` opens that company's page directly. It renders defensively, so an entry missing a field drops that field instead of failing.
- `companies/<slug>.html`: one full page per company, slug is the lowercase ticker (`snps`). Each is its own document with its own `<!doctype html>`, charset and viewport metas, and a link back to the shelf.
- `companies/index.json`: one entry per company: `slug`, `company`, `ticker`, `as_of`, `thesis`, `decision`.

## The company page

The page carries every section of `templates/thesis-template.md`, written in the user's language and laid out per [`thesis-page.md`](thesis-page.md): five acts with progressive disclosure, not the template's order. Every page shows the as-of date, the notice that it analyses a thesis and is not a recommendation to buy or sell, the legend of the four evidence labels, the Thesis History, and its sources.

Pages share one design. Build a new page from the stylesheet, act structure and scripts of the most recently published company page, replacing the content. A page still in the older plate layout (Roman-numbered plates in template order) moves to the act layout the next time its company is updated, carrying its content unchanged. Before the first page of a new library, or any change to the shared design, call the Skill tool with "artifact-design". Before adding or changing a chart, call the Skill tool with "dataviz".

## A run

1. **Read** the shelf, `companies/index.json`, and the page of this company if it is on the shelf, otherwise the newest page for its design. Match the company against the slugs before minting a new one, so an update lands on the existing page instead of forking a near-duplicate.
2. **Migrate once.** No `companies/index.json` means the library still holds a single company's page at the root. Move that page unchanged to `companies/<slug>.html`, give it a Thesis History with one NEW row dated by its own as-of date (never today), build the shelf and the index, and publish them before this run's page. Carry across only what the page says.
3. **Write** the page. A new company gets a full page with one NEW history row. An update edits the existing page per `thesis-tracker.md` and adds its history row at the top; earlier rows stay as written. A narrow request (one link only) on a company already on the shelf updates only those plates and still adds a history row. A narrow request on a company not on the shelf is answered in chat, with an offer to publish a full page.
4. **Check** locally in a browser: serve the shelf with every company page, open the shelf and every page. Done when the shelf shows one entry per index entry, every entry opens its page, every page links back, no page raises an error, and this company's page meets the done-when list of `thesis-page.md`.
5. **Publish** this company's page, the updated `companies/index.json`, and `index.html` only when the shelf changed. Pass no other company's page: files left out of a publish are kept.

## Chat brief

The page carries the analysis; the chat carries a brief pointing at it, never a reprint. In the user's language, roughly 150 to 250 words, in this order:

1. What changed since this company's last run, read from its Thesis History. On a new company, say so in one line.
2. The thesis in two or three sentences.
3. The unknown that matters most, and what would settle it.
4. What this run stopped short of.
5. The link to the company's page (`<library url>#<slug>`).
