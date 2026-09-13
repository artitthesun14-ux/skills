# 04: Calibrate neutral / vivid / harmony-angle thresholds from real output

**What to build:** `NEUTRAL_MAX_S`, `VIVID_MIN_S`, and each harmony rule's angle window in `RULE_SPECS` were set as initial guesses "to be tuned from real results". Measure the actual neutral/vivid split and rule distribution produced by both modes, confirm the thresholds produce sensible output (or adjust them if measurement shows a problem), and record the measured rationale in spec §9 so these stop being open guesses.

**Blocked by:** 01 (the rule-variety fix changes how rules are labelled in idea mode, so measuring rule distribution before it lands would measure the wrong thing).

**Status:** ready-for-agent

- [ ] Neutral/vivid classification split and rule distribution measured against real generated output.
- [ ] Thresholds either confirmed with recorded rationale or adjusted with the change justified, in spec §9.
- [ ] Any threshold change keeps the full 7-suite test run green.
- [ ] Open item struck from `PROJECT_STATE.md` §5.
