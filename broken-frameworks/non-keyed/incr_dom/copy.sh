#!/bin/sh -x
set -x

RELEASE_PATH="$(pwd)/dist"
mkdir -p $RELEASE_PATH

built=$(find | grep .bc.js | grep src)
rm -f $RELEASE_PATH/*.bc.js
cp $built $RELEASE_PATH

built=$(find | grep .bc.map | grep src)
if [ ! -z "$built" ]; then
  rm -f $RELEASE_PATH/*.bc.map
  cp $built $RELEASE_PATH
fi
