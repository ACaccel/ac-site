#!/usr/bin/env python3
"""Write a site-file candidate that routes the domain root to ac-site.

The input file is never modified. Deploy replaces the unmanaged placeholder root
location with a marked include block; remove restores the placeholder. Blocks managed
by other projects are left byte-for-byte intact.
"""

import argparse
import re
import sys
from pathlib import Path

HOST = "acserver.csie.org"
MARKER = "# ac-site managed route"
PLACEHOLDER = "    location / { return 404; }\n"
SNIPPETS = {
    "http": "/etc/nginx/snippets/ac-site-http.conf",
    "https": "/etc/nginx/snippets/ac-site.conf",
}

PLACEHOLDER_LINE = re.compile(r"^[ \t]*location / \{ return 404; \}[ \t]*\n", re.MULTILINE)
ROOT_LOCATION = re.compile(r"^[ \t]*location\s+/\s*\{", re.MULTILINE)


class ConfigError(Exception):
    pass


def managed_block(protocol: str) -> str:
    return (
        f"{MARKER} BEGIN {protocol}\n"
        f"    include {SNIPPETS[protocol]};\n"
        f"{MARKER} END {protocol}\n"
    )


def managed_pattern(protocol: str) -> re.Pattern[str]:
    return re.compile(
        rf"^{re.escape(MARKER)} BEGIN {protocol}\n.*?^{re.escape(MARKER)} END {protocol}\n",
        re.MULTILINE | re.DOTALL,
    )


def strip_comments(text: str) -> str:
    return re.sub(r"#[^\n]*", "", text)


def server_blocks(source: str) -> list[tuple[int, int]]:
    """Return (start, end) offsets of top-level server blocks, skipping comments and quotes."""
    blocks: list[tuple[int, int]] = []
    depth = 0
    statement_start = 0
    block_start = -1
    quote = ""
    index = 0
    while index < len(source):
        char = source[index]
        if quote:
            if char == "\\":
                index += 2
                continue
            if char == quote:
                quote = ""
        elif char == "#":
            end = source.find("\n", index)
            index = len(source) if end == -1 else end
            continue
        elif char in "\"'":
            quote = char
        elif char == "{":
            if depth == 0 and strip_comments(source[statement_start:index]).split() == ["server"]:
                block_start = index + 1
            depth += 1
        elif char == "}":
            depth -= 1
            if depth < 0:
                raise ConfigError("Unbalanced closing brace.")
            if depth == 0:
                if block_start != -1:
                    blocks.append((block_start, index))
                    block_start = -1
                statement_start = index + 1
        elif char == ";" and depth == 0:
            statement_start = index + 1
        index += 1
    if depth != 0 or quote:
        raise ConfigError("Unbalanced braces or quotes.")
    return blocks


def server_protocol(body: str) -> str | None:
    """Return the protocol of a server block for HOST, or None for other hosts."""
    text = strip_comments(body)
    names = re.findall(r"^\s*server_name\s+([^;]+);", text, re.MULTILINE)
    if not any(HOST in name.split() for name in names):
        return None
    listens = re.findall(r"^\s*listen\s+([^;]+);", text, re.MULTILINE)
    modes = {"ssl" in listen.split() for listen in listens}
    if len(modes) != 1:
        raise ConfigError(f"A {HOST} server block has missing or mixed listeners.")
    return "https" if modes.pop() else "http"


def update_body(body: str, protocol: str, action: str) -> str:
    pattern = managed_pattern(protocol)
    managed = pattern.findall(body)
    if len(managed) > 1:
        raise ConfigError(f"Duplicate ac-site managed blocks in the {protocol} server.")
    if action == "remove":
        return pattern.sub(lambda _: PLACEHOLDER, body) if managed else body
    if managed:
        result = pattern.sub(lambda _: managed_block(protocol), body)
    else:
        placeholders = PLACEHOLDER_LINE.findall(body)
        if len(placeholders) != 1:
            raise ConfigError(
                f"Expected one '{PLACEHOLDER.strip()}' in the {protocol} server; "
                "review the root location manually."
            )
        result = PLACEHOLDER_LINE.sub(lambda _: managed_block(protocol), body)
    if ROOT_LOCATION.search(strip_comments(result)):
        raise ConfigError(f"Another root location remains in the {protocol} server.")
    return result


def update_site(source: str, action: str) -> str:
    seen: set[str] = set()
    result = source
    # Edit from the end so earlier offsets stay valid.
    for start, end in reversed(server_blocks(source)):
        body = source[start:end]
        protocol = server_protocol(body)
        if protocol is None:
            continue
        if protocol in seen:
            raise ConfigError(f"Multiple {protocol} server blocks for {HOST}.")
        seen.add(protocol)
        result = result[:start] + update_body(body, protocol, action) + result[end:]
    missing = {"http", "https"} - seen
    if missing:
        raise ConfigError(f"No {HOST} server block for: {', '.join(sorted(missing))}.")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--action", choices=["deploy", "remove"], default="deploy")
    args = parser.parse_args()
    try:
        candidate = update_site(args.input.read_text(encoding="utf-8"), args.action)
    except ConfigError as error:
        print(f"configure-nginx: {error}", file=sys.stderr)
        return 1
    args.output.write_text(candidate, encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
