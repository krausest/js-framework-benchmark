// plastron-dom 0.1.0 — js-framework-benchmark KEYED, on the NEW kernel.
//
// Idiomatic plastron-as-framework shape (same as the v0.0.2 entry): one cel
// for the rows array, one for selectedIdx, one tbody VIEW cel that emits the
// keyed <tbody> vnode. Each <tr> carries `memo:[row,selected]` so plastron-dom's
// diff is O(changed). Button handlers are one setValue each. Bare `plastron`
// imports (publish/github dep); the painter is the real rAF painter.
import {
  createInitialState, resolveFn, precomputeOptional, createPainter, setPainter,
  el, text, memo, type State, type Fn,
} from "plastron";

const A = ["pretty","large","big","small","tall","short","long","handsome","plain","quaint","clean","elegant","easy","angry","crazy","helpful","mushy","odd","unsightly","adorable","important","inexpensive","cheap","expensive","fancy"];
const C = ["red","yellow","blue","green","pink","brown","purple","brown","white","black","orange"];
const N = ["table","chair","house","bbq","desk","car","pony","cookie","sandwich","burger","pizza","mouse","keyboard"];
interface Row { id: number; label: string }
let nextId = 1;
const rnd = (a: string[]) => a[(Math.random() * a.length) | 0]!;
const buildData = (n: number): Row[] => Array.from({ length: n }, () => ({ id: nextId++, label: rnd(A) + " " + rnd(C) + " " + rnd(N) }));

const buildTbody = (rows: Row[], sel: number | null) => ({
  vnode: el("tbody", { id: "tbody" }, rows.map((r) => {
    const tr = el("tr", r.id === sel ? { class: "danger" } : {}, [
      el("td", { class: "col-md-1" }, [text(r.id)]),
      el("td", { class: "col-md-4" }, [el("a", { class: "lbl" }, [text(r.label)], { click: { dispatch: "krausest:select", payload: r.id } })]),
      el("td", { class: "col-md-1" }, [el("a", { class: "remove" }, [el("span", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }, [])], { click: { dispatch: "krausest:removeRow", payload: r.id } })]),
      el("td", { class: "col-md-6" }, []),
    ]);
    tr.key = "row-" + r.id;
    memo(tr, [r, r.id === sel]);
    return tr;
  })),
  mount: "#tbody",
  listeners: [],
});

const rowsOf = (s: State) => (s.cels.get("krausest:rows")!.v as Row[]);
// mutate + flush the paint channel (the painter applies on rAF) — the kernel's
// commit pattern: a write isn't shown until its channel drains.
const setVal = async (s: State, key: string, v: unknown) => { await (resolveFn(s, "setValue") as Fn)(s, key, v); await (resolveFn(s, "drain") as Fn)(s, "plastron-dom.paint"); };
const setRows = (s: State, next: Row[]) => setVal(s, "krausest:rows", next);

const main = async (): Promise<void> => {
  const state = createInitialState();
  const R = (k: string) => resolveFn(state, k) as Fn;
  setPainter(state, createPainter(state));
  await R("ensureSegments")(state, ["plastron-dom"]);
  await R("hydrate")(state, [], []);

  await R("setCel")(state, "buildTbody", { celType: "LockedLambdaCel", fn: buildTbody as unknown as Fn, metadata: { kind: "native", segment: "krausest" } });
  await R("setCel")(state, "krausest:select", { celType: "LockedLambdaCel", fn: ((s: State, id: number) => setVal(s, "krausest:selectedIdx", id)) as unknown as Fn, metadata: { kind: "native", segment: "krausest" } });
  await R("setCel")(state, "krausest:removeRow", { celType: "LockedLambdaCel", fn: ((s: State, id: number) => setRows(s, rowsOf(s).filter((r) => r.id !== id))) as unknown as Fn, metadata: { kind: "native", segment: "krausest" } });
  await R("setCelBatch")(state, {
    "krausest:rows": { celType: "ValueCel", v: [], metadata: { segment: "krausest" } },
    "krausest:selectedIdx": { celType: "ValueCel", v: null, metadata: { segment: "krausest" } },
  });
  await R("setCel")(state, "krausest:tbody", { celType: "FormulaCel", f: "(buildTbody rows sel)", metadata: { segment: "krausest", parser: "f", schema: "render-spec", channel: ["plastron-dom.paint"], inputMap: { rows: "krausest:rows", sel: "krausest:selectedIdx" } } });
  await R("runCycle")(state);
  await precomputeOptional(state);            // make rows/sel → tbody edges live
  await R("runCycle")(state);

  const $ = (id: string) => document.getElementById(id)!;
  $("run").onclick      = () => void setRows(state, buildData(1000));
  $("runlots").onclick  = () => void setRows(state, buildData(10000));
  $("clear").onclick    = () => void setRows(state, []);
  $("add").onclick      = () => void setRows(state, rowsOf(state).concat(buildData(1000)));
  $("update").onclick   = () => void setRows(state, rowsOf(state).map((r, i) => i % 10 === 0 ? { ...r, label: r.label + " !!!" } : r));
  $("swaprows").onclick = () => { const a = rowsOf(state).slice(); if (a.length > 998) { const t = a[1]!; a[1] = a[998]!; a[998] = t; } void setRows(state, a); };
};
void main().catch((e: unknown) => console.error(e));
