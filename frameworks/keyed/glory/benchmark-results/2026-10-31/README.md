# Glory main snapshot benchmark results

Runtime: Glory 0.6.1 development snapshot, GitHub commit `c988506d40938d50c210d2b8a27a708121449609`.
This is an unreleased main snapshot, not the published 0.6.0 release.

The 15 adjacent JSON files are the original, unmodified upstream results collected as part of a six-framework run on 2026-10-30/31 (Asia/Shanghai). They retain every sample, including slow samples. Framework IDs in those files use the original `glory-v0.6.1-keyed` label; this fixture adds the commit suffix for future runs.

Environment: Windows 11 Pro, Intel Core Ultra 9 285H, Chrome 155.0.8059.86, Rust 1.98.0, Node 24.18.0, wasm-bindgen 0.2.130. Driver baseline: `d95b024593341994188c62c81995e377a1b2e136`. Upstream warmups, CPU throttles and timings were retained. CPU cases have 15 samples, selection 25; memory/size cases have one sample. No Glory case required a retry. One Vue selection case in the broader comparison was retried in full.

## CPU medians

Units: ms. The historical case suffix is not the actual CPU slowdown: update/select/swap/clear use x4, remove uses x2, and the other cases x1.

| Case | Samples | Total | Script |
|---|---:|---:|---:|
| 01_run1k | 15 | 45.50 | 8.50 |
| 02_replace1k | 15 | 52.90 | 13.90 |
| 03_update10th1k_x16 | 15 | 51.70 | 5.30 |
| 04_select1k | 25 | 28.20 | 3.90 |
| 05_swap1k | 15 | 54.70 | 3.40 |
| 06_remove-one-1k | 15 | 31.00 | 1.20 |
| 07_create10k | 15 | 530.50 | 93.90 |
| 08_create1k-after1k_x2 | 15 | 56.90 | 9.40 |
| 09_clear1k_x8 | 15 | 49.30 | 42.40 |

## Memory, transfer size and first paint

Memory is page-attributed MiB from `measureUserAgentSpecificMemory()`, not process RSS. Transfer sizes are KiB of requested application assets excluding `/css` and HTTP headers. First paint is ms. Each row is a single observation.

| Case | Value |
|---|---:|
| 21_ready-memory | 1.809 |
| 22_run-memory | 5.749 |
| 25_run-clear-memory | 4.378 |
| 41_size-uncompressed | 434.800 |
| 42_size-compressed | 115.300 |
| 43_first-paint | 738.100 |

## Artifact provenance

The submitted `bundled-dist/app_bg.wasm` is the **exact binary measured above**:

- Bytes: **417349**
- SHA-256: `15ae917e779182a3809eefd25a541bb0ce833a5de820807e590b2acbb2e6eaf9`

All submitted browser files and result JSON checksums are recorded in [provenance.json](provenance.json). The measurement used a frozen local checkout matching the pinned GitHub revision. The portable build now obtains that revision directly through Cargo Git dependencies; registry dependency versions/checksums remain unchanged. A clean Git-source build passes but is not byte-identical to the earlier path-source build. Its hash is recorded separately; it did not replace the measured assets.
