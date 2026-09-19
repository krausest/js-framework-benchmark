#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
results_dist="$script_dir/webdriver-ts-results/dist"
pages_repo="$script_dir/../krausest.github.io"
pages_site="$pages_repo/js-framework-benchmark"

# Build both pages before publishing. Keep the archived result pages and assets.
for file in index.html overview.html sitemap.xml llms.txt; do
  if [ ! -f "$results_dist/$file" ]; then
    echo "Missing $file. Run npm --prefix webdriver-ts-results run build first." >&2
    exit 1
  fi
done

cp "$results_dist/index.html" "$pages_site/current.html"
cp "$results_dist/overview.html" "$pages_site/index.html"
cp "$results_dist/sitemap.xml" "$results_dist/llms.txt" "$pages_site/"

git -C "$pages_repo" add -- js-framework-benchmark/current.html js-framework-benchmark/index.html \
  js-framework-benchmark/sitemap.xml js-framework-benchmark/llms.txt

# Include both page styles and every generated chunk, including lazy-loaded charts.
for asset in "$results_dist"/*.js "$results_dist"/*.css; do
  [ -f "$asset" ] || continue
  cp "$asset" "$pages_site/"
  git -C "$pages_repo" add -- "js-framework-benchmark/$(basename "$asset")"
done

# robots.txt belongs at the host root. Merge the template manually; see docs/WEBSITE.md.
git -C "$pages_repo" commit -m "update results and website"
git -C "$pages_repo" push
