.PHONY= update build

all: update build

update:
	cabal update --with-ghc=javascript-unknown-ghcjs-ghc --with-hc-pkg=javascript-unknown-ghcjs-ghc-pkg

build:
	cabal build --with-ghc=javascript-unknown-ghcjs-ghc --with-hc-pkg=javascript-unknown-ghcjs-ghc-pkg
	cp -v ./dist-newstyle/build/javascript-ghcjs/ghc-9.12.2/*/x/app/build/app/app.jsexe/all.js .
	rm -rf dist-bundle
	cp -rv static dist-bundle
	bunx --bun swc ./all.js -o dist-bundle/index.js

clean:
	rm -rf dist-newstyle dist-bundle
