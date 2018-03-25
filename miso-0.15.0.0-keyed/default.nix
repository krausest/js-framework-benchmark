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
    rev = "66c0b76243062b2fe8c2f068e1a036568bc175ab";
    sha256 = "1r9v6pngx15g306gklx4yq02qg8iis3as4clc6vk6ravy0j364i2";
  }) {};

in pkgs.haskell.packages.ghcjs.callPackage ./miso-benchmark-keyed.nix {
    miso = result.miso-ghcjs;
  }
