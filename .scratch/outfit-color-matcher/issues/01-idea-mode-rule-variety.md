# 01: Idea mode shows a real mix of all 5 harmony rules

**What to build:** In "สีที่เราแนะนำ" (idea) mode, the batch of looks shown to the user should reflect all five harmony rules over time (monochrome, analogous, complementary, triadic, neutral-accent), not collapse to almost only triadic + neutral-accent. `generateIdeaBatch()` already picks a rule per look and builds the colors to match it; the fix is to trust that chosen rule as the look's `ruleUsed` label rather than re-deriving it via `detectHarmony()`, which is confused by the always-present Accent sitting far from Primary. `detectHarmony()` stays untouched so wardrobe mode is unaffected.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] `buildOutfit()` accepts an optional chosen-rule argument; when given, the look's `ruleUsed` and advice use it while the score still uses the measured clarity.
- [ ] `generateIdeaBatch()` passes each look's chosen rule through.
- [ ] `detectHarmony()` is unchanged; wardrobe-mode tests still pass.
- [ ] A distribution regression test asserts that across many idea batches all five rules appear and none dominates to near-total.
- [ ] Full 7-suite test run stays green.
