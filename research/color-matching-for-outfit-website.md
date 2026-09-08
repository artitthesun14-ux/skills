# Color-matching techniques for an outfit-coordination website

Research question: what established, well-founded color-matching techniques could a web app use to
recommend which clothing colors go together, and how are they implemented on the web?

## Summary: what to actually use

- **Do the "do these match" math in a perceptually uniform space, not in HSL.** HSL/HSV hue math is
  cheap but perceptually non-uniform (equal numeric steps do not look equally different), so distance
  and harmony computed there are unreliable. Use **OKLCH** (or CIELCH) for anything that decides how
  close or how far apart two colors are.
- **Encode the classic harmony rules as hue-angle relationships** on the OKLCH/HSL hue wheel:
  complementary 180 degrees, analogous roughly +/-30 degrees, triadic 120 degrees apart,
  split-complementary complement +/-30 degrees, tetradic two complementary pairs (a rectangle or a
  square on the wheel), monochromatic same hue with lightness/chroma varied.
- **Measure similarity and clash with a color-difference metric (Delta E), preferably CIEDE2000.**
- **Compute locally with a JS library** (culori is the most complete for this task). Call an external
  palette API only if you want ready-made "seed color to scheme" output (TheColorAPI is the simplest,
  no auth).
- **Contrast (WCAG) matters twice:** the outfit "pops" through lightness/contrast, and the site UI must
  itself meet WCAG contrast thresholds.
- **Garment color from a photo:** draw the image to a `<canvas>`, read pixels with `getImageData()`,
  then reduce to a dominant color / small palette with median cut or k-means.
- **Be honest about fashion folklore:** warm/cool undertone and "seasonal color analysis" are industry
  convention, not a standard. Present them as heuristics, not science.

A note on sourcing: several primary sources (w3.org, drafts.csswg.org, and Bjorn Ottosson's
bottosson.github.io) are reachable as canonical URLs but were blocked by this environment's network
egress proxy, so their exact wording could not be re-quoted here. The URLs are the authoritative
primary sources and their substance was corroborated through search result summaries; those specific
cases are flagged inline as "primary URL, not directly fetched."

---

## 1. Color harmony rules and the math behind them

The classical harmony vocabulary comes from artists' color theory, most influentially **Johannes
Itten**, who taught a twelve-part color wheel (three primaries red/yellow/blue, three secondaries, six
tertiaries) and defined seven contrasts, one of which is complementary (colors directly opposite on
the wheel). Documented by the Getty (a museum/research primary source for Bauhaus color teaching):
https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/

The **Munsell color system** is the older, more rigorous framing of "a color" as three separable
dimensions: **hue, value (lightness), and chroma (intensity)**, arranged in a 3D solid with 100 hues
around the circle. This is the conceptual basis for treating a color as (hue angle, lightness,
chroma), which every rule below relies on. First-party source, the Munsell Color company:
https://munsell.com/about-munsell-color/how-color-notation-works/ ; encyclopedic corroboration:
https://www.britannica.com/science/Munsell-color-system

Implementable definitions (hue relationships on a 0 to 360 degree wheel). The concrete rule set that a
web app would encode is exactly the one Adobe documents as its "Color Harmony Rules," which is a clean
first-party enumeration: Analogous, Monochromatic, Triad, Complementary, Split Complementary, Double
Split Complementary, Square, Compound, Shades:
https://helpx.adobe.com/creative-cloud/adobe-color.html

- **Monochromatic:** one hue, vary lightness and chroma only. Delta(hue) = 0.
- **Analogous:** neighbors on the wheel, typically +/-30 degrees from the base hue.
- **Complementary:** opposite hue, base + 180 degrees.
- **Split-complementary:** the two hues adjacent to the complement, base + 150 and base + 210 degrees
  (i.e. complement +/-30).
- **Triadic:** three hues evenly spaced, base, base + 120, base + 240 degrees.
- **Tetradic / double-complementary:** two complementary pairs, i.e. four hues forming a rectangle
  (e.g. base, base+60, base+180, base+240) or a square (base, base+90, base+180, base+270).

