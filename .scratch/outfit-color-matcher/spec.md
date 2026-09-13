Status: ready-for-agent

# Spec: Feature Updates & System Overhaul (Outfit Color Matcher)

> ต่อยอดจาก `docs/spec-outfit-color-matcher.md` (สเปกหลัก, เฟส 1-3 ปิดหมดแล้ว) เอกสารนี้ครอบคลุมชุดฟีเจอร์ใหม่รอบถัดไป
> ตัดสินใจร่วมกับผู้ใช้ 3 จุดที่กติกาเดิมไม่ครอบคลุม/มีคำที่ไม่เคย define มาก่อน (ดู footnote ท้ายแต่ละหัวข้อ)

## Problem Statement

จากการใช้งานจริงหลังเฟส 1-3 ผู้ใช้เจอข้อจำกัด 5 จุด:

1. **Swap ไม่ช่วยตัดสินใจ:** ตอนกด 🔄 เปลี่ยนทีละชิ้น ระบบวนตัวถัดไปให้เฉยๆ ไม่บอกว่า "ควรเปลี่ยนไปทางสีไหน" และใช้ได้แค่บนการ์ดที่โฟกัสอยู่ตัวเดียว
2. **กฎ "ต้องมีบน+ล่าง" จำกัดเกินจริง:** คนที่มีแค่เสื้อคลุม+รองเท้าสวยๆ ก็อยากได้คำแนะนำ ไม่อยากถูกเมินเพราะไม่มีกางเกง
3. **ดีไซน์ยังเป็นสไตล์ Rand เดิม:** อยากได้ภาพลักษณ์ใหม่ที่มีเอกลักษณ์กว่า (Collage Art Style) และไม่ต้องพูดศัพท์สี primary/accent ให้ผู้ใช้ทั่วไปงง; ธีมมืดก็ไม่ได้ใช้จริง อยากได้ธีมที่มีชีวิตชีวาขึ้นแทน
4. **หาสีในตู้ยาก:** แถวสีที่เลื่อนแนวนอน (สีของวันนี้ / สีที่ใช้เลือกตอนเพิ่มเสื้อผ้า) มีของเยอะจนล้นจอ ไม่มีทางดูทั้งหมดเป็นหมวดหมู่
5. **หน้าตาชิ้นเสื้อผ้ายังพื้นฐานไป** อยากได้เลย์เอาต์ที่ทันสมัยขึ้นในทุกหมวด

## Solution

อัปเดต 5 กลุ่มฟีเจอร์บน engine เดียวกัน (ไม่แตะหลักการ Color Role ใน spec หลัก §4.7):

1. Swap ฉลาดขึ้น (มีคำแนะนำสี + ใช้ได้ทุกการ์ดในแบตช์ ไม่ใช่แค่การ์ดโฟกัส)
2. เลิกบังคับโครงสร้าง "บน+ล่าง": engine จับคู่ได้อิสระจากของที่มีจริงในตู้ ขอแค่ >= 2 ชิ้น
3. ดีไซน์ใหม่ทั้งระบบ: Collage Art Style, เลิก dark mode, ธีมพื้นหลังไดนามิกที่ล็อกได้
4. อัปเกรด UI เลือกสี: ปุ่ม "ดูสีเพิ่มเติม" เปิดมุมมองจัดกลุ่มตามโทนสี
5. รีดีไซน์การแสดงผลชิ้นเสื้อผ้าทุกหมวดให้ทันสมัยขึ้น (ใช้ภาษาภาพเดียวกับข้อ 3)

## User Stories

**Swap One Item**
1. As a user picking an outfit from my wardrobe, I want the swap button to suggest which item best improves the color match, so that I don't have to cycle blindly through every option.
2. As a user who has cycled through all owned items in a category via swap and still isn't happy, I want to see a suggested color to look out for, so that I know what to buy or borrow next.
3. As a user browsing a batch of 3-4 outfits, I want the swap control available on every card (not only the one currently focused), so that I can fine-tune any outfit I like without first bringing it to focus.
4. As a user, when a category has only one item, I still want the disabled swap button with a hint, so that I understand why nothing changes.

