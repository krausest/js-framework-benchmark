if [ ! -d "dist" ]; then cp -R bundled-dist dist; fi
R=reflex-platform
rm -rf $R
git clone https://github.com/reflex-frp/reflex-platform.git
cd $R
git checkout a84a4f2baf4dec3ac29233572733512fc1400b22
./scripts/hack-on reflex-dom
cd reflex-dom/reflex-dom
../../scripts/work-on ghcjs ./. --command "cabal configure --ghcjs --enable-benchmarks"
