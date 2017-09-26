R=reflex-platform
if [ ! -d "$R" ]; then
    git clone https://github.com/reflex-frp/reflex-platform.git
    cd $R
    git remote add alexfmpe https://github.com/alexfmpe/reflex-platform.git
    git fetch --all
    git checkout 13d8daf368cb370d07743123d1fe66e19961c2ed
    ./hack-on reflex-dom
    cd reflex-dom/reflex-dom
    ../../work-on ghcjs ./. --command "cabal configure --ghcjs --enable-benchmarks"
fi