**Flexible Outfit Generation**
5. As a user whose wardrobe has an outerwear piece and shoes but no bottoms yet, I want to still receive outfit suggestions, so that I get value from a partially-filled wardrobe.
6. As a user with only 2 items total in my wardrobe, I want to receive at least one outfit suggestion if those 2 items color-coordinate, so that the app never sits idle just because I haven't logged a "complete" outfit's worth of items yet.
7. As a user with fewer than 2 items total, I want a clear "insufficient data" message (not a fabricated outfit), so that I know exactly what's missing.
8. As a user in Color-first mode ("วันนี้อยากใส่สีอะไร?") without a bottom in that locked color, I want the engine to still find a match if any other item (top, outer, shoes, or accessory) is that color, so that locking a color doesn't fail just because my wardrobe skews toward one category.
9. As a user, I want the color proportion (60-30-10) to still read sensibly when an outfit has, say, only outerwear + shoes, so that the display never looks broken or nonsensical.

**Visual & Theme System**
10. As a user, I want the whole app to look and feel like a cohesive "Collage Art Style" product, so that it feels distinct and intentional rather than generic.
11. As a user, I want to see outfit color breakdowns without jargon like "Primary/Secondary/Accent," so that the app stays approachable to people with no color-theory background.
12. As a user, I no longer want a dark mode toggle cluttering the settings, since I never used it.
13. As a user, I want the site's background to visually shift each time I generate a new set of outfits, so that the experience feels alive and tied to what I'm looking at.
14. As a user who likes the current background, I want to lock it in place with one tap, so that it stops changing while I keep browsing or swapping items.
15. As a user with visual impairments, I want text to stay readable regardless of which background color is currently showing, so that the dynamic theme never breaks accessibility.

**Color Selection & Filtering UI**
16. As a user with a large wardrobe, I want a "View more colors" button at the end of the horizontal color-swatch row, so that I'm not stuck scrolling through a long strip to find a color.
17. As a user who taps "View more colors," I want colors grouped by tone (e.g., all my brows together under "Brown"), so that I can find a shade I'm thinking of without knowing its exact hex.
18. As a user, when I tap a tone group (e.g., "Brown"), I want to see every distinct shade of that tone actually present in my wardrobe, so that I can pick precisely.
19. As a user, I want this same grouped view available both for picking "today's color" (Color-first mode) and for picking a garment's own color when adding/editing an item, so that the experience is consistent everywhere I choose a color.

**Garment Display Redesign**
20. As a user browsing my wardrobe or a suggested outfit, I want each garment tile to look modern and polished across every category (tops, bottoms, shoes, outerwear, accessories), so that the app feels current, not like a rough prototype.
21. As a user, I want the redesigned garment tiles to still clearly show the shape, color, category label, and color name/hex together, so that accessibility (no color-alone communication) is preserved through the redesign.

## Implementation Decisions

### 1. Swap One Item (expansion)

