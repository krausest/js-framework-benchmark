Because of the heavy amount of Rust dependencies, this example is pre-compiled, so you don't need to compile anything.

However, if you do want to compile it, you will need the following:

* [Rust](https://www.rust-lang.org/tools/install)

After installing that, run these commands:

```
rustup toolchain install nightly
rustup override set nightly
rustup target add wasm32-unknown-unknown
cargo install -f cargo-web
npm install
npm run build-prod-force
```
