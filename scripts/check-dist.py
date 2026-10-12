"""Fail when the built site contains script the CSP would block or unreferenced images.

The CSP allows only same-origin script files, so inline scripts, inline event handlers, and
javascript: URLs must never reach dist/. Unreferenced images are source photos that Astro copies
with their original metadata; the prune-unused-images integration must have removed them.
"""

import sys
from html.parser import HTMLParser
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / "dist"
# Data blocks are never executed, so the CSP does not apply to them.
DATA_SCRIPT_TYPES = {"application/ld+json", "application/json"}
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".tiff"}
TEXT_SUFFIXES = {".html", ".css", ".js", ".xml", ".json", ".txt"}


class Checker(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.problems: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "script" and "src" not in values and values.get("type") not in DATA_SCRIPT_TYPES:
            self.problems.append(f"inline <script> at line {self.getpos()[0]}")
        for name, value in attrs:
            if name.startswith("on"):
                self.problems.append(f"inline handler {name} on <{tag}> at line {self.getpos()[0]}")
            if value and value.strip().lower().startswith("javascript:"):
                self.problems.append(f"javascript: URL in {name} at line {self.getpos()[0]}")


def main() -> int:
    pages = sorted(DIST.rglob("*.html"))
    if not pages:
        print(f"No HTML files in {DIST}; run the build first.", file=sys.stderr)
        return 1
    failed = False
    for page in pages:
        checker = Checker()
        checker.feed(page.read_text(encoding="utf-8"))
        for problem in checker.problems:
            failed = True
            print(f"{page.relative_to(DIST)}: {problem}", file=sys.stderr)
    if failed:
        print("The CSP blocks inline script; move it into a bundled <script> file.", file=sys.stderr)
        return 1

    corpus = "\n".join(
        path.read_text(encoding="utf-8")
        for path in DIST.rglob("*")
        if path.is_file() and path.suffix in TEXT_SUFFIXES
    )
    unreferenced = [
        path.relative_to(DIST)
        for path in (DIST / "_astro").rglob("*")
        if path.suffix.lower() in IMAGE_SUFFIXES and path.name not in corpus
    ]
    for path in unreferenced:
        print(f"{path}: unreferenced image, may keep original metadata", file=sys.stderr)
    if unreferenced:
        return 1
    print(f"Checked {len(pages)} pages: no inline script or unreferenced images.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
