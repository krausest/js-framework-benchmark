# Glory keyed benchmark

This implementation uses the published [Glory 0.6.0](https://crates.io/crates/glory)
release, its XML display DSL, and the framework-owned keyed `Each` collection.
Cargo.lock pins the registry packages and checksums; no sibling source checkout
or local dependency override is required.

The application uses the standard table markup and `Math.random` word generator.
Rows retain their identities when swapped or removed. A single selected-row ID
drives reactive class bindings; application code does not manipulate DOM nodes,
cache nodes, delegate events, or schedule animation frames.

Issue 1139 records that the WebAssembly application does not run under the
benchmark's strict `default-src 'self'` Content Security Policy.

## Build

Prerequisites: Node.js, Rust 1.94 or newer, the `wasm32-unknown-unknown` target,
and wasm-bindgen-cli 0.2.129.

```sh
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.129 --locked
npm ci
npm run build-prod
```

The Node.js build script works across platforms and writes the prebuilt browser
assets to `bundled-dist`. It checks the wasm-bindgen version and confirms all
Glory runtime packages come from the published 0.6.0 release. `WASM_BINDGEN` can
select an existing matching executable; standard Cargo environment variables
such as `CARGO_HOME` and `CARGO_TARGET_DIR` are respected.

The release profile strips symbols and uses optimization level 3, LTO, one
codegen unit, aborting panics and disabled incremental compilation, matching the
Dioxus release settings. The checked-in assets still use the published Glory
0.6.0 runtime; development runtime optimizations are measured separately.

## Run

Start the benchmark server from the repository root with `npm start`, then open
<http://localhost:8080/frameworks/keyed/glory/bundled-dist/>.

From the repository root:

```sh
npm run bench -- --framework keyed/glory
```

From `webdriver-ts`, check keyed DOM reuse with:

```sh
npm run isKeyed -- --framework keyed/glory
```
