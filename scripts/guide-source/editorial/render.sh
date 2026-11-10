#!/bin/zsh
# usage: render.sh in.html out.pdf
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer --virtual-time-budget=3000 \
  --user-data-dir=/Volumes/SanDisk/AEE/video-work/tmp/chrome-guide --print-to-pdf="$2" "file://$1" >/dev/null 2>&1