- **Recommendation surfacing:** `swapItem()` already builds a ring of same-category candidates from the wardrobe, scored by `scoreOf()` against the locked remaining items, and cycles through them in ranked order. Change: when the currently-displayed candidate is the **top-ranked one** (ring index 0), show a "แนะนำ" (recommended) badge on it. The badge is not a separate persistent UI element; it only appears when the cycle lands back on index 0 (confirmed with the user: simpler than adding a standalone "best pick" callout alongside the cycling control).
- **Suggested color when owned items run out:** when the ring has been fully cycled (or the category has 0-1 owned items), surface up to 2 theoretical suggested colors for that category. This needs a **new, narrower function**, not a direct reuse of FR-4's `analyzeWardrobe()` suggestion colors: that function reasons about the whole wardrobe's dominant base color, while swap needs a color that pairs well with the *other items already in this specific outfit* only. Reuse FR-4's underlying harmony-matching approach as the starting point, but scope its input to this outfit's own items (confirmed with the user after the mismatch was flagged). These are swatch-only suggestions (no real garment attached). Selecting one does not change the outfit; it's informational, consistent with the "no upsell / no buy-this" tone already established in FR-4 AC4. **Narrowed during implementation:** the suggestions appear only after the user has cycled a category's ring to the end, not ambiently for every category holding 0-1 items. Building the ambient version first showed it filling a card with advice the user never asked for (a screenshot of a 4-item wardrobe had more suggestion text than outfit), and a single-item category has no interaction to hang it off, since its swap button stays disabled per the bullet below. A category with one item therefore keeps only its existing hint.
- **Usable on every outfit in the batch (revised during implementation):** the original wording here asked for swap controls to work on non-focused cards in place. That is not buildable against the carousel this app has: a non-focused card shows a 40 to 72px sliver and carries `inert` plus `aria-hidden` from phase 1, so controls inside it are both clipped and deliberately unreachable. Implementation also found the real defect behind the complaint: swap controls were rendered only for whichever card was focused *at render time*, and moving the carousel only toggles classes, so navigating to any other outfit left it with no swap controls at all since phase 2. The decision taken with the user: tapping a non-focused card brings it into focus (a transparent pointer-only overlay per card, keyboard keeps the existing arrows), and swap controls are rendered for every wardrobe-mode card with CSS hiding them until that card is focused. Every outfit in the batch is now adjustable, in one tap.
- **Interaction with a locked color (FR-5):** if the category being swapped is the *only* category in this outfit currently carrying the locked color, filter the ring to exclude any candidate that isn't that exact color, so swapping can never silently drop the outfit out of FR-5's "locked color is present" rule (ux §7B "no silent state change"). If that filter leaves zero candidates, the swap control for that category becomes disabled with a hint, reusing the existing "single item in category" disabled pattern (spec §7C) with a different message (e.g. "ต้องคงสีที่ล็อกไว้"). If more than one category in the outfit already carries the locked color, no filtering applies to any of them, since swapping either one still leaves the lock satisfied by the other (both confirmed with the user).
- **Scope stays wardrobe mode only:** idea mode still has no owned items to cycle through, so swap remains hidden there, unchanged from current behavior. This is a deliberate scope line (see Out of Scope).

### 2. Flexible Outfit Generation Logic