TheColorAPI exposes the same rules as machine callable "scheme modes" (monochrome, analogic,
complement, analogic-complement, triad, quad), which is a useful cross-check that these are the
canonical, implementable set: https://www.thecolorapi.com/docs

**Implementation caveat (important and often missed):** these degree relationships were formulated on
the artists' **RYB** wheel (Itten), where "complement of red" is green. The CSS **HSL** hue wheel is
**RGB**-based, so red (0 degrees) plus 180 degrees is cyan, not the painterly green. So "complement =
hue + 180" is only literally true on the RGB/HSL/OKLCH wheel your code actually uses. This is a real
modeling decision, not a rounding detail: pick the wheel deliberately. OKLCH's hue is a perceptual hue
angle and behaves better than HSL's for evenly spaced schemes (see section 2).

---

## 2. Color models and spaces for the web, and why the choice matters

### HSL / HSV (CSS Color)

CSS Color Module Level 4 defines `hsl()` and `hwb()` with hue as an angle from 0 degrees (red) through
the wheel back to 360 degrees. Hue math is trivial (add degrees), which is why HSL is the default reach
for harmony code. The catch: HSL/HSV are simple transforms of sRGB and are **not perceptually
uniform**. Equal numeric changes in H, S, or L do not produce equal perceived changes, and two colors
with the same numeric distance can look very differently spaced. So HSL is fine for generating a wheel
but weak for deciding "are these two equally different" or "do these harmonize."
CSS Color 4, W3C (primary URL, not directly fetched due to egress block):
https://www.w3.org/TR/css-color-4/

### CIELAB / CIELCH

CIELAB (CIE L*a*b*, 1976) and its cylindrical form **CIELCH** (Lightness, Chroma, Hue) were designed by
the CIE to be roughly perceptually uniform, so Euclidean-ish distance in the space tracks perceived
difference far better than RGB/HSL. CSS Color 4 standardizes `lab()` and `lch()` on this basis. The
color-difference metrics in section 3 are defined on top of L*a*b*.
CSS Color 4, W3C (primary URL, not directly fetched): https://www.w3.org/TR/css-color-4/
CIE, the standards body that owns L*a*b* and the difference formulas:
https://cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula

### OKLab / OKLCH

**OKLab** is a perceptual color space introduced by **Bjorn Ottosson in December 2020**, designed to
predict perceived lightness, chroma, and hue well while staying simple and numerically well behaved.
Its cylindrical form is **OKLCH** (Lightness, Chroma, Hue angle). Ottosson's original article is the
primary source (primary URL, not directly fetched due to egress block):
https://bottosson.github.io/posts/oklab/

**CSS Color Module Level 4** standardizes `oklab()` and `oklch()` (alongside `lab()`/`lch()`) as
device-independent web colors. Per the spec, OKLCH shares OKLab's lightness axis but uses polar chroma
and hue, and was fitted by numerical optimization for improved hue linearity, hue uniformity, and
chroma uniformity compared with CIE LCH. W3C (primary URL, not directly fetched):
https://www.w3.org/TR/css-color-4/ ; editor's draft: https://drafts.csswg.org/css-color/

**Why perceptual uniformity gives better "do these match" answers:** in a perceptually uniform space,
the same numeric coordinate change produces the same perceived color change. MDN states this directly
for oklab/oklch and shows that interpolating in OKLCH keeps colors vibrant where sRGB interpolation
goes muddy/gray through the middle:
https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
That property is exactly what "these two colors are equally different" and "these harmonize / these
clash" need. In HSL, a 20-degree hue step near yellow and near blue do not look equally large; in
OKLCH they are much closer to equal, so evenly spaced triads and consistent distance thresholds
actually behave consistently.

---

## 3. Color difference (Delta E)

