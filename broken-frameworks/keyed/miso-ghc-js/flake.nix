{

  inputs = {
    miso.url = "github:dmjio/miso";
  };

  outputs = inputs:
    inputs.miso.inputs.flake-utils.lib.eachDefaultSystem (system: {
      devShell = inputs.miso.outputs.devShells.${system}.default;
      devShells.ghcjs = inputs.miso.outputs.devShells.${system}.ghcjs;
    });

}