- **Drop the rigid top+bottom requirement.** Replace it with: *an outfit is valid if it contains at least 2 items from any combination of categories.* This was confirmed with the user over the alternative of no minimum at all: a single-item "outfit" isn't a matching decision, so 2 is the floor.
- **"At least 2 items" means 2 distinct category slots, not a data-model change.** The `Outfit.items` shape stays exactly `{top,bottom,outer?,shoes?,accessory?}`, one item per category key, unchanged. The new floor is about how many of those 5 slots must be filled, never about allowing more than one item per category (confirmed with the user, to prevent misreading).
- **Main spec FR-1 AC2 itself must be rewritten, not just spec §7C.** The current sentence ("ทุกชุดที่โชว์ต้องมีบน+ล่างครบ (ห้ามโชว์ชุดขาดหมวดจำเป็น)") directly contradicts this decision and needs to change to reflect the 2-items-any-category floor once this phase is implemented; generalizing §7C's Insufficient-Data copy alone is not enough (confirmed with the user).
- **Combination generation:** `generateWardrobeBatch()` moves from a top×bottom cross-product to independent per-category sampling: for each category present in the wardrobe, include it in a candidate combo with its existing inclusion probability (top/bottom currently implicit at 100%, outer 35%, shoes 85%, accessory 40%; these become explicit, symmetric probabilities per category rather than two mandatory + three optional). Any combo that lands under 2 items is topped up with the heaviest-weight categories still available, rather than discarded and resampled (**changed during implementation**: topping up always terminates, while resampling can spin on a sparse wardrobe). Sampling is capped by the existing `COMBO_CAP` mechanism (spec §7C, "Large wardrobe") so this never hangs. The top/bottom probabilities land at 0.95 rather than a literal 100%, so a full wardrobe still occasionally offers a look built on other categories.
- **Insufficient Data state (spec §7C) generalizes:** instead of "missing top" / "missing bottom" messaging, the condition becomes *the wardrobe holds fewer than 2 distinct categories*: message updates to name whichever situation is true generically ("เพิ่มอีกอย่างน้อย 1 ชิ้นเพื่อเริ่มจับคู่") rather than naming a specific category. **Corrected during implementation:** an earlier draft of this line said "fewer than 2 total garments", which contradicts the one-item-per-category rule two bullets up: three tops are 3 garments but still cannot make an outfit. The category-count reading is the one built.
- **FR-5 Color-first "core item" rule generalizes:** the current AC1 requires the locked color to land on top or bottom specifically (because those were the only guaranteed categories). With no privileged category anymore, AC1 becomes: *the locked color must appear on at least one item, in any category, in the resulting outfit.* No-Match (spec §7C) becomes: wardrobe has zero items in that exact color at all.
- **Color proportion weighting is unchanged** (`CATEGORY_WEIGHT`: top/bottom/outer 30, shoes 7, accessory 3). It already normalizes against whatever categories are actually present (`entries.reduce` over included categories only), so an outerwear+shoes-only outfit still produces a valid 100%-summed breakdown without code changes to that function.
- **Idea mode (FR-5/4.6) is unaffected**: it never depended on top/bottom being real garments in the first place (colors only), so this change is wardrobe-mode-only.
- **Swap's "single item in category" disabled state (spec §7C) is unaffected**: still applies per-category regardless of the new flexible combination rule.
- **Two consequences pulled forward from later phases (both needed for phase A to look right):** cards stop reserving a slot for categories the outfit does not have (otherwise an outerwear-plus-shoes look renders two "ไม่มี" placeholders, see Decision #5), and batch selection prefers looks that use the wardrobe's two heaviest available categories before looks that skip them (otherwise a wardrobe holding one top and one bottom fills its batch with partial looks, which a test caught).

<!-- decided with the user: the alternative read of "flexible generation" (no minimum item count at all, i.e. even a single accessory can be "an outfit") was rejected as not being a real matching decision -->

### 3. Visual & Theme System

- **Design direction ("Collage Art Style"):** was undefined before this spec (only the Rand-inspired off-white/raspberry-red system existed, spec §7A). Decided with the user: garment shapes render as **overlapping, cut-out/collage-style compositions** rather than the current clean grid of isolated square tiles, as the starting visual direction. This is a visual-system-level decision to be worked out in detail by `ui-design`/`design-system` before implementation (this spec fixes the *direction*, not the pixel spec). §7A of the main spec and the UI doc's component inventory (§3.3-3.7) get superseded, not just amended.
- **Remove role vocabulary from user-facing copy.** `ROLE_TH` (สีหลัก/สีรอง/สีกลาง/สีเน้น) currently appears in the proportion bar's legend, segment title, and label text. These become color name + hex + % only, no role word. **The underlying `role` field stays in the data model and engine** (`colorBreakdown[].role`). Color Role (main spec §4.7) is still how the engine picks and balances colors internally; only the *display* of the role taxonomy to the user is removed. This satisfies "define solely as Collage Art Style" without touching the harmony engine.
- **Remove dark mode entirely:** delete the `data-theme` toggle, the `prefers-color-scheme: dark` media block, the dark token set, and the theme-cycle control in the footer. The app becomes single-mode. Any previously persisted `state.theme` value in existing users' localStorage is simply ignored on load (dead key, not migrated); see Out of Scope. Implementing this also requires editing `PROJECT_STATE.md` §3's list of decisions that must not be dropped: it currently names light/dark as a hard constraint, and that line must be removed there too, not just in code (confirmed with the user; otherwise the two documents contradict each other once this ships).
- **Dynamic theme palette:** on every "เจนชุดใหม่" (regenerate) action, derive a new background tint from the newly generated batch's focused-card Primary role color: take that color's hue, then render the background at a **fixed low saturation and fixed high lightness** (a pastel tint of that hue; exact S/L values are a `ui-design` calibration task, not fixed here) so contrast against the `--ink` text token never degrades regardless of which hue is showing. `--ink`, `--accent`, and all data-color swatches stay exactly as-is; only the page background/theme surface shifts.
- **Lock Theme Color button:** freezes the *background/theme tint only*, confirmed with the user over the alternative of also freezing the outfit-generation color logic itself (that's already owned by FR-5's separate "lock a color to build outfits around" feature and must not be conflated with this purely cosmetic lock). When locked, further regenerations stop updating the background tint until unlocked. Persist `themeLocked` + the locked tint alongside existing settings in localStorage (same storage key, same try/catch discipline as spec §7).
- **Accessibility invariant carries over unchanged:** contrast standards from spec §7 apply to the dynamic background exactly as they did to the old light/dark tokens. This is a hard constraint on the S/L calibration above, not a nice-to-have.
- **Settled during implementation (S/L = 6% / 95%, and how the tint is switched on):** `ui-design` calibrated the deferred S/L values and `engine-test.js` now sweeps the whole hue wheel to prove the claim rather than assert it: `--ink` on the tinted background lands between 15.96:1 and 16.21:1 across all 360 degrees, a spread of 0.25:1, so no hue degrades contrast. The tint is switched on with a `data-tint` attribute on `<html>` rather than by making `--bg` an `hsl()` expression permanently, because `hsl(h 6% 95%)` is not `#FBFAF7` at any hue, and this spec requires the page to look exactly as before until a first outfit exists.
- **Also settled during implementation (the one-time explanation):** the first time the background moves on its own, the app says so once through the existing live region ("พื้นหลังจะขยับสีตามชุดที่แนะนำ กดปุ่มกุญแจถ้าอยากให้หยุดที่สีนี้") and remembers that it did (`seenTintNote` in the same storage key), per ux §7B. Locking and unlocking each announce themselves every time, like FR-5's color lock does.

<!-- decided with the user: "Collage Art Style" was undefined in every existing doc; "overlapping cut-out shapes" was picked as the starting interpretation over "keep current tile grid, just re-skin colors" and over "research reference imagery via ui-design before deciding," specifically so this spec can hand a concrete starting direction to ui-design rather than an empty brief -->
<!-- decided with the user: Lock Theme Color locks only the background/theme, not outfit-generation logic, keeping FR-5's existing color lock the single, unambiguous owner of "lock this color for outfit generation" -->

### 4. Color Selection & Filtering UI Upgrade

- **Scope of "View More Colors":** applies to the two existing horizontally-scrolling color-swatch rows that can overflow today: (a) `#colorLockChips` (the "วันนี้อยากใส่สีอะไร?" row, FR-5 Color-first), and (b) the color-preset picker shown when adding/editing a garment (`PRESET_COLORS` swatches in the wardrobe form). A "ดูสีเพิ่มเติม" button is appended at the trailing end of each row.
- **The two entry points group different data, on purpose.** (a) groups only colors actually present in the wardrobe, same as before: it answers "what do I already own." (b) groups the full `PRESET_COLORS` palette regardless of ownership: it answers "what could this new garment be," and restricting it to owned colors would leave it empty for exactly the users who need it most, a new or nearly-empty wardrobe. This was a real gap in the first draft of this spec, flagged and fixed with the user.
- **Color Tone Grouping View:** tapping "ดูสีเพิ่มเติม" opens a modal listing tone groups, reusing the existing `colorNameTH()` bucket vocabulary as the grouping key (no new taxonomy invented), for example the "น้ำตาล" (Brown) bucket. Tapping a group expands it to show every distinct shade in that bucket, drawn from whichever source the bullet above assigns to that entry point (wardrobe garments for (a), the full preset palette for (b)); a bucket with nothing in its source simply doesn't appear. Selecting a shade behaves exactly like selecting it from the row it was opened from (locks it for Color-first, or sets it as the garment's color in the add/edit form).
- **Data source, not a new one:** no new color-classification function is introduced; this is a UI grouping layer over the existing `colorNameTH()` output plus the wardrobe's existing garment color list.
- **Fixed during implementation (the group list and shade order):** `colorNameTH()` returns names at shade granularity ("น้ำเงินหม่น", "แดงเข้ม"), which is too fine to be a group key, so grouping strips the modifier (อ่อน/เข้ม/หม่น) and folds the special names into a parent, giving a fixed list of 10 groups: `ขาว-เทา-ดำ`, `เบจ-น้ำตาล`, `แดง`, `ส้ม`, `เหลือง`, `เขียว`, `ฟ้า`, `น้ำเงิน`, `ม่วง`, `ชมพู`. Every word still comes from the existing vocabulary, so nothing new was invented. Shades inside a group are sorted light to dark rather than left in wardrobe insertion order, so the same source always produces the same view.
- **Also fixed during implementation (the modal mechanism):** the view is a real `<dialog>` opened with `showModal()`, which supplies the focus trap, Escape handling and focus return that this decision requires, instead of a hand-built overlay that would have to reimplement all three.

