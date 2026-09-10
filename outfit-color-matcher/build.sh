#!/usr/bin/env bash
# ห่อ app.html (รูปแบบ artifact: ไม่มี doctype/head/body) ให้เป็นไฟล์ .html ที่เปิดตรงๆ ได้
# แหล่งความจริงมีไฟล์เดียวคือ app.html
set -euo pipefail
cd "$(dirname "$0")"
{
  printf '%s\n' '<!doctype html>' '<html lang="th">' '<head>' \
    '<meta charset="utf-8">' \
    '<meta name="viewport" content="width=device-width, initial-scale=1">' \
    '<style>:root{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>' \
    '</head>' '<body>'
  cat app.html
  printf '%s\n' '</body>' '</html>'
} > outfit-color-matcher.html
echo "built outfit-color-matcher.html ($(wc -c < outfit-color-matcher.html) bytes)"
