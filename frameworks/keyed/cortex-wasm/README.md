# cortex-wasm (keyed)

High-performance Rust WebAssembly DOM mutation engine conforming to the keyed js-framework-benchmark specification.

## Highlights
- Zero heap allocation on critical mutation hot paths.
- Structure of Arrays (SoA) layout aligned for L1D cache confinement.
- Pure zero-copy WebAssembly memory buffer access.
- Pre-allocated String Interning LUT.

Source & Verification repository: [cortexLab011/cortex-dom-arena](https://github.com/cortexLab011/cortex-dom-arena)
