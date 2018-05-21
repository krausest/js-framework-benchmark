{ mkDerivation, base, containers, miso, random, vector, stdenv, closurecompiler
}:
mkDerivation {
  pname = "miso-benchmark-keyed";
  version = "0.1.0.0";
  src = ./.;
  isLibrary = false;
  isExecutable = true;
  executableHaskellDepends = [
    base containers miso random vector
  ];
  description = "Benchmark of miso";
  license = stdenv.lib.licenses.bsd3;
  postInstall = ''
    cp ./dist-bundle/index.html $out/bin/miso-benchmark-keyed.jsexe/
    ${closurecompiler}/bin/closure-compiler $out/bin/miso-benchmark-keyed.jsexe/all.js > $out/bin/miso-benchmark-keyed.jsexe/all.min.js
    rm $out/bin/miso-benchmark-keyed.jsexe/all.js
  '';
}
