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

- **Recommendation surfacing:** `swapItem()` already builds a ring of same-category candidates from the wardrobe, scored by `scoreOf()` against the locked remaining items, and cycles through them in ranked order. Change: expose the **top-ranked candidate** (ring index 0) with a "แนะนำ" (recommended) badge distinct from the rest of the cycle, so the existing ranking becomes visible rather than silent.
- **Suggested color when owned items run out:** when the ring has been fully cycled (or the category has 0-1 owned items), surface up to 2 theoretical suggested colors for that category, reusing the same "color that would extend pairing options" logic already built for FR-4's wardrobe analysis (`analyzeWardrobe()`'s suggestion colors) rather than inventing a second algorithm. These are swatch-only suggestions (no real garment attached). Selecting one does not change the outfit; it's informational, consistent with the "no upsell / no buy-this" tone already established in FR-4 AC4.
- **Available on every card in the batch, not just the focused one:** removes the current `.card--adjacent .tile__swap { display:none }` restriction. Swap becomes usable per-card independent of carousel focus. Tapping a non-focused card's swap control does not bring that card into focus; it swaps in place and the card stays wherever it is in the carousel.
- **Scope stays wardrobe mode only:** idea mode still has no owned items to cycle through, so swap remains hidden there, unchanged from current behavior. This is a deliberate scope line (see Out of Scope).

### 2. Flexible Outfit Generation Logic

- **Drop the rigid top+bottom requirement.** Replace it with: *an outfit is valid if it contains at least 2 items from any combination of categories.* This was confirmed with the user over the alternative of no minimum at all: a single-item "outfit" isn't a matching decision, so 2 is the floor.
- **Combination generation:** `generateWardrobeBatch()` moves from a top×bottom cross-product to independent per-category sampling: for each category present in the wardrobe, include it in a candidate combo with its existing inclusion probability (top/bottom currently implicit at 100%, outer 35%, shoes 85%, accessory 40%; these become explicit, symmetric probabilities per category rather than two mandatory + three optional). Any combo that lands under 2 items is discarded and resampled, capped by the existing `COMBO_CAP` mechanism (spec §7C, "Large wardrobe") so this never hangs on a sparse wardrobe.
- **Insufficient Data state (spec §7C) generalizes:** instead of "missing top" / "missing bottom" messaging, the condition becomes *wardrobe has fewer than 2 total garments*: message updates to name whichever situation is true generically ("เพิ่มอีกอย่างน้อย 1 ชิ้นเพื่อเริ่มจับคู่") rather than naming a specific category.
- **FR-5 Color-first "core item" rule generalizes:** the current AC1 requires the locked color to land on top or bottom specifically (because those were the only guaranteed categories). With no privileged category anymore, AC1 becomes: *the locked color must appear on at least one item, in any category, in the resulting outfit.* No-Match (spec §7C) becomes: wardrobe has zero items in that exact color at all.
- **Color proportion weighting is unchanged** (`CATEGORY_WEIGHT`: top/bottom/outer 30, shoes 7, accessory 3). It already normalizes against whatever categories are actually present (`entries.reduce` over included categories only), so an outerwear+shoes-only outfit still produces a valid 100%-summed breakdown without code changes to that function.
- **Idea mode (FR-5/4.6) is unaffected**: it never depended on top/bottom being real garments in the first place (colors only), so this change is wardrobe-mode-only.
- **Swap's "single item in category" disabled state (spec §7C) is unaffected**: still applies per-category regardless of the new flexible combination rule.

<!-- decided with the user: the alternative read of "flexible generation" (no minimum item count at all, i.e. even a single accessory can be "an outfit") was rejected as not being a real matching decision -->

### 3. Visual & Theme System

