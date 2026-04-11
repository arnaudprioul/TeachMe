#!/usr/bin/env bash
#
# Fetch KanjiVG SVGs for the 46 base hiragana and 46 base katakana,
# preprocess them via the colocated `preprocess-kvg.py`, and write
# them as `{nn}_{id}.svg` into the right strokes/ directory.
#
# Source:  https://github.com/KanjiVG/kanjivg
# License: CC-BY-SA 3.0 (see ATTRIBUTION.md in each strokes/ dir)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WEBAPP="$REPO_ROOT/packages/webapp"
HIRAGANA_DIR="$WEBAPP/src/assets/images/courses/japanese-hiragana/strokes"
KATAKANA_DIR="$WEBAPP/src/assets/images/courses/japanese-katakana/strokes"
PRE="$SCRIPT_DIR/preprocess-kvg.py"

mkdir -p "$HIRAGANA_DIR" "$KATAKANA_DIR"

# Each entry is "{nn} {id} {hex_codepoint}". The leading number matches
# the gojuon ordering used by characters.ts, so the directory listing
# stays in the canonical order.
HIRAGANA=(
  "01 a    3042" "02 i    3044" "03 u    3046" "04 e    3048" "05 o    304a"
  "06 ka   304b" "07 ki   304d" "08 ku   304f" "09 ke   3051" "10 ko   3053"
  "11 sa   3055" "12 shi  3057" "13 su   3059" "14 se   305b" "15 so   305d"
  "16 ta   305f" "17 chi  3061" "18 tsu  3064" "19 te   3066" "20 to   3068"
  "21 na   306a" "22 ni   306b" "23 nu   306c" "24 ne   306d" "25 no   306e"
  "26 ha   306f" "27 hi   3072" "28 fu   3075" "29 he   3078" "30 ho   307b"
  "31 ma   307e" "32 mi   307f" "33 mu   3080" "34 me   3081" "35 mo   3082"
  "36 ya   3084" "37 yu   3086" "38 yo   3088"
  "39 ra   3089" "40 ri   308a" "41 ru   308b" "42 re   308c" "43 ro   308d"
  "44 wa   308f" "45 wo   3092" "46 n    3093"
)

KATAKANA=(
  "01 a    30a2" "02 i    30a4" "03 u    30a6" "04 e    30a8" "05 o    30aa"
  "06 ka   30ab" "07 ki   30ad" "08 ku   30af" "09 ke   30b1" "10 ko   30b3"
  "11 sa   30b5" "12 shi  30b7" "13 su   30b9" "14 se   30bb" "15 so   30bd"
  "16 ta   30bf" "17 chi  30c1" "18 tsu  30c4" "19 te   30c6" "20 to   30c8"
  "21 na   30ca" "22 ni   30cb" "23 nu   30cc" "24 ne   30cd" "25 no   30ce"
  "26 ha   30cf" "27 hi   30d2" "28 fu   30d5" "29 he   30d8" "30 ho   30db"
  "31 ma   30de" "32 mi   30df" "33 mu   30e0" "34 me   30e1" "35 mo   30e2"
  "36 ya   30e4" "37 yu   30e6" "38 yo   30e8"
  "39 ra   30e9" "40 ri   30ea" "41 ru   30eb" "42 re   30ec" "43 ro   30ed"
  "44 wa   30ef" "45 wo   30f2" "46 n    30f3"
)

fetch_one() {
  local nn=$1 id=$2 hex=$3 outdir=$4
  local url="https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/0${hex}.svg"
  local out="$outdir/${nn}_${id}.svg"
  curl -sSL --max-time 15 "$url" | python3 "$PRE" > "$out"
  if [ ! -s "$out" ]; then
    echo "  ✗ ${nn}_${id} (${hex}) — empty file" >&2
    rm -f "$out"
    return 1
  fi
  printf "  ✓ %s_%-4s (%s)  %d bytes\n" "$nn" "$id" "$hex" "$(wc -c < "$out")"
}

echo "═══ Fetching hiragana into $HIRAGANA_DIR"
for entry in "${HIRAGANA[@]}"; do
  read -r nn id hex <<<"$entry"
  fetch_one "$nn" "$id" "$hex" "$HIRAGANA_DIR" || true
done

echo ""
echo "═══ Fetching katakana into $KATAKANA_DIR"
for entry in "${KATAKANA[@]}"; do
  read -r nn id hex <<<"$entry"
  fetch_one "$nn" "$id" "$hex" "$KATAKANA_DIR" || true
done

echo ""
echo "═══ Done."
echo "    Hiragana files: $(ls "$HIRAGANA_DIR" | wc -l | tr -d ' ')"
echo "    Katakana files: $(ls "$KATAKANA_DIR" | wc -l | tr -d ' ')"
