#!/bin/bash

set -ex

pkill -f /home/michael/.esy/3__________________________________________________________________/i/opam__s__js__of__ocaml_compiler-opam || true;
# esy @esy install
# esy @esy b refmterr dune build --root . -j 3 #--verbose
# esy @esy b refmterr dune build --root . -j 3 --verbose --profile release
# esy @esy run
npm run build-dev
