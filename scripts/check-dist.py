"""Fail when the built site contains script that the CSP would block.

The CSP allows only same-origin script files, so inline scripts, inline event handlers, and
javascript: URLs must never reach dist/.
"""

import sys
from html.parser import HTMLParser
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / "dist"
# Data blocks are never executed, so the CSP does not apply to them.
DATA_SCRIPT_TYPES = {"application/ld+json", "application/json"}


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
    print(f"Checked {len(pages)} pages: no inline script.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