Delta E (dE) quantifies the perceived difference between two colors, which is the numeric backbone of
"matching" (small dE, or a deliberate harmonic relationship) versus "clashing." The metrics are
defined by the CIE on the CIELAB space:

- **CIE76 (dE*ab, 1976):** plain Euclidean distance in L*a*b*. Simple, but under-weights known
  non-uniformities.
- **CIE94 (dE*94):** adds weighting terms for lightness, chroma, and hue.
- **CIEDE2000 (dE*00, 2001):** the current CIE-recommended formula, adding corrections (S_L, S_C, S_H
  weighting functions, plus K_L, K_C, K_H parametric factors and a blue-region hue-rotation term) for
  better agreement with human perception. This is the one to prefer.

Primary standards source, CIE (owns the CIEDE2000 recommendation, ISO/CIE 11664-6):
https://cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula
The widely used reference implementation is by Gaurav Sharma et al. (University of Rochester), which
libraries cite: https://www2.ece.rochester.edu/~gsharma/ciede2000/
CIE76/CIE94/CIEDE2000 lineage corroborated by the CIE development paper record:
https://dl.acm.org/doi/10.1145/965145.801294 (note: this is the Heckbert quantization paper, cited in
section 7; the CIEDE2000 development is documented in the CIE publication above and Sharma's page).

