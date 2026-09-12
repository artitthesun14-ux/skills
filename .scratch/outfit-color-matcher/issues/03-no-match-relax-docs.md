# 03: Resolve the No-match "ผ่อนเงื่อนไข" affordance in the docs

**What to build:** The docs (ui §280, ux §56) describe a "ผ่อนเงื่อนไข" (relax constraints) option on the A4 No-match empty state, but it was never built and cannot be built meaningfully: the wardrobe recommender has no hard constraints to relax. It always returns scored candidates whenever a top and a bottom exist, so `noMatch` is only a defensive fallback and the real (implemented) exit is "สลับไปโหมดไอเดีย". Update the docs to describe No-match as a defensive fallback whose only action is switch-to-idea, and remove the "ผ่อนเงื่อนไข" language.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] "ผ่อนเงื่อนไข" removed from `docs/ui-outfit-color-matcher.md` and `docs/ux-outfit-color-matcher.md`; No-match described as a defensive fallback with switch-to-idea as its only action.
- [ ] No code change (matches the current implemented A4 branch).
- [ ] Open item struck from `PROJECT_STATE.md` §5.
