# Film and fashion color-palette principles for the Outfit Color Matcher's "idea" generator

Research question: what established color-rule principles (in film/production-design color grading and
in fashion/personal styling) produce the kind of palette shown in "movie color palette" breakdown cards,
a small set of muted, tonally related colors plus exactly one clearly more saturated accent, and how
could `generateIdeaBatch()` / `ideaColor()` in `outfit-color-matcher/app.html` be changed to move toward
that pattern instead of independently randomizing hue/saturation/lightness per role.

This file follows the citation convention of the existing
`research/color-matching-for-outfit-website.md` in this repo (inline citations, an explicit honesty
section, primary vs secondary sources flagged). See "0. Where this file lives and why" below for why it
sits here rather than under `outfit-color-matcher/docs/`.

---

## 0. Where this file lives and why, and a network-access caveat that shapes everything below

`outfit-color-matcher/docs/` only holds specs written from the app's own point of view
(`spec-/ux-/ui-outfit-color-matcher.md`), all in Thai, all describing what the app should do. This file
is a standalone literature review that does not belong to that pattern: it is general color-theory and
film/fashion research, not a spec for a feature. The repo already has exactly this kind of document at
`research/color-matching-for-outfit-website.md`, written in English with inline citations for the same
app. I put this file next to it and matched its language and citation style, per the instruction to
prefer a clearer existing repo-wide convention over inventing a new one under `outfit-color-matcher/docs/`.

**Network-access caveat, read before trusting any citation below:** in this session every `WebFetch` call
failed with `EGRESS_BLOCKED`, including on domains that are normally open (`en.wikipedia.org`,
`www.w3.org`, `example.com`). Unlike the prior research file in this repo, which fetched most of its
primary sources directly and flagged only a few as search-only, **none** of the sources below were read
directly; all of them come from `WebSearch`'s synthesized result summaries and snippets. That is a real,
material limitation: a search summary can mangle a quote, miss context, or paraphrase loosely. Section 8
("Honesty and verification") repeats this per-claim; treat every citation here as "search-corroborated,
not independently read in full" unless stated otherwise.

---

## 1. The current code, read directly from `app.html` (this part is fully verified, not search-based)

`outfit-color-matcher/app.html`, function `generateIdeaBatch()` (around line 1265) and `ideaColor()`
(line 1264), with the constants `IDEA_RULES`, `IDEA_S_RANGE`, `IDEA_L_RANGE`, `OCCASION_TONE` (lines
789-826):

- `IDEA_RULES = ["analogous","complementary","triadic","monochrome","neutral-accent"]`, one is picked at
  random per candidate outfit.
- `IDEA_S_RANGE = [35, 75]`, `IDEA_L_RANGE = [30, 70]`: the app's own stated saturation/lightness band for
  idea-mode colors, used to compute an occasion-shifted midpoint (`sMid`, `lMid`).
- **Primary**: hue `hP = Math.random()*360` (fully independent of the rule), saturation and lightness
  drawn from a window around `sMid`/`lMid` (roughly S in [20,88], L in [20,78] after occasion shift and
  clamping).
- **Secondary**: hue is derived from the rule (same as primary for monochrome/neutral-accent, ±20-40° for
  analogous, +180° for complementary, ±120-127° for triadic), but its own saturation and lightness are
  again independently randomized in a wide band (roughly S 12-82, L 16-86 depending on rule).
- **Neutral**: hue tied to primary, but saturation forced low (5-15) and lightness pushed to an extreme
  (either ~88-96 or ~12-26), so this role alone reliably produces a true muted color.
- **Accent**: hue offset from primary by rule-specific or random amount, saturation drawn from roughly
  45-92 (its own, wider and higher formula: `62 + Math.random()*22 + tone.s*20`), lightness 28-66, and it
  is only *sometimes* included (`wantAccent = Math.random() < 0.55 + tone.accentBoost`).

The spec (`outfit-color-matcher/docs/spec-outfit-color-matcher.md`, section 4.7, "Color Role") already
states the intended hierarchy in words: Primary ~60%, Secondary ~30%, Neutral flexible, Accent ~10% and
"at most 1", explicitly modeled on 60-30-10 ("map เข้า 60-30-10"). Section 4.2 defines the five harmony
rules as hue-angle bands. Section 9 lists `IDEA_S_RANGE`/`IDEA_L_RANGE` under "assumptions to tune from
real results" ("ปรับได้จากผลจริง"), i.e. the spec's authors already expected these two ranges might need
revision. **The gap is between the spec's stated intent (one muted base family + one accent, by role) and
the code's actual behavior (every role except Neutral independently rolls its own saturation/lightness in
a wide, overlapping band, so Primary or Secondary can land as saturated as, or more saturated than, the
Accent, and the Accent is not guaranteed to appear at all).** That gap is the concrete target the sourced
findings below speak to.

