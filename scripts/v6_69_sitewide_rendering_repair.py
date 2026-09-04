#!/usr/bin/env python3
"""UtilityDesk V6.69 sitewide rendering/inventory repair helpers.

The deployed HTML contains a small legacy-generation corruption (`n literals,
missing opening angle brackets on section tags, and UTF-8 mojibake). This
script is also kept as a deterministic audit/repair utility for future builds.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MARKERS = ("â", "Ã", "Â", "ð", "�")

def repair_text(value: str) -> str:
    value = value.replace("`n", "\n")
    value = re.sub(r'(?<![<\\])section\s+class\s*=\s*(["\'])', r'<section class=\1', value)
    if any(c in value for c in MARKERS):
        try:
            fixed = value.encode("cp1252").decode("utf-8")
            if sum(fixed.count(c) for c in MARKERS) < sum(value.count(c) for c in MARKERS):
                value = fixed
        except (UnicodeEncodeError, UnicodeDecodeError):
            pass
    return value

changed = 0
for path in ROOT.rglob("*.html"):
    if any(part in {".git", "node_modules"} for part in path.parts):
        continue
    original = path.read_text(encoding="utf-8")
    fixed = repair_text(original)
    if fixed != original:
        path.write_text(fixed, encoding="utf-8")
        changed += 1
print(f"Repaired HTML files: {changed}")
