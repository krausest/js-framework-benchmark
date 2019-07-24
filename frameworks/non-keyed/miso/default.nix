with (import (builtins.fetchTarball {
  url = "https://github.com/dmjio/miso/archive/5647cfd.tar.gz";
  sha256 = "177d99m4q4ab35xr0kdpczxncbx187bwk54z7cr3khp5w9gcq27g";
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
