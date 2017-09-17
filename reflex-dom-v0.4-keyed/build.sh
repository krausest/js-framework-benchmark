cd reflex-platform/reflex-dom/reflex-dom
../../work-on ghcjs ./. --command "cabal build --ghcjs-options='-dedupe -DGHCJS_BROWSER -O2 -fspecialise-aggressively'"
cp -R dist/build/krausest/krausest.jsexe/* ../../../dist
