with (import (builtins.fetchTarball {
  url = "https://github.com/dmjio/miso/archive/0af726ceeee9dda2ad390619e643fccf637727d6.tar.gz";
  sha256 = "1wpcc5y5py074nzd1qihgjlbfz1d8h262yqbc4k6wrmnjqiwwri6";
}) {});
with pkgs.haskell.packages;
let
  app = ghcjs.callCabal2nix "miso-benchmark-keyed" ./. {};
in
  pkgs.lib.overrideDerivation app (drv: {
    postInstall = with pkgs; ''
      mkdir -p $out/bin
      echo "(window['gc'] = window['gc']);" >> $out/bin/miso-benchmark-keyed.jsexe/all.js
      ${closurecompiler}/bin/closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS \
          --jscomp_off=checkVars \
          --externs=$out/bin/miso-benchmark-keyed.jsexe/all.js.externs \
          $out/bin/miso-benchmark-keyed.jsexe/all.js > temp.js
          mv temp.js $out/bin/all.min.js
          rm -r $out/bin/miso-benchmark-keyed.jsexe
      '';
  })
