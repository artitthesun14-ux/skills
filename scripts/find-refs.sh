#!/usr/bin/env bash
set -euo pipefail

# Searches for references to a skill name across the locations CLAUDE.md's
# Cross-References section requires checking whenever a skill's name, path,
# invocation mode, or promotion status changes:
#   README.md, .claude-plugin/plugin.json, .agents/, docs/, skills/
# (skills/ also covers each skill's own agents/openai.yaml and any mention of
# the name in ask-matt's router prose, since both live under skills/.)
# If that list in CLAUDE.md ever changes, update the PATHS array below to match.
#
# This is a report, not a gate: it always exits 0. A hit doesn't mean
# something is wrong, and no hits doesn't mean nothing needs updating.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

PATHS=(README.md .claude-plugin/plugin.json .agents docs skills)

usage() {
  echo "usage: $(basename "$0") <skill-name>" >&2
  echo "       $(basename "$0") <old-name> <new-name>   # rename check" >&2
  exit 1
}

search() {
  local name="$1"
  echo "== references to '$name' =="
  local found=0
  for p in "${PATHS[@]}"; do
    [ -e "$p" ] || continue
    if grep -rn --fixed-strings -- "$name" "$p" --exclude-dir=node_modules 2>/dev/null; then
      found=1
    fi
  done
  if [ "$found" -eq 0 ]; then
    echo "(no references found)"
  fi
  echo
}

case "$#" in
  1)
    search "$1"
    ;;
  2)
    echo "-- rename check: '$1' -> '$2' --"
    echo
    echo "old name (anything below should have been updated to the new name):"
    search "$1"
    echo "new name (confirm it landed in README.md / plugin.json / docs if promoted):"
    search "$2"
    ;;
  *)
    usage
    ;;
esac
