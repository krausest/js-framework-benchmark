if [ ! -d "dist" ]; then cp -R bundled-dist dist; fi
R=reflex-platform
rm -rf $R
git clone https://github.com/reflex-frp/reflex-platform.git
cd $R
git remote add alexfmpe https://github.com/alexfmpe/reflex-platform.git
git fetch --all
git checkout 5ab2608fb4c7b24dd42fdf2ffa0e231f07435ea4
./hack-on reflex-dom
cd reflex-dom/reflex-dom
../../work-on ghcjs ./. --command "cabal configure --ghcjs --enable-benchmarks"
