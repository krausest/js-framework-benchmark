#!/bin/sh

set -ex

RELEASE_PATH="$(pwd)/dist"
mkdir -p $RELEASE_PATH

built=$(find | grep .bc.js | grep src)

rm -f $RELEASE_PATH/*.bc.js
cp $built $RELEASE_PATH
