#!/usr/bin/env bash

curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --jsonfile ./src/global.json --install-dir ./dotnet --no-path
./dotnet/dotnet.exe workload install wasm-tools