For an outfit app, dE is useful two ways: flag near-duplicates ("you already own almost this exact
gray," small dE) and score how far an accent sits from the base, rather than trusting raw HSL numbers.

---

## 4. Contrast and accessibility

Two reasons contrast matters here: an outfit reads as intentional partly through lightness contrast
(a "pop"), and the site's own UI must be legible.

### WCAG 2.x contrast ratio

WCAG defines contrast ratio as `(L1 + 0.05) / (L2 + 0.05)`, where L1 is the relative luminance of the
lighter color and L2 of the darker, giving a range from 1:1 to 21:1. Relative luminance L is computed
from sRGB by linearizing each channel (the `<= 0.03928` / gamma-2.4 piecewise transform) and combining
as `L = 0.2126*R + 0.7152*G + 0.0722*B`. Thresholds: Success Criterion 1.4.3 (AA) requires **4.5:1**
for normal text and **3:1** for large text; 1.4.6 (AAA) requires **7:1** (and 4.5:1 for large text);
1.4.11 requires **3:1** for UI components and graphics.
W3C WCAG 2.1 (primary URLs, not directly fetched due to egress block):
- Contrast ratio and relative luminance definitions: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
  and https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
- Understanding 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

### APCA (WCAG 3 draft)

APCA (Accessible Perceptual Contrast Algorithm) is the newer, perceptually based contrast method being
developed for the emerging WCAG 3 guidelines. It is authored by Andrew Somers ("Myndex") and produces
a polarity-aware "Lc" contrast value rather than a simple ratio. First-party sources:
- https://github.com/Myndex/SAPC-APCA
- https://github.com/Myndex/apca-w3
- https://git.apcacontrast.com/documentation/APCAeasyIntro.html
Status note: APCA is a **draft** and not yet a ratified requirement; ship against WCAG 2.x thresholds
and treat APCA as forward-looking.

---

## 5. Neutrals and fashion styling rules of thumb

This section is where "well-founded" gets thin. What is codified vs. convention:

- **Codified (color science):** "neutral" has a real meaning, near-zero chroma (grays, and near-neutral
  browns/beiges/navies with low chroma). In Munsell/CIELCH/OKLCH terms a neutral is simply a color with
  C approximately 0. Because neutrals carry almost no hue, hue-harmony rules effectively do not
  constrain them, which is the technical reason "neutrals go with everything." Munsell hue/value/chroma
  basis: https://munsell.com/about-munsell-color/how-color-notation-works/
- **Convention (styling heuristics, widely taught but not a standard):**
  - "Neutral base plus one or two saturated accents" and "limit the number of high-chroma hues in one
    outfit." This is common styling advice, not a spec. Present it as a default the user can override.
  - **Warm/cool undertone** and **seasonal color analysis** (Spring/Summer/Autumn/Winter). This system
    was commercialized by Suzanne Caygill and popularized by **Carole Jackson's 1980 book "Color Me
    Beautiful."** It is an industry/beauty convention about which garment colors flatter a person's
    complexion, not a scientific standard, and different practitioners disagree on classifications.
    Brand/first-party source: https://colormebeautiful.com/blogs/colormenow/the-ultimate-guide-to-color-analysis
    Background on origin/popularization (secondary): https://en.wikipedia.org/wiki/Carole_Jackson
    Recommendation: if you offer this, label it clearly as a style preference/heuristic, let users pick
    their palette, and never present the four-season output as objective truth.

Honesty flag: I did **not** find a primary, peer-reviewed or standards-body source establishing
warm/cool undertone or seasonal analysis as validated. Treat all of it as convention.

---

## 6. Practical implementation for a website

### JS color libraries

- **culori** (Evercoder). Broadest color-space and difference-function coverage for this exact task.
  Supports oklab, oklch, okhsl, okhsv, lab, lch, hsl, hsv, hwb, luv/lchuv, p3, rec2020, jzazbz, and
  more. Difference functions: `differenceEuclidean`, `differenceCie76`, `differenceCie94`,
  `differenceCiede2000` (dE*00, Sharma implementation, computed in Lab), `differenceCmc`,
  `differenceHyab`, `differenceItp`, plus hue/chroma helpers. Also has gamut mapping via OKLCH.
  Docs: https://culorijs.org/ , spaces list:
  https://github.com/Evercoder/culori/blob/main/docs/color-spaces.md , API:
  https://github.com/Evercoder/culori/blob/main/docs/api.md
- **chroma.js** (Gulp/gka). Great ergonomics for scales and interpolation; `chroma.deltaE()` implements
  CIEDE2000 (0 = identical, 100 = max, with optional Kl/Kc/Kh weights) based on the Bruce Lindbloom
  formulation, and `chroma.scale()` can interpolate in lab/lch/hsl. Fewer modern spaces than culori.
  Docs/repo: https://gka.github.io/chroma.js/ ,
  https://github.com/gka/chroma.js/blob/main/docs/src/index.md
- **Color.js / colorjs.io** (Lea Verou and Chris Lilley, editors of the CSS Color specs). The most
  "spec-faithful" option: modules for Lab/LCh, OKLab/OKLCh, sRGB/HSL/HSV/HWB, Display P3, Jzazbz,
  Rec.2100 and more; deltaE methods `76`, `CMC`, `2000`, `Jz`, `OK`, `OK2`; and a `contrast()` function
  supporting `WCAG21`, `APCA`, `Michelson`, `Weber`, `Lstar`, `DeltaPhi`. Heavier API, but authoritative.
  Docs: https://colorjs.io/ , spaces: https://colorjs.io/docs/spaces , contrast:
  https://colorjs.io/docs/contrast , repo: https://github.com/color-js/color.js

### Public color / palette APIs

- **TheColorAPI** (thecolorapi.com). Simplest option, **no auth key** documented. `GET /id` identifies
  a color across models (hex/rgb/hsl/cmyk plus a name); `GET /scheme?hex=...&mode=...&count=...` returns
  a harmony scheme where `mode` is one of monochrome, monochrome-dark, monochrome-light, analogic,
  complement, analogic-complement, triad, quad. First-party docs: https://www.thecolorapi.com/docs
- **Colormind** (colormind.io). ML palette generator. `POST http://colormind.io/api/` with
  `{"model":"default"}` returns a 5-color palette as RGB arrays; you can lock inputs by passing an
  `input` array with `"N"` for blanks to get suggestions that complete a partial palette. First-party:
  http://colormind.io/api-access/ . License note: stated **free for personal and non-commercial use**;
  the base endpoint is HTTP, which is a mixed-content problem for an HTTPS site (proxy it server-side).
- **Adobe Color** (color.adobe.com). Documents the canonical harmony rules (Analogous, Monochromatic,
  Triad, Complementary, Split Complementary, Double Split Complementary, Square, Compound, Shades) and
  image theme extraction moods (Colorful, Bright, Muted, Deep, Dark). First-party:
  https://helpx.adobe.com/creative-cloud/adobe-color.html . Honesty flag: Adobe Color is a web tool, and
  I did **not** find a current, openly documented public REST API for programmatic scheme generation
  (the old Kuler/Creative SDK Color API is deprecated). Use Adobe Color as a reference for the rule set,
  not as a live dependency.

### Native browser support

- **`color-mix()`** mixes two colors in a chosen space; using `in oklch` (or `in oklab`) keeps mixes
  vibrant and perceptually even, which is ideal for generating tints/shades and blends of wardrobe
  colors in pure CSS. MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
- **`oklch()` / `oklab()` / `lch()` / `lab()`** are usable CSS color functions per CSS Color 4, with
  broad current browser support. MDN `<color>` reference:
  https://developer.mozilla.org/en-US/docs/Web/CSS/color_value ; W3C spec (primary URL, not directly
  fetched): https://www.w3.org/TR/css-color-4/
