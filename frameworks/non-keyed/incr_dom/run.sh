#!/bin/bash

set -ex

pkill -f /home/michael/.esy/3__________________________________________________________________/i/opam__s__js__of__ocaml_compiler-opam || true;
esy install
esy b refmterr dune build --root . -j 3 #--verbose
esy run
