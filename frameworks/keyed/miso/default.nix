with (import (builtins.fetchTarball {
  url = "https://github.com/dmjio/miso/archive/485b91f.tar.gz";
  sha256 = "1kfr1f6bwfqnvxlfzf1vv0v07xrlg8ashjiasrps85l1dmja6s4b";
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
