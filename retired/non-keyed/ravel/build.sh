#!/bin/sh

set -e

rustup target add wasm32-unknown-unknown

trunk build --release
mv bundled-dist/index.html index.html