---

## 2. Foundational color-theory texts behind "tonal base + one accent"

### Johannes Itten, *The Art of Color* (Itten taught this at the Bauhaus color course; the book is the
standard English edition of that teaching)

Itten's color sphere places the full, saturated hues around the equator and shows every hue mixed toward
white (tints) in one direction and toward black (shades) in the other, so that "any color can be combined
with black, white, gray, or other chromatic colors" along a single hue's own vertical axis. Flattened,
this becomes his "Color Star," used to study contrasts of hue, of light/dark, and of saturation as
separate, combinable devices rather than one knob.
Full text (search-corroborated, not directly read this session):
https://archive.org/stream/johannes-ittens-the-art-of-color/Johannes%20Ittens%20%E2%80%93%20THE%20ART%20OF%20COLOR_djvu.txt
Bauhaus teaching context, Getty Research Institute (museum/research primary source):
https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/

**Why this matters for the app:** the two greens in the Darjeeling Limited reference image and the two
tan/khaki swatches in the Royal Tenenbaums image are exactly Itten's tint/shade device: one hue family,
varied along the white-black (lightness) axis, not two independently chosen hues. This is precisely what
the app's current `monochrome` rule branch already does for Secondary (`ideaColor(hP, clamp(sP-14,...),
clamp(lP + dir*22,...))`, same hue, shifted lightness), but the other four rules (analogous, complementary,
triadic, neutral-accent) do not apply this device to Secondary or Neutral at all: they give Secondary a
genuinely different, independently-saturated hue instead of a tonal variant.

### Josef Albers, *Interaction of Color* (Yale University Press, 1963; the standard teaching text on
color relativity, still in print via Yale Books)

Albers's central, repeatedly stated point is that color is never seen in isolation: "In visual perception
a color is almost never seen as it really is, as it physically is. This fact makes color the most
relative medium in art." He built exercises specifically around varying the *quantity* and *proportion*
of each color in a composition while holding the set of colors fixed, noting that most theoretical color
harmony diagrams are unrealistic because they show every color "in the same quantity and the same shape."
Search-corroborated (not directly read this session):
https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/
https://medium.com/@straubkira/interaction-of-color-the-importance-of-joseph-albers-to-color-theory-575b6d3fad10
https://www.bagtazocollection.com/blog/2015/11/5/design-study-josef-albers-color-relativity

**Why this matters for the app:** Albers's point is exactly why a "clear accent hierarchy" cannot be
produced by color choice alone; it also needs an area/quantity relationship. A palette where Primary,
Secondary, and Accent are all rolled from similar saturation ranges (as the current code allows) removes
the one lever, quantity plus intensity acting together, that lets a single small vivid color read as
"the accent" instead of just one more saturated color among several.

### The Munsell color system (Albert Munsell, early 20th century; maintained today by the Munsell Color
company / X-Rite)

Munsell treats a color as three independent, separately measurable dimensions: **hue**, **value**
(lightness), and **chroma** (saturation/purity), arranged as a three-dimensional solid rather than a flat
wheel. This hue/value/chroma decomposition is the direct conceptual ancestor of treating "how saturated"
and "how light" as separate dials from "which hue," which is what the app's HSL-based code already does
mechanically, but without Munsell's disciplined use of value and chroma for area balance (next
paragraph).
First-party source: https://munsell.com/about-munsell-color/how-color-notation-works/
Encyclopedic corroboration: https://www.britannica.com/science/Munsell-color-system

**A specific, more advanced Munsell-tradition rule directly on point:** a documented rule for balancing
two colors of different value and chroma states that **the area occupied by each color should be inverse
to the product of its value and chroma**, so a small, high-chroma, high-contrast color is meant to occupy
a *small* area against a large area of a lower-chroma, more neutral color, and this is stated to be the
rule "used for measuring chroma... colors of complementary or opposite hue balance to gray in areas that
are in inverse proportion to the products of their values and chromas." This tradition traces to Denman
W. Ross's *A Theory of Pure Design: Harmony, Balance, Rhythm* (Houghton Mifflin, 1907), a design-education
text contemporary with, and independently parallel to, Munsell's own system (the two men were
acquaintances and rivals in early-20th-century American color pedagogy). Search-corroborated, not
directly read this session:
https://munsell.com/color-blog/a-grammar-of-color-balancing/
https://munsell.com/color-blog/grammar-of-color-munsell-intro-balance-color/
https://archive.org/details/theoryofpuredesi00rossuoft
A 2025 peer-reviewed fashion/textile paper explicitly reuses this exact rule for clothing (cited in full
in section 5 below):
https://link.springer.com/article/10.1186/s40691-025-00433-y

**Why this matters for the app:** this is the clearest, most formal, most directly "sourced-not-inferred"
justification for an inverse relationship between a color's saturation and the share of the outfit it
should occupy, which is exactly the shape of the app's own category weights (`CATEGORY_WEIGHT`: top+bottom
60, outer 30, shoes+accessory 10) crossed with color role. The rule argues the *accent's* highest allowed
saturation should be reserved for the *smallest*-area category (already accessory/shoes in the app's own
weighting), and that Primary and Secondary, which cover the large 60+30 area, should be pulled toward
lower chroma than the accent gets, not drawn from an overlapping range as `IDEA_S_RANGE` currently does.

---

## 3. The 60-30-10 rule: what could and could not be verified

**What is solid:** 60-30-10 (dominant color roughly 60% of a scheme's area, a secondary color roughly
30%, an accent roughly 10%) is documented consistently, across independent domains, as a proportion rule
for visual composition:

- **Interior design**, where it is most commonly cited: dominant color covers the largest surfaces (walls,
  large furniture), secondary supports it (upholstery, mid-size pieces), accent is "strictly decorative,"
  small, and used to draw the eye. https://www.apartmenttherapy.com/interior-design-rule-60-30-10-explained-37504313
  https://www.almadeluce.com/blog/the-guide-to-use-the-60-30-10-rule-in-interior-design/
- **Graphic design**, under different vocabulary but the identical structure: Aaris Sherin, *Design
  Elements, Color Fundamentals: A Graphic Style Manual for Understanding How Color Affects Design*
  (Rockport, 2011), teaches choosing "a dominant tone," then "one or more subordinate colors," then "an
  accent that can be used sparingly... and will create a harmonious combination with the dominant and
  subordinate tones." This is a genuine design-education textbook (published by Rockport, part of the
  Quarto Group's professional design-book line), independently arriving at the same
  dominant/subordinate/accent hierarchy, though the search summaries available did not confirm it uses
  the literal "60-30-10" percentages. https://www.amazon.com/Design-Elements-Color-Fundamentals-Understanding/dp/1592537197
- **Fashion/personal styling**, as an explicit adaptation of the same rule: dominant color covers the
  largest garment (trousers, dress, main jacket), secondary a supporting garment (blazer, skirt,
  cardigan), accent reserved for small accessories (shoes, bag, jewelry, scarf).
  https://insideoutstyleblog.com/2019/03/using-the-60-30-10-rule-to-create-fabulous-colour-combinations-in-your-outfits.html
  (Imogen Lamport, a working image consultant, "Inside Out Style") and
  https://lookiero.co.uk/blog/3-colour-rule-fashion (Lookiero, a commercial personal-styling service).

**What could not be verified, and is flagged honestly rather than papered over:** no source found in this
session traces 60-30-10 to a single named textbook, author, or invention date. Every source that mentions
its history says only that it "originates in color theory" or is "one of the oldest rules... like an old
wives' tale," without a citable first appearance. Treat 60-30-10 the way the rest of this document treats
seasonal color analysis in the prior research file: as a well-attested, cross-domain **convention**, not
a rule with a single canonical primary source. What is verifiable and load-bearing is the *pattern itself*
(three roles, decreasing area, increasing visual intensity as area shrinks), independently corroborated
by the Munsell/Ross area-balance rule in section 2, which does have a citable origin.

**Capsule wardrobe research (fashion-specific proportion, independent of the 60-30-10 label):**
multiple styling sources converge on a total working palette of roughly 6-9 colors per wardrobe, split as
3-4 neutrals, 2-3 "hero" colors, and 1-2 accents/"pops," with the explicit advice to "pull the boldest or
most saturated shades... for a pop" rather than build a whole garment from them, and to let "a single
accent do the talking." https://thelaurieloo.com/capsule-wardrobe-color-palette/
https://ruesophie.com/blogs/the-style-edit/capsule-wardrobe-color-palette
This is a *per-wardrobe* ratio (how many colors total, across many garments), not a *per-outfit* ratio
like 60-30-10, but the shape, few muted workhorses plus very few saturated accents, is the same, and it
independently supports capping the app's per-outfit accent count at exactly one or zero, never more.

---

## 4. Cinematographic and production-design primary-source evidence (the Wes Anderson case)

The user's reference images are both Wes Anderson films, so this section focuses there, while noting the
pattern is described as general film-color practice, not Anderson-specific.

**Direct, attributed quote from production designer Adam Stockhausen about deliberately controlling
saturation, not just hue, on *The Grand Budapest Hotel*:** "The funny thing is, we started with all this
pink, and I think this would be true of any color, if you use too much of it, you stop seeing it because
it's everywhere and you start taking it for granted. So, we found that we had to add in yellows and
different colors to kind of cut it back so you could see it more." Search-corroborated, from an interview
aggregation; original interview context not independently re-read this session:
https://www.backstage.com/magazine/article/wes-andersons-production-designer-adam-stockhausen-interview-74172/

**Wes Anderson's own account of using a *different saturation level as the organizing device* per era of
*The Grand Budapest Hotel*, not a single fixed saturation band for the whole film:** for the 1930s
sequences, "a less saturated look with light pinks and deep reds and purples"; for the 1960s, "a warmer,
golden feel with rich yellows, golds and greens"; for the present-day (1980s) frame story, "a more neutral
palette." Search-corroborated, via reporting on the film's post-production color work; original interview
not independently re-read this session: https://postperspective.com/enhancing-color-grand-budapest-hotel/
(colorist Jill Bogdanowicz's collaboration with Anderson on the DI is described in the same piece).

**Workflow evidence that base (production-design/set) color and accent (costume) color are tested
*together*, as a matched pair, rather than generated independently:** reporting on cinematographer Robert
Yeoman's collaboration with Anderson describes a standard prep step where "the costume designer brings
swatches of cloth and the production designer paints walls in various colors, then they film the fabrics
in front of those walls" so the combination can be judged on camera before shooting. Search-corroborated,
not independently re-read this session:
https://www.focusfeatures.com/article/interview_dp_robert-yeoman-asteroid-city
https://britishcinematographer.co.uk/robert-yeoman-asc-asteroid-city/

**General film-color-theory secondary sources**, useful for corroborating the "one dominant, one
supporting, one accent" pattern as a named convention in cinematography teaching, not just interior
design: "In general when creating an analogous color scheme, one color is chosen to dominate, a second to
support, and a third (along with blacks, whites and grey tones) to accent," and lower saturation overall
is explicitly linked to a "muted, moody, gritty" read while higher saturation reads as "vibrant/exciting."
These are educational film-blog sources (StudioBinder, Boords, Wolfcrow), not primary interviews, and are
flagged as secondary: https://www.studiobinder.com/blog/how-to-use-color-in-film-50-examples-of-movie-color-palettes/
https://boords.com/blog/color-theory-in-film
https://wolfcrow.com/cinematic-color-palettes-a-complete-guide-for-beginners/

**On the reference-image format itself** (a film still paired with an extracted 4-5 swatch strip): this
exact card format is a known, named project, "Cinema Palettes" by UK designer Gaby Smith, described as
extracting "a still frame from a film" plus "a swatch of the colors used in that scene" from memorable
shots, explicitly pitched as a reference for choosing "props, wardrobe, and lighting." Related sites doing
the same thing include Movies In Color and Movie Palette. Search-corroborated:
https://fstoppers.com/education/cinema-palettes-helps-you-recreate-colors-your-favorite-films-130407
https://moviesincolor.com/
This matters methodologically: these cards are **curated** (a person or algorithm picks the frame's most
visually representative colors, weighted toward what actually reads as dominant on screen), not a uniform
random sample of every pixel's hue. A curated extraction from a well-graded, well-art-directed frame will
almost mechanically show large areas of a graded, desaturated production-design palette plus one small,
deliberately chosen saturated prop/costume color, because that is how the frame was lit and dressed in
the first place. The pattern the user is reacting to is downstream of the *production and grading*
choices in sections above; the palette-card format is just a faithful readout of them.

---

## 5. Fashion-specific color theory sources (clothing, not film frames)

**Academic textbook coverage:** Janet Best (ed.), *Colour Design: Theories and Applications* (Woodhead
Publishing / Elsevier, part of The Textile Institute book series; 1st ed. 2012, 2nd ed. 2017), includes a
dedicated chapter on colour in fashion within its applied-design section, alongside interiors, art, and
other domains. This is a genuine, peer-reviewed-adjacent textile/design textbook, not a styling blog.
Search-corroborated, chapter contents not independently read this session:
https://www.amazon.com/Colour-Design-Theories-Applications-Institute/dp/1845699726
https://www.perlego.com/book/1898300/colour-design-theories-and-applications-pdf

**Peer-reviewed application of the Munsell area-balance rule specifically to clothing color matching:** a
2025 paper in *Fashion and Textiles* (Springer Nature, open-access journal), "Establishing colour harmony
evaluation and recommendation model for clothing colour matching based on machine learning and deep
learning," states as a working rule that "the area ratio between the upper and lower garments is
inversely proportional to the product of their lightness and chroma," i.e. a small, bright/saturated
garment area should be balanced by a larger, more muted one, directly citing the Munsell-tradition balance
concept from section 2 and Moon & Spencer's and Judd & Wyszecki's color-harmony theories (systematic hue
variation producing "pleasant coordination," and "positive emotional response from adjacent or multiple
colours," respectively) as its theoretical basis. This is the strongest single citation this research
found connecting formal color-harmony theory directly to garment-level color proportion, though it is a
2025 paper and the full text could not be fetched this session, only WebSearch's summary of it, so treat
its exact wording and citation chain as unverified pending a direct read.
https://link.springer.com/article/10.1186/s40691-025-00433-y

**Practitioner/industry color-image methodology:** Shigenobu Kobayashi, founder of Japan's Nippon Color &
Design Research Institute, published *Color Image Scale* (Kodansha International, 1991), matching several
thousand color *combinations* (not single colors) to mood/image words, used industrially by Japanese
designers and manufacturers. This is relevant as an existence proof that professional color-matching
practice works at the level of *combinations with a role structure*, not single independently-chosen
hues, but this session's searches did not surface a specific Kobayashi statement about accent-color area
or saturation ratios, so it is cited for context, not as a direct source for the numeric findings below.
https://www.amazon.com/Color-Image-Scale-Shigenobu-Kobayashi/dp/477001564X

**What this research explicitly could not find, honestly flagged:** a clean, citable "costume-looking vs
wearable" saturation threshold from a costume-design textbook. *The Costume Designer's Handbook* by
Rosemary Ingham and Liz Covey (a standard theater costume-design textbook, Waveland Press) was identified
as a plausible source and is known to cover color theory for stage costume, but this session's WebSearch
did not return a specific quoted saturation rule from it, and it could not be fetched or read. Do not cite
this book's content beyond "it exists and covers color for costume"; treat the "costume-looking = too
saturated" intuition in the user's complaint as well supported by the *general* muted-dominant-plus-accent
pattern documented everywhere else in this file, but not as independently confirmed by a costume-specific
numeric rule.

---

## 6. Synthesis: concrete, parametric findings mapped to `ideaColor()` / `generateIdeaBatch()`

Each finding below is labeled **[hard, sourced]** when multiple independent domains converge on it with a
citable source, or **[inference]** when it is this document's own reasoning connecting sourced material to
the app's specific HSL-range constants; no finding below is presented as more certain than that label.

1. **[hard, sourced]** A real, wearable-reading palette has exactly one clearly more saturated element
   ("accent"), never zero and never more than one. This is the one claim independently supported by every
   domain researched: 60-30-10 in interior design, fashion, and graphic design (section 3); capsule
   wardrobe research's "let a single accent do the talking" (section 3); Albers's point that harmony
   depends on unequal proportion, not just hue choice (section 2); and the Munsell/Ross area-balance rule,
   which mathematically only works if one color is small/saturated and its counterpart(s) are large/muted
   (section 2). **Mapped to the code:** `wantAccent`'s probabilistic gate (`Math.random() < 0.55 +
   tone.accentBoost`, so as low as ~35% for `work` occasion) means a large share of generated outfits have
   *no* accent at all, and nothing in the code prevents Primary or Secondary from independently rolling
   into the accent's own saturation range (see finding 3), which can produce zero, one, two, or three
   simultaneously-saturated colors with no distinguishable accent. A hierarchy that is supposed to be
   "at most 1" (spec 4.7) is not currently enforced as "reliably exactly 1" for the cases sourced material
   treats as the actual wearable pattern.

2. **[hard, sourced]** The base/dominant colors in a real palette are usually **tonal variants of one or
   two hue families** (Itten's shade/tint device, section 2), not independently chosen, unrelated hues.
   Both reference images show this directly: two greens (a hue family) plus two grays (a second hue
   family) in Darjeeling Limited; two tans (one hue family) plus one gray in Royal Tenenbaums. **Mapped to
   the code:** only the `monochrome` rule branch currently does this for Secondary (same hue as Primary,
   shifted lightness/saturation). The other four rules (`analogous`, `complementary`, `triadic`,
   `neutral-accent`) give Secondary a hue that is rule-shifted from Primary but then randomizes Secondary's
   *own* saturation and lightness independently of Primary's, rather than treating Secondary as a
   lightness/saturation variant *of the same rule-derived hue*. Neutral already does the "tonal
   variant" thing correctly (same hue as Primary, forced low S, extreme L).

3. **[inference, built on hard sourced material]** Primary and Secondary should be constrained toward the
   **muted** end of the app's own existing saturation vocabulary, and Accent should own the **vivid** end,
   with little or no overlap. The app already defines this vocabulary: `NEUTRAL_MAX_S = 20` (below this is
   "neutral") and `VIVID_MIN_S = 55` (above this is "vivid enough to be an accent"), spec section 4.1. But
   `IDEA_S_RANGE = [35, 75]` is applied as the base range for *all* non-neutral roles, so Primary and
   Secondary can each independently land anywhere from 20 up to 88 (after occasion shift and the ±9
   jitter), which is **above the app's own `VIVID_MIN_S = 55` threshold** for a large part of that range.
   That is the numeric root of "individually too saturated to read as real, wearable colors": the code's
   own accent-detection threshold says 55+ saturation should read as an accent-grade color, yet Primary
   and Secondary are allowed to roll well past it. No source found gives a universal numeric saturation
   cutoff for "wearable" (this part is genuinely inference, not a hard citation), but combining the
   Munsell/Ross area-balance logic (large-area colors should have the *lower* value-times-chroma product)
   with the app's own existing `NEUTRAL_MAX_S`/`VIVID_MIN_S` split suggests Primary/Secondary should sit
   mostly in a band clearly below `VIVID_MIN_S` (e.g. bounded well under 55, closer to the current
   Neutral-adjacent end), while Accent keeps or widens its own higher band, rather than all four roles
   drawing from `IDEA_S_RANGE`'s shared 35-75 window.

4. **[hard, sourced]** The accent should occupy the **smallest visual area**, and by the Munsell/Ross
   balance rule (section 2) and the fashion-specific 2025 paper reusing it (section 5), the smaller the
   area, the more saturation/contrast it can carry without looking wrong, an inverse relationship, not an
   independent one. **Mapped to the code:** this is already partly honored structurally, since the app's
   own `CATEGORY_WEIGHT` gives accessory only 3 (of 100) and the idea-mode accent is assigned to the
   `accessory` category (line ~1305). The gap is only that Accent's saturation/lightness formula is
   already appropriately wide and high (S 45-92, its own dedicated formula, unlike the other three roles),
   so this role's numbers do not need much change; the fix belongs in Primary/Secondary/Neutral, as in
   finding 3, to create the *contrast* the accent needs in order to read as an accent at all.

5. **[hard, sourced]** Occasion-driven saturation shifts (the existing `OCCASION_TONE` table) are
   directionally consistent with sourced material: Wes Anderson's own account of deliberately using a
   *less* saturated palette for a more formal/period-establishment setting (1930s Grand Budapest) versus a
   *warmer, more saturated* one for a different mood (1960s), section 4, supports the app's existing
   `work: {s:-.18, l:-.12, accentBoost:-.20}` versus `party: {s:.22, l:0, accentBoost:.30}` design. This
   part of the system does not need to change; it is the per-role independence of the base saturation
   roll (finding 3) and the non-mandatory accent (finding 1) that sourced material argues against, not the
   occasion mechanism itself.

**Options this could motivate (observations, not a code diff, left for a human to decide):**

- Make Secondary's saturation/lightness a *derived tonal variant* of Primary's rolled values (shifted by a
  smaller, rule-appropriate delta) for all five rules, the way `monochrome` already does, instead of an
  independent second `Math.random()` roll, so the "two tonal grays / two tonal greens" pattern from the
  reference images becomes the default outcome, not one rule-branch's special case.
- Lower and/or narrow `IDEA_S_RANGE` specifically for Primary/Secondary/Neutral (keeping it clearly under
  `VIVID_MIN_S`), while leaving Accent's own separate, already-wider saturation formula alone, or widening
  it further, so the two ends of the palette stop overlapping.
- Reconsider `wantAccent`'s probability: sourced material treats "exactly one accent" as close to a hard
  rule of a wearable/intentional-looking palette, not a coin flip, so a human may want this closer to
  "almost always include one" with the *occasion* controlling the accent's saturation/prominence (as
  `accentBoost` already does) rather than controlling whether it exists at all.
- If Secondary or Primary is allowed to roll above `VIVID_MIN_S` under some rule (e.g. `complementary`,
  where two genuinely different, both-vivid hues might be an intentional look for some occasions like
  `party`), that could be scoped explicitly to specific rules/occasions rather than being the default
  behavior of `IDEA_S_RANGE` for all five rules and all occasions.

None of the above is applied to the code in this task; per the task's scope this is research only.

---

## 7. Summary table of sources by strength

| Claim | Strength | Primary citation |
|---|---|---|
| Tonal (shade/tint) variation within one hue = classic harmony device | Hard, canonical text | Itten, *The Art of Color* |
| Harmony depends on proportion/quantity, not hue alone | Hard, canonical text | Albers, *Interaction of Color* |
| Hue/value/chroma as separable dimensions | Hard, canonical system | Munsell Color company |
| Small saturated area should balance a large muted area (area inverse to value x chroma) | Hard, named rule with historical origin | Munsell/Denman Ross "balance of color"; reapplied to clothing in Fashion and Textiles (2025) |
| 60% dominant / 30% secondary / 10% accent, by name, in interiors, graphic design, and fashion styling | Well-attested convention, no single citable inventor | Multiple independent domain sources, section 3 |
| Capsule wardrobe: few neutrals + very few accents, saturated colors reserved for "pops" | Well-attested styling convention | Section 3 practitioner sources |
| Wes Anderson deliberately varies saturation level per era/mood, and tempers an over-used hue with others | Direct attributed quotes (search-corroborated, not independently re-read) | Stockhausen and Anderson interviews, section 4 |
| Costume/set colors tested together as swatches before shooting | Reported workflow (search-corroborated) | Yeoman interviews, section 4 |
| "Costume-looking vs wearable" numeric saturation threshold | Not found; explicitly unverified | None found this session |
| Origin/inventor of "60-30-10" itself | Not found; explicitly unverified | None found this session |

---

## 8. Honesty and verification note (what was and was not actually checked)

- **No source in this file was read in full this session.** Every `WebFetch` attempt failed with
  `EGRESS_BLOCKED`, on both obscure and universally-reachable domains (confirmed by testing
  `en.wikipedia.org`, `www.w3.org`, and `example.com`, all blocked identically). Every citation above
  comes from `WebSearch`'s own synthesized summary of search results, which quotes short snippets but is
  not equivalent to reading the source. Treat quoted material (e.g. the Stockhausen and Albers quotes) as
  "very likely accurate, reported by a search summary of a real page," not as independently verified
  against the original text.
- **The 60-30-10 rule's origin could not be established.** Multiple secondary sources repeat it as an old,
  unattributed design convention. This file does not claim a false origin; it documents the rule's
  independently-attested *applications* instead (interior design, graphic design's dominant/subordinate/
  accent language, fashion styling), which is the load-bearing part for this task regardless of who first
  wrote it down.
- **The 2025 *Fashion and Textiles* paper (Springer) and Janet Best's *Colour Design* textbook** are cited
  based on search-result summaries of their abstracts/table of contents only; their full methodology,
  sample sizes, and exact wording were not verified and should be treated as "a real, findable source that
  says approximately this," not as a verbatim quotation.
- **Wes Anderson/production-design material** relies on secondary reporting (Backstage, postPerspective,
  Focus Features, British Cinematographer) quoting or paraphrasing Stockhausen, Anderson, and Yeoman; no
  American Cinematographer magazine article specifically about Anderson's color methodology was found
  despite searching, only ASC articles about his cinematographers' general working relationship with him.
- **The Costume Designer's Handbook (Ingham & Covey)** and Kobayashi's *Color Image Scale* are cited only
  as "this book exists and plausibly covers this," explicitly flagged as not yielding a specific quotable
  rule in this session's searches; do not use them as a source for any numeric claim in section 6.
- Everything in section 1 (the reading of `app.html` and the spec) was read directly with the `Read` tool
  in this session and is fully verified, not search-based.

---

## Sources

Canonical texts and first-party systems:
- Johannes Itten, *The Art of Color* [full text via archive.org, search-corroborated]:
  https://archive.org/stream/johannes-ittens-the-art-of-color/Johannes%20Ittens%20%E2%80%93%20THE%20ART%20OF%20COLOR_djvu.txt
- Getty Research Institute, Bauhaus color teaching (Itten): https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/
- Josef Albers, *Interaction of Color*, Yale University Press: https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/
- Munsell Color company, hue/value/chroma notation: https://munsell.com/about-munsell-color/how-color-notation-works/
- Munsell Color company, "balance of color" area-ratio rule: https://munsell.com/color-blog/a-grammar-of-color-balancing/ , https://munsell.com/color-blog/grammar-of-color-munsell-intro-balance-color/
- Denman W. Ross, *A Theory of Pure Design: Harmony, Balance, Rhythm* (1907), full text: https://archive.org/details/theoryofpuredesi00rossuoft
- Britannica, Munsell color system (encyclopedic corroboration): https://www.britannica.com/science/Munsell-color-system

60-30-10 and dominant/subordinate/accent proportion:
- Apartment Therapy, "How Design Pros Use the 60-30-10 Rule": https://www.apartmenttherapy.com/interior-design-rule-60-30-10-explained-37504313
- ALMA de LUCE, 60-30-10 in interior design: https://www.almadeluce.com/blog/the-guide-to-use-the-60-30-10-rule-in-interior-design/
- Aaris Sherin, *Design Elements, Color Fundamentals* (Rockport): https://www.amazon.com/Design-Elements-Color-Fundamentals-Understanding/dp/1592537197
- Imogen Lamport ("Inside Out Style"), 60-30-10 for outfits: https://insideoutstyleblog.com/2019/03/using-the-60-30-10-rule-to-create-fabulous-colour-combinations-in-your-outfits.html
- Lookiero, "Three-colour rule: master the 60-30-10": https://lookiero.co.uk/blog/3-colour-rule-fashion
- Capsule wardrobe color ratios: https://thelaurieloo.com/capsule-wardrobe-color-palette/ , https://ruesophie.com/blogs/the-style-edit/capsule-wardrobe-color-palette

Film and production design:
- Backstage, Adam Stockhausen interview (Grand Budapest Hotel pink/yellow quote): https://www.backstage.com/magazine/article/wes-andersons-production-designer-adam-stockhausen-interview-74172/
- postPerspective, "Enhancing color at The Grand Budapest Hotel" (Anderson's per-era palette, colorist Jill Bogdanowicz): https://postperspective.com/enhancing-color-grand-budapest-hotel/
- Focus Features, Robert Yeoman interview (Asteroid City): https://www.focusfeatures.com/article/interview_dp_robert-yeoman-asteroid-city
- British Cinematographer, Robert Yeoman ASC (Asteroid City): https://britishcinematographer.co.uk/robert-yeoman-asc-asteroid-city/
- Paste Magazine, Adam Stockhausen interview (The French Dispatch): https://www.pastemagazine.com/movies/wes-anderson/the-french-dispatch-adam-stockhausen-interview
- Deadline, Adam Stockhausen interview (Grand Budapest Hotel): https://deadline.com/2015/02/grand-budapest-hotel-adam-stockhausen-wes-anderson-oscar-nominated-production-design-1201371523/
- StudioBinder, "How to Use Color in Film" (secondary, educational): https://www.studiobinder.com/blog/how-to-use-color-in-film-50-examples-of-movie-color-palettes/
- Boords, "How to Use Color Theory in Film" (secondary, educational): https://boords.com/blog/color-theory-in-film
- Wolfcrow, "Cinematic Color Palettes" (secondary, educational): https://wolfcrow.com/cinematic-color-palettes-a-complete-guide-for-beginners/
- Cinema Palettes project (Gaby Smith), the film-still-plus-swatch card format itself: https://fstoppers.com/education/cinema-palettes-helps-you-recreate-colors-your-favorite-films-130407 , https://moviesincolor.com/

Fashion-specific color theory:
- Janet Best (ed.), *Colour Design: Theories and Applications*, Woodhead Publishing/Elsevier: https://www.amazon.com/Colour-Design-Theories-Applications-Institute/dp/1845699726
- *Fashion and Textiles* (Springer Nature, 2025), clothing colour-harmony model reusing the Munsell area-balance rule: https://link.springer.com/article/10.1186/s40691-025-00433-y
- Shigenobu Kobayashi, *Color Image Scale*, Kodansha International (1991): https://www.amazon.com/Color-Image-Scale-Shigenobu-Kobayashi/dp/477001564X
- Rosemary Ingham and Liz Covey, *The Costume Designer's Handbook*, Waveland Press (existence/context only, not a verified quote): https://www.amazon.com/Costume-Designers-Handbook-Complete-Professional/dp/0131812718

Repo files read directly (fully verified, not search-based):
- `outfit-color-matcher/app.html` (functions `ideaColor`, `generateIdeaBatch`, constants `IDEA_RULES`,
  `IDEA_S_RANGE`, `IDEA_L_RANGE`, `OCCASION_TONE`, `NEUTRAL_MAX_S`, `VIVID_MIN_S`, `CATEGORY_WEIGHT`)
- `outfit-color-matcher/docs/spec-outfit-color-matcher.md` (sections 4.1-4.7, 9)
- `research/color-matching-for-outfit-website.md` (existing repo convention this file follows)
