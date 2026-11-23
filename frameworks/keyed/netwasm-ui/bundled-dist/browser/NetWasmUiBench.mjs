const startup = Object.freeze({
  buildFingerprint: "b88c9609e89434ccc93ee4ca32afe2221433f9bf0f6eebecdaed5bb64568c6c8",
  manifestSha256: "87e7edc59df9707c5d49c7f754f80bd679a7391043525757b185511e3f2a5930",
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
