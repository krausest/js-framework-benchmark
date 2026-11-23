const startup = Object.freeze({
  buildFingerprint: "6d586040e53f358bf9d03bd7b15b7b7b81f3382b5476f10c26fd7607a83c7e30",
  manifestSha256: "7a0c68d275048811ef2bbcf0c79fbfbaed77dc154f50a415be3daa7f7662142e",
});
const exports = Object.freeze(["start"]);
const page = import("./netwasm.page.mjs");
page.catch(() => {});
if (typeof document !== "undefined" && document.head !== null) {
  for (const path of ["./netwasm.page.mjs","./netwasm.runtime.BtsZq8ua.mjs","./netwasm.runtime.C_zQd_o6.mjs","./netwasm.runtime.DFloXpyi.mjs","./netwasm.runtime.DOOVqDDl.mjs","./netwasm.runtime.filesystem.C5_Z7KIF.mjs","./netwasm.runtime.hGu8jzsa.mjs","./netwasm.runtime.lqDkKBc_.mjs","./netwasm.runtime.page.SteOcSRc.mjs"]) {
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
let loaded = null;
page.then(module => { loaded = module; }, () => {});
export async function mount(guestPath, source) {
  return (await page).mount(guestPath, source);
}
export async function sync(guestPath) {
  return (await page).sync(guestPath);
}
export function unmount(guestPath) {
  if (loaded === null) throw new TypeError(`'${guestPath}' is not mounted`);
  return loaded.unmount(guestPath);
}
export function open(options) {
  return page.then(({ openPage }) => openPage(Object.freeze({ exports, options, prefetched, startup })));
}
