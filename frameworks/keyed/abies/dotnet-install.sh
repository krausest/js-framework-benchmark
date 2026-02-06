#!/bin/bash
# Install .NET SDK locally for building

set -e

DOTNET_VERSION="9.0"
INSTALL_DIR="./dotnet"

# Download and run the dotnet-install script
curl -sSL https://dot.net/v1/dotnet-install.sh | bash -s -- --channel $DOTNET_VERSION --install-dir $INSTALL_DIR

echo "Installed .NET $DOTNET_VERSION to $INSTALL_DIR"