- **Canvas `getImageData()`** is the built-in route to read raw pixels for color extraction (see next).

---

## 7. Extracting a garment's color from a photo

Pipeline: load the uploaded image into an `<img>` or `ImageBitmap`, draw it onto a `<canvas>`, then
call `ctx.getImageData(x, y, w, h)`. The returned `ImageData.data` is a `Uint8ClampedArray` of RGBA
bytes, 4 per pixel (R, G, B, A), row-major from the top-left. First-party (Mozilla) sources:
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

Reduce those pixels to a dominant color or a small palette:

- **Median cut.** The original divisive color-quantization algorithm: repeatedly split the 3D color box
  along its longest axis so each sub-box holds roughly equal pixel counts, then average each final box.
  Introduced by **Paul Heckbert, "Color image quantization for frame buffer display," SIGGRAPH 1982**.
  Primary source: https://dl.acm.org/doi/10.1145/965145.801294 ; SIGGRAPH history record:
  https://history.siggraph.org/learning/color-image-quantization-for-frame-buffer-display-by-heckbert/
- **k-means clustering.** Cluster pixels in color space (ideally OKLab/CIELAB, not raw RGB, so
  clusters track perceived similarity); the largest cluster's centroid is the dominant garment color.
  Heckbert's paper already noted k-means as a refinement step for quantization (same primary source
  above).

Practical tips grounded in the above: sample a center crop of the garment to avoid background,
optionally downscale first for speed, ignore near-white/near-black background pixels, and convert
cluster centroids into OKLCH before feeding them to the harmony/Delta E logic in sections 1 to 3.

---

## Recommended stack for a first version

Opinionated pick, with the reasoning tied back to the findings:

1. **Work in OKLCH for all matching logic.** It is perceptually uniform (section 2), standardized in
   CSS Color 4, and directly expressible in CSS via `oklch()` and `color-mix(... in oklch)`. That makes
   hue-angle harmony rules and distance thresholds behave consistently, which HSL does not guarantee.
2. **Start with three harmony rules, not nine:** complementary (hue + 180), analogous (+/-30), and
   monochromatic (fix hue, vary L and C). They cover most "does this outfit work" cases and are trivial
   to compute as hue arithmetic (section 1). Add triadic and split-complementary once the basics work.
3. **Score similarity/clash with CIEDE2000 Delta E** to flag near-duplicate wardrobe items and to
   measure how far an accent sits from the base (section 3).
4. **Compute locally with culori.** It is the one library that covers OKLCH plus `differenceCiede2000`
   plus gamut mapping in a single small dependency (section 6), so you avoid a network round trip and a
   licensing/mixed-content dependency. Use `color-mix()`/`oklch()` in CSS for the actual rendering.
