#!/bin/zsh
# usage: render_loc.sh loc...  → out/famed-study-guide-<loc>.pdf + fit report
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for l in "$@"; do
  f="$PWD/out/famed-study-guide-$l.html"
  ./render.sh "$f" "$PWD/out/famed-study-guide-$l.pdf"
  echo "$l $("$CH" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=4000 --user-data-dir=/Volumes/SanDisk/AEE/video-work/tmp/chrome-guide --window-size=794,1123 --dump-dom "file://$f" 2>/dev/null | grep -o 'data-fit="[^"]*"')"
done
