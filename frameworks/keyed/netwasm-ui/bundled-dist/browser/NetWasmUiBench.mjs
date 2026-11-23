const startup = Object.freeze({
  buildFingerprint: "77acf765ec200ba2da94a71c868b4b537547d8e1344bf5a0d7ebfb64b4ce74fd",
  manifestSha256: "658d794be8d52bf8ba42b9cec99b8c29229502f0318105a31e1b018bee875cbc",
});
const exports = Object.freeze(["start"]);
const page = import("./netwasm.page.mjs");
page.catch(() => {});
if (typeof document !== "undefined" && document.head !== null) {
  for (const path of ["./netwasm.page.mjs","./netwasm.runtime.BtsZq8ua.mjs","./netwasm.runtime.C_zQd_o6.mjs","./netwasm.runtime.DFloXpyi.mjs","./netwasm.runtime.DOOVqDDl.mjs","./netwasm.runtime.hGu8jzsa.mjs","./netwasm.runtime.lqDkKBc_.mjs","./netwasm.runtime.page.SteOcSRc.mjs"]) {
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = new URL(path, import.meta.url).href;
    document.head.append(link);
  }
}
const prefetched = new Map();
for (const path of ["deployment.json","NetWasmUiBench.wasm","NetWasmUiBench.raw-adapter.mjs","runtime-layout.json","interop.json","NetWasmUiBench.wasm.type-symbols"]) {
  const url = new URL(path, import.meta.url).href;
  const response = fetch(url);
  response.catch(() => {});
  prefetched.set(url, response);
}
export function open(options) {
  return page.then(({ openPage }) => openPage(Object.freeze({ exports, options, prefetched, startup })));
}
