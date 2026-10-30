# Glory keyed benchmark

This implementation uses [Glory GitHub main commit c988506d](https://github.com/glory-rs/glory/commit/c988506d40938d50c210d2b8a27a708121449609), a **0.6.1 development snapshot**, its XML display DSL, and the framework-owned keyed `Each` collection. The full Git revision and registry package checksums are pinned in Cargo.lock. No sibling checkout or local dependency override is required.

The application uses the standard table markup and `Math.random` word generator. Rows retain their identities when swapped or removed. A single selected-row ID drives reactive class bindings; application code does not manipulate DOM nodes, cache nodes, delegate events, or schedule animation frames.

Issue 1139 records that the WebAssembly application does not run under the benchmark's strict `default-src 'self'` Content Security Policy.

## Build

Prerequisites: Node.js, Rust 1.95 or newer, the `wasm32-unknown-unknown` target, GitHub network access for the pinned source, and wasm-bindgen-cli 0.2.130.

```sh
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.130 --locked
npm ci
npm run build-prod
```

The portable Node.js build script checks the wasm-bindgen version and confirms every Glory runtime package is version 0.6.1 from the exact Git revision. It writes browser assets to `bundled-dist`. `WASM_BINDGEN` selects an existing matching executable; standard Cargo environment variables such as `CARGO_HOME` and `CARGO_TARGET_DIR` are respected.

The release profile uses optimization level 3, LTO, one codegen unit, aborting panics, symbol stripping and disabled incremental compilation. The checked-in browser assets are the exact files used in the completed benchmark run; a Git-source rebuild is validated separately and can differ in bytes from the original path-source build. See [results and provenance](benchmark-results/2026-10-31/README.md) for all 15 original result files, sampling, build-context details and artifact hashes.

## Run

Start the benchmark server from the repository root with `npm start`, then open <http://localhost:8080/frameworks/keyed/glory/bundled-dist/>.

From the repository root:

```sh
npm run bench -- --framework keyed/glory
```

From `webdriver-ts`, check keyed DOM reuse with:

```sh
npm run isKeyed -- --framework keyed/glory
```
