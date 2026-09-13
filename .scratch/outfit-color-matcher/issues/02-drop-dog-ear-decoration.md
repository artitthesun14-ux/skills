# 02: Drop the dog-ear card corner and clean the docs

**What to build:** The optional "มุมตัด (dog-ear)" card-corner decoration has sat undecided in the docs since phase 1 and was never implemented (no `clip-path` on `.card` in the app). Formally drop it: remove the dog-ear description and any "optional / not decided" language from the UI and spec docs so the docs match the shipped card, which has a plain rounded corner.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Dog-ear references removed from `docs/ui-outfit-color-matcher.md` and `docs/spec-outfit-color-matcher.md`.
- [ ] No code change (the app never had it).
- [ ] Open item struck from `PROJECT_STATE.md` §5.
