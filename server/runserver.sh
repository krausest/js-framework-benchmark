#!/bin/bash
echo "Starting server $HOME"
source $HOME/.nvm/nvm.sh
cd $HOME/js-framework-benchmark/server
./node_modules/.bin/tsx index.ts
