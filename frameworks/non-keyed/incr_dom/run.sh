#!/bin/bash

set -ex

esy install
esy b refmterr dune build --root . -j 3 --verbose
esy run