### 5. Garment Display UI/UX Redesign

- **Shares the Collage Art Style visual system from §3 above** rather than being a separate design language: both the outfit-recommendation cards (main spec §7B tiles) and the wardrobe listing (UI doc §3.5) get redesigned together so the "same shape, different color" comparison principle (main spec §7B) still holds across both surfaces.
- **Accessibility carries over unchanged:** every redesigned tile still pairs its shape+color swatch with a category label and color name/hex text, per the existing "never communicate via color alone" rule (main spec §9 / UI doc a11y section). This constrains whatever visual redesign `ui-design` produces; it isn't optional polish.
- **All 5 categories (top/bottom/outer/shoes/accessory) get the same redesign pass**: no category is treated as a special case, keeping the shape-registry contract (`shapeId` permanence, main spec §6) untouched; this is a rendering/layout change, not a data-model change.
- **Narrowed during implementation (where the labels live and how many columns):** with shapes overlapping, a label attached to a shape is covered by the next shape, so every label (category, garment name, color name, hex) moved into one `CollageLegend` row list under the stack, and the shapes themselves carry no text at all. The legend stays a single column at every width, not two columns at md/lg as the UI doc's responsive table proposed: the card is at most 480px wide, and two columns truncated garment names with an ellipsis, which breaks the "every item keeps a readable name and hex" rule this decision depends on. The swap buttons live in the legend rows too, so they can never be covered by an overlapping shape.
- **Cards with missing categories collapse their empty slots.** An outfit that only has, say, outerwear + shoes (valid under Decision #2's new floor) must not leave a visible gap where top/bottom would normally sit; the redesigned layout removes the slot entirely rather than rendering it empty (confirmed with the user; this is the redesign's answer to the layout question Decision #2 deliberately left open).

## Testing Decisions

- **A good test here asserts observable behavior** (examples: a swap actually changes only the targeted category; an outfit with 2 items in non-top/bottom categories is accepted; the dynamic background actually changes hue after regenerate and stops after lock; the tone-group modal shows only owned hexes from entry point (a) and the full preset palette from entry point (b)), not implementation details like specific probability constants or internal function names.
- **Reuse the existing seams, don't add new ones** (per this project's established pattern, confirmed with the user before writing this spec):
  - `tests/engine-test.js`: pure-logic coverage with no browser. The new flexible-combination sampler, the generalized FR-5 "any category" lock-match rule, the generalized Insufficient-Data condition, and the tone-group bucketing function all get asserted here first (this project's existing TDD convention; see `docs/working-guidelines.md`).
  - `tests/ac-test.js`: updated/extended with new AC-level browser assertions for swap recommendation badge, swap visible on every card in a batch, "View more colors" modal open/expand/select flow (both entry points), Lock Theme Color button behavior, and the generalized Insufficient-Data/No-Match copy.
  - `tests/a11y-test.js`: every dark-mode-specific assertion (theme toggle, dark token contrast pairs) gets **removed**, not just left green by accident; new assertions cover contrast of the dynamic background across a sampled range of hues (this is the test suite's replacement for "check both themes" now that there's only one).
  - `tests/regress.js`: the 700-batch invariant sweep needs its per-outfit "has top and bottom" assertion relaxed to the new "has >= 2 items" invariant; this is the highest-leverage regression check for the flexible-generation change since it already runs every mode × occasion combination.
  - `tests/browser-test.js`: screenshot-based acceptance for the new visual system (Collage Art Style cards, dynamic-background states, redesigned wardrobe tiles); prior art for this exact pattern is the phase 1-3 screenshot verification already in this file.
- **New assertions from the grill-with-docs follow-up round:** swap ring filtered to the locked color when its category is the outfit's only holder of that color, and disabled with a hint when that filter leaves zero candidates (`ac-test.js`); a card missing a category renders no empty slot for it (`browser-test.js`); the two "View more colors" entry points genuinely draw from different sources, wardrobe-only for (a) and the full preset palette for (b) (`ac-test.js`).
- **Prior art:** this mirrors exactly how FR-4/FR-5 were built this project (TDD in `engine-test.js` first, then real-browser verification via Playwright-core at `/opt/pw-browsers/chromium`, full 7-suite green before any publish). No new test tooling or pattern is being introduced.

## แผนเฟส (Delivery Phases)

ยึดหลักเดิมของโปรเจกต์ (main spec §8): ส่งมอบทีละเฟส แต่ละเฟสใช้งานได้จริงด้วยตัวเอง ไม่ต้องรอเฟสถัดไปมาต่อ

### เฟส A: Flexible Outfit Generation (รากฐาน engine)
- **ขอบเขต:** Implementation Decisions หัวข้อ 2 ทั้งหมด (เลิกกฎบน+ล่าง, ขยายนิยาม FR-5 core item, ขยาย Insufficient Data/No-Match, ปรับ invariant ใน `regress.js`)
- **ทำไมอยู่เฟสแรก:** เป็นการเปลี่ยน engine ที่ลึกและกระทบวงกว้างที่สุด (กระทบ FR-1/FR-5 ที่มีอยู่แล้ว) ทำให้เสร็จและเขียวก่อน เพื่อให้ทุกเฟสหลังจากนี้ build บนพฤติกรรม engine ใหม่ตั้งแต่ต้น ไม่ต้อง retrofit ทีหลัง (ตามที่ระบุใน Further Notes)
- **ใช้งานได้จริงทันทีที่จบเฟส:** คนที่มีของไม่ครบบน+ล่างเริ่มได้คำแนะนำ โดยยังไม่ต้องรอ UI ใหม่ใดๆ
- **เทสต์หลัก:** `engine-test.js`, `regress.js`, ส่วน AC ที่เกี่ยวกับ Insufficient Data/No-Match ใน `ac-test.js`

### เฟส B: Swap One Item Expansion
- **ขอบเขต:** Implementation Decisions หัวข้อ 1 ทั้งหมด (badge แนะนำ, สีแนะนำเมื่อวนของในตู้หมด, ใช้ได้ทุกการ์ดในแบตช์)
- **ทำไมอยู่หลังเฟส A:** swap ใช้ `buildOutfit()`/ตู้จริงชุดเดียวกับ engine ที่เพิ่งยืดหยุ่นขึ้น เอาไปต่อยอดตอนพฤติกรรม generation คงที่แล้วจะชัวร์กว่า และยังเป็นงาน logic-heavy เหมือนเฟส A จึงจัดกลุ่มไว้ด้วยกันก่อนเข้าเฟสที่เป็นภาพ
- **ใช้งานได้จริงทันทีที่จบเฟส:** ปุ่ม 🔄 ฉลาดขึ้นและใช้ได้ทุกการ์ด โดยยังเป็นดีไซน์เดิม
- **เทสต์หลัก:** `ac-test.js` (swap AC ใหม่), `a11y-test.js` (touch target ของปุ่มที่โผล่เพิ่มทุกการ์ด)

### เฟส C: Visual & Theme System
- **ขอบเขต:** Implementation Decisions หัวข้อ 3 ทั้งหมด (ทิศทาง Collage Art Style, เอา role vocabulary ออกจาก UI copy, เลิก dark mode, ธีมพื้นหลังไดนามิก + ปุ่มล็อก)
- **ทำไมอยู่เฟสนี้:** เป็นงาน visual-system-level ที่หัวข้อ 5 (garment redesign) ต้องพึ่งพา จึงต้องปิดทิศทาง/โทเคนให้นิ่งก่อน (งานย่อยของ `ui-design`/`design-system` ตามที่ระบุใน Implementation Decisions หัวข้อ 3)
- **ใช้งานได้จริงทันทีที่จบเฟส:** แอปทั้งตัวเปลี่ยนหน้าตาเป็น Collage Art Style ครบ, dark mode หายไป, ธีมขยับ/ล็อกได้ แม้ garment tile ยังเป็นเลย์เอาต์เดิม
- **เทสต์หลัก:** `a11y-test.js` (คอนทราสต์ของธีมไดนามิก, ลบเทสต์ dark mode เดิมทิ้ง), `browser-test.js` (สกรีนช็อตยืนยันภาพใหม่)

### เฟส D: Color Selection UI + Garment Display Redesign
- **ขอบเขต:** Implementation Decisions หัวข้อ 4 และ 5 ทั้งหมด (ปุ่ม "ดูสีเพิ่มเติม" + มุมมองจัดกลุ่มตามโทนสี, รีดีไซน์การ์ด/ตู้เสื้อผ้าทุกหมวด)
- **ทำไมอยู่เฟสสุดท้าย:** หัวข้อ 5 ประกาศไว้ชัดเจนว่าใช้ระบบภาพเดียวกับเฟส C จึงต้องรอโทเคน/ทิศทางจากเฟส C นิ่งก่อน ส่วนหัวข้อ 4 ไม่ผูกกับ C โดยตรง แต่รวมไว้เฟสเดียวกันเพราะเป็นงาน UI ล้วนเหมือนกัน ไม่มี engine เปลี่ยนแล้วในจุดนี้ และควรสร้างด้วยภาษาภาพของเฟส C ไปเลยรอบเดียว ไม่ต้องทำสองรอบ
- **ใช้งานได้จริงทันทีที่จบเฟส:** ครบทุกข้อในคำขอเดิม ระบบภาพสอดคล้องกันทั้งแอป
- **เทสต์หลัก:** `ac-test.js` (modal flow ทั้งสองทางเข้า), `browser-test.js` (สกรีนช็อต garment tile ทุกหมวด), `a11y-test.js` (ป้ายชื่อสี/hex ยังอยู่ครบตามกฎ "ไม่สื่อด้วยสีอย่างเดียว")

## Out of Scope

- **Idea mode does not gain a swap control.** Only the wardrobe-mode swap is being expanded (per-card, recommendation badge); idea mode still has no owned items to cycle through and this spec does not introduce an "idea reroll" concept (that was explicitly declined in the phase 2 plan and nothing here changes that reasoning).
- **No minimum-item-count of less than 2.** A wardrobe with exactly 1 garment still gets Insufficient Data, not a fabricated single-item "outfit."
- **Collage Art Style's exact pixel/token spec is not fixed by this document**: direction only (overlapping cut-out shapes, no role-name copy). Token values, exact overlap/z-index rules, and the dynamic-tint S/L calibration are `ui-design`/`design-system` work that follows this spec.
- **No migration of previously persisted `state.theme` values.** Existing localStorage entries from before this change are simply unread going forward; no upgrade path, no warning banner. This key becomes inert.
- **No new garment categories, no season/weather/skin-tone logic, no live AI-generated advice, no backend/login**: all carried over unchanged from the main spec's Non-goals (§2).
- **Entry point (a) of the tone-group modal does not include colors from `PRESET_COLORS` that aren't currently owned**: it only ever shows real garment colors, consistent with this project's "no fabricated data" discipline (FR-4 AC5, FR-4 delta notes in `PROJECT_STATE.md`). Entry point (b) is the deliberate exception (see Decision #4): it shows the full preset palette regardless of ownership, since that's the whole point of grouping colors while picking a new garment's color.

## Further Notes

- Three points in the original request were undefined against this project's existing docs and were resolved with the user before writing this spec (each is also flagged inline above where it matters):
  1. How rigid the new minimum item-count floor should be → **>= 2 items, any categories** (not zero-minimum).
  2. What "Collage Art Style" means, since it was never defined anywhere in this codebase → **overlapping cut-out garment shapes**, as a starting direction for `ui-design` to develop, not a finished spec.
  3. What "Lock Theme Color" freezes → **background/theme tint only**, kept separate from FR-5's existing outfit-color lock.
- This spec deliberately does **not** re-derive the Color Role engine (main spec §4.7). Primary/Secondary/Neutral/Accent keep governing outfit generation internally exactly as before; everything in §3 above is a display-layer change only.
- Recommended sequencing for whoever implements this: engine changes (flexible combination + generalized FR-5 rule) and their `engine-test.js` coverage first (mirrors how FR-4/FR-5 were built), since the visual redesign (Collage Art Style, dynamic theme, tone-grouping modal) is easiest to build against outfit data that already reflects the new flexible-category shape rather than retrofitting it in afterward.

