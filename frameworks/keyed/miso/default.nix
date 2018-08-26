{ pkgs ? import ((import <nixpkgs> {}).fetchFromGitHub {
    owner = "NixOS";
    repo = "nixpkgs";
    rev = "a0aeb23";
    sha256 = "04dgg0f2839c1kvlhc45hcksmjzr8a22q1bgfnrx71935ilxl33d";
  }){}
}:
let
  inherit (pkgs) runCommand closurecompiler;
  result = import (pkgs.fetchFromGitHub {
    owner = "dmjio";
    repo = "miso";
    rev = "5fcb57ad9fd423bd2d1b38f9e1a7121a0acf3e17";
    sha256 = "0vn87hrcds8nmzj358pp9bm28pfml7j1fhancmgmwhl7i91fjdcv";
  }) {};
in pkgs.haskell.packages.ghcjs.callPackage ./miso-benchmark-keyed.nix {
    miso = result.miso-ghcjs;
  }
