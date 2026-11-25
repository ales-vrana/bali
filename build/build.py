#!/usr/bin/env python3
"""Builds the two language versions of the landing page.

Usage:  python3 build/build.py
Output: index.html (English) and id/index.html (Bahasa Indonesia)

Edit the texts in build/content.py, then run this script and commit the result.
"""
from pathlib import Path
from string import Template
from urllib.parse import quote

from content import SHARED, LANGS

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = Template((Path(__file__).parent / "template.html").read_text(encoding="utf-8"))


def lang_switch(code: str) -> str:
    items = []
    for other, data in LANGS.items():
        label = data["lang_label"]
        if other == code:
            items.append(f'<span aria-current="true">{label}</span>')
        else:
            items.append(f'<a href="{data["path"]}" lang="{other}" hreflang="{other}">{label}</a>')
    return "\n".join(items)


def build() -> None:
    for code, data in LANGS.items():
        values = dict(SHARED)
        values.update(data)
        values["lang"] = code
        values["lang_switch"] = lang_switch(code)
        values["canonical"] = SHARED["site_url"] + data["path"]
        values["wa_url"] = (
            f'https://wa.me/{SHARED["wa_number"]}?text=' + quote(data["wa_message"], safe="")
        )
        html = TEMPLATE.substitute(values)
        out = ROOT / data["file"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, encoding="utf-8")
        print(f"built {out.relative_to(ROOT)} ({len(html):,} chars)")


if __name__ == "__main__":
    build()
