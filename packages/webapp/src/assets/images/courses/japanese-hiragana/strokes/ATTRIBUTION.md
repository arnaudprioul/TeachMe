# KanjiVG attribution

The hiragana stroke-order SVGs in this directory are derived from the
**KanjiVG** project by Ulrich Apel and contributors:

  https://kanjivg.tagaini.net/
  https://github.com/KanjiVG/kanjivg

Each file was downloaded from the project's `kanji/` directory at the
Unicode codepoint corresponding to its glyph (e.g. `0x3042.svg` for あ),
then preprocessed locally to remove the inline `kvg:` namespace and
DOCTYPE declarations and to apply the CSS class names our
`StrokeAnimation` component targets (`kana-strokes`, `stroke-number`).

The original copyright header is preserved at the top of every file.

## License

KanjiVG is distributed under the **Creative Commons Attribution-Share
Alike 3.0 license**:

  https://creativecommons.org/licenses/by-sa/3.0/

Per the licence terms:

- **Attribution** — credit goes to Ulrich Apel and the KanjiVG project.
- **Share Alike** — any adaptation of these files (including the
  preprocessed versions in this directory) must be distributed under
  the same CC-BY-SA 3.0 licence.

If TeachMe is shipped or redistributed in any form, this attribution
notice must travel with it. The KanjiVG website link must remain
accessible to end users.

## Regenerating the files

The files were produced by the script `scripts/fetch-kanjivg.sh` (kept
in the project root once we move it out of `/tmp`). The script downloads
each SVG from the upstream repo, runs it through
`scripts/preprocess-kvg.py`, and writes the result to this directory
under the gojuon-ordered filename `{nn}_{id}.svg`.