5. **Skip external palette APIs for v1.** If you later want ready-made schemes from a single seed color,
   TheColorAPI is the lowest-friction (no key, HTTPS, documented modes). Avoid Colormind in the browser
   because its endpoint is HTTP and non-commercial-only; if used, proxy it server-side. Treat Adobe
   Color as a design reference, not an API (no current open public API found).
6. **Garment color from photos:** canvas `getImageData()` plus a small k-means in OKLab (or median cut)
   to get the dominant color, then hand that to the OKLCH harmony logic (section 7).
7. **Enforce WCAG 2.x contrast on the UI** (4.5:1 body text, 3:1 large text and UI components) and
   optionally surface an outfit "contrast/pop" score from lightness difference. Keep APCA in mind as a
   future upgrade but do not gate on it, it is still a WCAG 3 draft (section 4).
8. **Offer warm/cool or seasonal palettes only as an optional, clearly-labeled preference**, never as
   objective truth, since that whole area is convention, not standard (section 5).

---

## Sources

Primary and first-party:
- W3C CSS Color Module Level 4: https://www.w3.org/TR/css-color-4/ (editor's draft:
  https://drafts.csswg.org/css-color/ ) [primary URL, blocked by egress proxy, not directly fetched]
- Bjorn Ottosson, "A perceptual color space for image processing" (OKLab):
  https://bottosson.github.io/posts/oklab/ [primary URL, blocked by egress proxy, not directly fetched]
- CIE, Colorimetry Part 6: CIEDE2000 Colour-Difference Formula:
  https://cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula
- Gaurav Sharma, CIEDE2000 reference implementation and notes:
  https://www2.ece.rochester.edu/~gsharma/ciede2000/
- W3C WCAG 2.1, contrast ratio and relative luminance: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio ,
  https://www.w3.org/TR/WCAG21/#dfn-relative-luminance ,
  https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html [primary URLs, blocked by egress
  proxy, not directly fetched]
- APCA / Andrew Somers (Myndex): https://github.com/Myndex/SAPC-APCA ,
  https://github.com/Myndex/apca-w3 , https://git.apcacontrast.com/documentation/APCAeasyIntro.html
- Munsell Color company, hue/value/chroma notation:
  https://munsell.com/about-munsell-color/how-color-notation-works/
- Getty Research Institute, Bauhaus color (Itten):
  https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/
- Paul Heckbert, "Color image quantization for frame buffer display," SIGGRAPH 1982:
  https://dl.acm.org/doi/10.1145/965145.801294 ,
  https://history.siggraph.org/learning/color-image-quantization-for-frame-buffer-display-by-heckbert/
- culori: https://culorijs.org/ , https://github.com/Evercoder/culori/blob/main/docs/color-spaces.md ,
  https://github.com/Evercoder/culori/blob/main/docs/api.md
- chroma.js: https://gka.github.io/chroma.js/ , https://github.com/gka/chroma.js/blob/main/docs/src/index.md
- Color.js (colorjs.io): https://colorjs.io/ , https://colorjs.io/docs/spaces , https://colorjs.io/docs/contrast ,
  https://github.com/color-js/color.js
- TheColorAPI: https://www.thecolorapi.com/docs
- Colormind API: http://colormind.io/api-access/
- Adobe Color harmony rules and image extraction: https://helpx.adobe.com/creative-cloud/adobe-color.html
- MDN (Mozilla) color-mix(): https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
- MDN `<color>`: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
- MDN Canvas getImageData(): https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
- MDN pixel manipulation with canvas:
  https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

Secondary / background (clearly marked, used only where no primary applies):
- Britannica, Munsell color system: https://www.britannica.com/science/Munsell-color-system
- Color Me Beautiful (brand), color analysis guide:
  https://colormebeautiful.com/blogs/colormenow/the-ultimate-guide-to-color-analysis
- Wikipedia, Carole Jackson (origin/popularization of seasonal analysis):
  https://en.wikipedia.org/wiki/Carole_Jackson
