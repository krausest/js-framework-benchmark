with (import (builtins.fetchTarball {
  url = "https://github.com/dmjio/miso/archive/d10c2d5a0def76b91d55abe3331370fc528b6d02.tar.gz";
  sha256 = "0733f3i73j6aig2bdar1dfm8h806ghhqqcm1mx7sy741cdvv77n3";
}) {});
with pkgs.haskell.packages;
let
  app = ghcjs.callCabal2nix "miso-benchmark-non-keyed" ./. {};
in
  pkgs.lib.overrideDerivation app (drv: {
    postInstall = with pkgs; ''
      mkdir -p $out/bin
      echo "(window['gc'] = window['gc']);" >> $out/bin/miso-benchmark-non-keyed.jsexe/all.js
      ${closurecompiler}/bin/closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS \
          --jscomp_off=checkVars \
          --externs=$out/bin/miso-benchmark-non-keyed.jsexe/all.js.externs \
          $out/bin/miso-benchmark-non-keyed.jsexe/all.js > temp.js
          mv temp.js $out/bin/all.min.js
          rm -r $out/bin/miso-benchmark-non-keyed.jsexe
      '';
  })