- **Design direction ("Collage Art Style"):** was undefined before this spec (only the Rand-inspired off-white/raspberry-red system existed, spec §7A). Decided with the user: garment shapes render as **overlapping, cut-out/collage-style compositions** rather than the current clean grid of isolated square tiles, as the starting visual direction. This is a visual-system-level decision to be worked out in detail by `ui-design`/`design-system` before implementation (this spec fixes the *direction*, not the pixel spec). §7A of the main spec and the UI doc's component inventory (§3.3-3.7) get superseded, not just amended.
- **Remove role vocabulary from user-facing copy.** `ROLE_TH` (สีหลัก/สีรอง/สีกลาง/สีเน้น) currently appears in the proportion bar's legend, segment title, and label text. These become color name + hex + % only, no role word. **The underlying `role` field stays in the data model and engine** (`colorBreakdown[].role`). Color Role (main spec §4.7) is still how the engine picks and balances colors internally; only the *display* of the role taxonomy to the user is removed. This satisfies "define solely as Collage Art Style" without touching the harmony engine.
- **Remove dark mode entirely:** delete the `data-theme` toggle, the `prefers-color-scheme: dark` media block, the dark token set, and the theme-cycle control in the footer. The app becomes single-mode. Any previously persisted `state.theme` value in existing users' localStorage is simply ignored on load (dead key, not migrated); see Out of Scope.
- **Dynamic theme palette:** on every "เจนชุดใหม่" (regenerate) action, derive a new background tint from the newly generated batch's focused-card Primary role color: take that color's hue, then render the background at a **fixed low saturation and fixed high lightness** (a pastel tint of that hue; exact S/L values are a `ui-design` calibration task, not fixed here) so contrast against the `--ink` text token never degrades regardless of which hue is showing. `--ink`, `--accent`, and all data-color swatches stay exactly as-is; only the page background/theme surface shifts.
- **Lock Theme Color button:** freezes the *background/theme tint only*, confirmed with the user over the alternative of also freezing the outfit-generation color logic itself (that's already owned by FR-5's separate "lock a color to build outfits around" feature and must not be conflated with this purely cosmetic lock). When locked, further regenerations stop updating the background tint until unlocked. Persist `themeLocked` + the locked tint alongside existing settings in localStorage (same storage key, same try/catch discipline as spec §7).
- **Accessibility invariant carries over unchanged:** contrast standards from spec §7 apply to the dynamic background exactly as they did to the old light/dark tokens. This is a hard constraint on the S/L calibration above, not a nice-to-have.

<!-- decided with the user: "Collage Art Style" was undefined in every existing doc; "overlapping cut-out shapes" was picked as the starting interpretation over "keep current tile grid, just re-skin colors" and over "research reference imagery via ui-design before deciding," specifically so this spec can hand a concrete starting direction to ui-design rather than an empty brief -->
<!-- decided with the user: Lock Theme Color locks only the background/theme, not outfit-generation logic, keeping FR-5's existing color lock the single, unambiguous owner of "lock this color for outfit generation" -->

### 4. Color Selection & Filtering UI Upgrade

- **Scope of "View More Colors":** applies to the two existing horizontally-scrolling color-swatch rows that can overflow today: (a) `#colorLockChips` (the "วันนี้อยากใส่สีอะไร?" row, FR-5 Color-first), and (b) the color-preset picker shown when adding/editing a garment (`PRESET_COLORS` swatches in the wardrobe form). A "ดูสีเพิ่มเติม" button is appended at the trailing end of each row.
- **Color Tone Grouping View:** tapping "ดูสีเพิ่มเติม" opens a modal listing tone groups, reusing the existing `colorNameTH()` bucket vocabulary as the grouping key (no new taxonomy invented), for example the "น้ำตาล" (Brown) bucket. Tapping a group expands it to show every **distinct hex actually present in the wardrobe** that falls in that bucket (garments only: `PRESET_COLORS` entries not currently owned do not populate a group; a bucket with zero owned garments simply doesn't appear). Selecting a shade behaves exactly like selecting it from the row it was opened from (locks it for Color-first, or sets it as the garment's color in the add/edit form).
- **Data source, not a new one:** no new color-classification function is introduced; this is a UI grouping layer over the existing `colorNameTH()` output plus the wardrobe's existing garment color list.

### 5. Garment Display UI/UX Redesign

- **Shares the Collage Art Style visual system from §3 above** rather than being a separate design language: both the outfit-recommendation cards (main spec §7B tiles) and the wardrobe listing (UI doc §3.5) get redesigned together so the "same shape, different color" comparison principle (main spec §7B) still holds across both surfaces.
- **Accessibility carries over unchanged:** every redesigned tile still pairs its shape+color swatch with a category label and color name/hex text, per the existing "never communicate via color alone" rule (main spec §9 / UI doc a11y section). This constrains whatever visual redesign `ui-design` produces; it isn't optional polish.
- **All 5 categories (top/bottom/outer/shoes/accessory) get the same redesign pass**: no category is treated as a special case, keeping the shape-registry contract (`shapeId` permanence, main spec §6) untouched; this is a rendering/layout change, not a data-model change.

## Testing Decisions

