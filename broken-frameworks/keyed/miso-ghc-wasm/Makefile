.PHONY= update build optim

all: update build optim

update:
	wasm32-wasi-cabal update

build:
	wasm32-wasi-cabal build 
	rm -rf dist-bundle
	cp -r static dist-bundle
	$(eval my_wasm=$(shell wasm32-wasi-cabal list-bin app | tail -n 1))
	$(shell wasm32-wasi-ghc --print-libdir)/post-link.mjs --input $(my_wasm) --output dist-bundle/ghc_wasm_jsffi.js
	cp -v $(my_wasm) dist-bundle/

optim:
	wasm-opt -all -O2 dist-bundle/app.wasm -o dist-bundle/app.wasm
	wasm-tools strip -o dist-bundle/app.wasm dist-bundle/app.wasm

serve:
	http-server dist-bundle

clean:
	rm -rf dist-newstyle dist-bundle
