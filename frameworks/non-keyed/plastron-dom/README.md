plastron-dom v0.0.2 (non-keyed division)

Pre-built bundle (vanillajs pattern — `build-prod` is a no-op).
`main.js` is the production artifact; `src/main.ts` is the
framework scaffold source, kept for reviewer reference. Its
deep-relative imports point at the plastron monorepo and aren't
resolvable in this directory.

Source repo: https://github.com/rheophile10/plastron
Scaffold path in source repo: bench/krausest/non-keyed/plastron-dom-v0.0.2/
plastron-dom segment: segments/plastron-dom/

isKeyed validation: confirmed at non-keyed on this machine via `npm run isKeyed -- non-keyed/plastron-dom-v0.0.2`.
CSP non-compliance (issues: [1139]): the plastron-sheet formula
compiler uses `new Function()` for codegen; declared explicitly
per krausest convention.
