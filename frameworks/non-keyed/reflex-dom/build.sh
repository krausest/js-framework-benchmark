cd reflex-platform/reflex-dom/reflex-dom
../../scripts/work-on ghcjs ./. --command "cabal build --ghcjs-options='-DGHCJS_BROWSER -O2 -fspecialise-aggressively'"
cp -R dist/build/krausest/krausest.jsexe/* ../../../dist