- **A good test here asserts observable behavior** (examples: a swap actually changes only the targeted category; an outfit with 2 items in non-top/bottom categories is accepted; the dynamic background actually changes hue after regenerate and stops after lock; a tone-group modal shows only hexes actually owned), not implementation details like specific probability constants or internal function names.
- **Reuse the existing seams, don't add new ones** (per this project's established pattern, confirmed with the user before writing this spec):
  - `tests/engine-test.js`: pure-logic coverage with no browser. The new flexible-combination sampler, the generalized FR-5 "any category" lock-match rule, the generalized Insufficient-Data condition, and the tone-group bucketing function all get asserted here first (this project's existing TDD convention; see `docs/working-guidelines.md`).
  - `tests/ac-test.js`: updated/extended with new AC-level browser assertions for swap recommendation badge, swap visible on every card in a batch, "View more colors" modal open/expand/select flow (both entry points), Lock Theme Color button behavior, and the generalized Insufficient-Data/No-Match copy.
  - `tests/a11y-test.js`: every dark-mode-specific assertion (theme toggle, dark token contrast pairs) gets **removed**, not just left green by accident; new assertions cover contrast of the dynamic background across a sampled range of hues (this is the test suite's replacement for "check both themes" now that there's only one).
  - `tests/regress.js`: the 700-batch invariant sweep needs its per-outfit "has top and bottom" assertion relaxed to the new "has >= 2 items" invariant; this is the highest-leverage regression check for the flexible-generation change since it already runs every mode × occasion combination.
  - `tests/browser-test.js`: screenshot-based acceptance for the new visual system (Collage Art Style cards, dynamic-background states, redesigned wardrobe tiles); prior art for this exact pattern is the phase 1-3 screenshot verification already in this file.
- **Prior art:** this mirrors exactly how FR-4/FR-5 were built this project (TDD in `engine-test.js` first, then real-browser verification via Playwright-core at `/opt/pw-browsers/chromium`, full 7-suite green before any publish). No new test tooling or pattern is being introduced.

## Out of Scope

- **Idea mode does not gain a swap control.** Only the wardrobe-mode swap is being expanded (per-card, recommendation badge); idea mode still has no owned items to cycle through and this spec does not introduce an "idea reroll" concept (that was explicitly declined in the phase 2 plan and nothing here changes that reasoning).
- **No minimum-item-count of less than 2.** A wardrobe with exactly 1 garment still gets Insufficient Data, not a fabricated single-item "outfit."
- **Collage Art Style's exact pixel/token spec is not fixed by this document**: direction only (overlapping cut-out shapes, no role-name copy). Token values, exact overlap/z-index rules, and the dynamic-tint S/L calibration are `ui-design`/`design-system` work that follows this spec.
- **No migration of previously persisted `state.theme` values.** Existing localStorage entries from before this change are simply unread going forward; no upgrade path, no warning banner. This key becomes inert.
- **No new garment categories, no season/weather/skin-tone logic, no live AI-generated advice, no backend/login**: all carried over unchanged from the main spec's Non-goals (§2).
- **"Wardrobe Colors" grouping does not include colors from `PRESET_COLORS` that aren't currently owned**: the tone-group modal only ever shows real garment colors, consistent with this project's "no fabricated data" discipline (FR-4 AC5, FR-4 delta notes in `PROJECT_STATE.md`).

## Further Notes

- Three points in the original request were undefined against this project's existing docs and were resolved with the user before writing this spec (each is also flagged inline above where it matters):
  1. How rigid the new minimum item-count floor should be → **>= 2 items, any categories** (not zero-minimum).
  2. What "Collage Art Style" means, since it was never defined anywhere in this codebase → **overlapping cut-out garment shapes**, as a starting direction for `ui-design` to develop, not a finished spec.
  3. What "Lock Theme Color" freezes → **background/theme tint only**, kept separate from FR-5's existing outfit-color lock.
- This spec deliberately does **not** re-derive the Color Role engine (main spec §4.7). Primary/Secondary/Neutral/Accent keep governing outfit generation internally exactly as before; everything in §3 above is a display-layer change only.
- Recommended sequencing for whoever implements this: engine changes (flexible combination + generalized FR-5 rule) and their `engine-test.js` coverage first (mirrors how FR-4/FR-5 were built), since the visual redesign (Collage Art Style, dynamic theme, tone-grouping modal) is easiest to build against outfit data that already reflects the new flexible-category shape rather than retrofitting it in afterward.

