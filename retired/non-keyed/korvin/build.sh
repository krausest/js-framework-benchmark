#!/usr/bin/env bash

set -e

rm ./*.js || true
rm ./*.wasm || true
trunk build --release --filehash false --dist ./dist ./template.html
cp ./dist/*.js ./
cp ./dist/*.wasm ./
# cp ./dist/index.html ./index.html
