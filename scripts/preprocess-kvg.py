#!/usr/bin/env python3
"""
Preprocess a raw KanjiVG SVG (read from stdin) into the form our
StrokeAnimation component expects:

  - drop the inline DOCTYPE block (the kvg: namespace declaration
    confuses some HTML parsers when injected via v-html)
  - drop the xmlns:kvg attribute (we don't need it without the DTD)
  - drop every kvg:* attribute (purely informational)
  - rename the StrokePaths group id to a class our CSS targets (.jamo)
  - rename the StrokeNumbers group id to a class our CSS targets
    (.stroke-number)
  - drop any remaining kvg:* ids (no css target, just clutter)

Writes the result to stdout. The big copyright comment header is
preserved unchanged for CC-BY-SA attribution compliance.
"""
import sys
import re

raw = sys.stdin.read()

# Drop the inline DOCTYPE block (everything from <!DOCTYPE up to the first ]>).
raw = re.sub(r"<!DOCTYPE[^>]*\[[\s\S]*?\]>\s*", "", raw)

# Drop the kvg: namespace declaration on the root <svg>.
raw = re.sub(r'\s*xmlns:kvg="[^"]*"', "", raw)

# Drop every kvg:* attribute.
raw = re.sub(r'\s+kvg:[a-zA-Z]+="[^"]*"', "", raw)

# Tag the stroke paths group with a class our scoped CSS targets via
# :deep(). We use `kana-strokes` (NOT `jamo`) because KanjiVG paths are
# brush-like center-lines and the StrokeAnimation component needs to
# stroke them, whereas the Korean Hangeul SVGs use `class="jamo"` for
# filled-silhouette paths. Distinct classes let the same component
# render both formats without ambiguity.
#
# Also strip the inline `style="…"` attributes that KanjiVG sets on
# these groups (`fill:none;stroke:#000` for the strokes,
# `font-size:8;fill:#808080` for the numbers) because inline styles win
# over scoped CSS — we want our component CSS to control colour and
# stroke width, not the upstream defaults.
raw = re.sub(
    r'id="kvg:StrokePaths_[0-9a-fA-F]+"\s*style="[^"]*"',
    'class="kana-strokes"',
    raw,
)
raw = re.sub(
    r'id="kvg:StrokeNumbers_[0-9a-fA-F]+"\s*style="[^"]*"',
    'class="stroke-number"',
    raw,
)
# Permissive second pass in case the attribute order is reversed or
# only one of them is present.
raw = re.sub(r'id="kvg:StrokePaths_[0-9a-fA-F]+"', 'class="kana-strokes"', raw)
raw = re.sub(r'id="kvg:StrokeNumbers_[0-9a-fA-F]+"', 'class="stroke-number"', raw)

# Drop any remaining kvg: ids (purely cosmetic, no css target).
raw = re.sub(r'\s*id="kvg:[^"]*"', "", raw)

sys.stdout.write(raw)
