#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
results_dist="$script_dir/webdriver-ts-results/dist"
pages_repo="$script_dir/../krausest.github.io"
pages_site="$pages_repo/js-framework-benchmark"

# Publishes a development snapshot as current.html. The overview (index.html), sitemap.xml and
# llms.txt are only published by an official release: npm --prefix webdriver-ts-results run release
if [ ! -f "$results_dist/index.html" ]; then
  echo "Missing index.html. Run npm --prefix webdriver-ts-results run build first." >&2
  exit 1
fi

cp "$results_dist/index.html" "$pages_site/current.html"
git -C "$pages_repo" add -- js-framework-benchmark/current.html

# Include the page styles and every generated chunk, including lazy-loaded charts.
for asset in "$results_dist"/*.js "$results_dist"/*.css; do
  [ -f "$asset" ] || continue
  cp "$asset" "$pages_site/"
  git -C "$pages_repo" add -- "js-framework-benchmark/$(basename "$asset")"
done

git -C "$pages_repo" commit -m "update results snapshot"
git -C "$pages_repo" push
