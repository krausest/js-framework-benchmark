#!/bin/sh

set -e

sed -i.bak "s/dioxus_benchmark-.+\.js/dioxus_benchmark.js/g" index.html
sed -i.bak "s/dioxus_benchmark-.+\.wasm/dioxus_benchmark_bg.wasm/g" index.html
rm index.html.bak

HASH=$(uuidgen)
trunk build

echo "$HASH"

mv bundled-dist/dioxus_benchmark.js "bundled-dist/dioxus_benchmark-$HASH.js"
mv bundled-dist/dioxus_benchmark_bg.wasm bundled-dist/dioxus_benchmark-"$HASH"_bg.wasm

sed -i.bak "s/dioxus_benchmark/dioxus_benchmark-$HASH/g" bundled-dist/index.html
rm bundled-dist/index.html.bak

mv bundled-dist/index.html index.html
