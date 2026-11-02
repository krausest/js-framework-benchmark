/**
 * @re — create1k / replace1k per-stage trace micro-analysis.
 *
 * Variants (all produce the identical official DOM; same buildData):
 *   A_cur     — current official impl algorithm: protoTr.cloneNode per row +
 *               direct slot writes + map entries + detached-parent rebuild
 *   B_bulk    — string parts + join + one innerHTML parse on a scratch tbody +
 *               map entries + detached replaceChildren(anchor, ...nodes)
 *   C_attached— B, but replaceChildren directly on the attached tbody
 *   D_batch   — clone per row, but single-call replaceChildren insert
 *   E_fused   — buildData fused with string emission (single pass), rest as B
 *   V_vanilla — official vanillajs keyed replica (textContent='' + clone +
 *               per-row appendChild into detached tbody)
 *
 * Stages measured per sample (performance.now):
 *   data   — buildData (E_fused: fused data+string emission)
 *   render — clone+writes (A/D/V) or string parts+join (B/C/E)
 *   parse  — innerHTML parse (B/C/E only)
 *   map    — RowEntry alloc + Map.set loop
 *   insert — DOM insertion (per-row appendChild or one replaceChildren)
 *   total  — whole synchronous handler
 *   layout — handler end -> next double-rAF (style/layout proxy)
 */
import { signal, html, append, each } from '@re/core';

interface Row {
  id: number;
  label: string;
  t: Text | null;
}

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

const ADJECTIVES = ['pretty','large','big','small','tall','short','long','handsome','plain','quaint','clean','elegant','easy','angry','crazy','helpful','mushy','odd','unsightly','adorable','important','inexpensive','cheap','expensive','fancy'];
const COLOURS = ['red','yellow','blue','green','pink','brown','purple','brown','white','black','orange'];
const NOUNS = ['table','chair','house','bbq','desk','car','pony','cookie','sandwich','burger','pizza','mouse','keyboard'];

let idSeq = 1;

function buildData(count: number): Row[] {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idSeq++,
      label:
        ADJECTIVES[_random(ADJECTIVES.length)] +
        ' ' +
        COLOURS[_random(COLOURS.length)] +
        ' ' +
        NOUNS[_random(NOUNS.length)],
      t: null,
    };
  }
  return data;
}

const tbodyEl0 = document.getElementById('tbody') as HTMLElement;
let tbody = tbodyEl0;
const table = tbody.parentElement as HTMLElement;
const anchor = document.createComment('each');
tbody.appendChild(anchor);

/* ------------------------------------------------------------------ */
/* A_cur — current official impl (replica, staged)                     */
/* ------------------------------------------------------------------ */

const protoTr = (() => {
  const f = html`<tr><td class="col-md-1">${''}</td><td class="col-md-4"><a>${''}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
  return f.root as unknown as HTMLElement;
})();

// keep the real A_cur reactive stack alive once so its JIT profile matches prod
// (runs in a DETACHED tbody so the variants' tbody stays untouched)
{
  const rows = signal<Row[]>([]);
  const warmBody = document.createElement('tbody');
  const list = each(rows, (r: Row) => r.id, (r: Row) => {
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = r.id;
    ((tr.childNodes[0] as HTMLElement).firstChild as Text).data = String(r.id);
    r.t = ((tr.childNodes[1] as HTMLElement).firstChild as HTMLElement).firstChild as Text;
    r.t.data = r.label;
    return tr;
  });
  append(warmBody, html`${list}`);
  rows.value = buildData(10);
  rows.value = [];
}

type StageRow = {
  data: number; render: number; parse: number; map: number;
  insert: number; total: number; layout: number;
};

const T0 = { data: 0, render: 0, parse: 0, map: 0, insert: 0, total: 0, layout: 0 };

const now = () => performance.now();
const gcAvail = (window as unknown as { gc?: () => void }).gc;
const gcNow = () => { try { gcAvail?.(); } catch { /* noop */ } };
const raf2 = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(res)));

/** drop all rows but keep the anchor first */
function dropRowsKeepAnchor(): void {
  tbody.replaceChildren(anchor);
}

/* ---------------- variant: A_cur ---------------- */

function aCurNodes(items: Row[], st: StageRow): void {
  let t = now();
  // (data stage measured by caller)
  st.data = now() - t;
  t = now();
  const out: Node[] = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = r.id;
    ((tr.childNodes[0] as HTMLElement).firstChild as Text).data = String(r.id);
    r.t = ((tr.childNodes[1] as HTMLElement).firstChild as HTMLElement).firstChild as Text;
    r.t.data = r.label;
    out[i] = tr;
  }
  st.render = now() - t;
  st.parse = 0;
  t = now();
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    map.set(r.id, { root: out[i]!, fr: null, item: r });
  }
  st.map = now() - t;
  t = now();
  // detached rebuild (current _appendAll/_replaceAll semantics)
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  gp.removeChild(tbody);
  tbody.replaceChildren(anchor);
  for (let i = 0; i < out.length; i++) tbody.appendChild(out[i]!);
  gp.insertBefore(tbody, ref);
  st.insert = now() - t;
}

/* ---------------- variant: B_bulk ---------------- */

const scratch = document.createElement('tbody');

function bBulkNodes(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  const parts: string[] = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    parts[i] = `<tr data_id="${r.id}"><td class="col-md-1">${r.id}</td><td class="col-md-4"><a>${r.label}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
  }
  const htmlStr = parts.join('');
  st.render = now() - t;
  t = now();
  scratch.innerHTML = htmlStr;
  st.parse = now() - t;
  t = now();
  const n = items.length;
  const out: Node[] = new Array(n);
  const kids = scratch.children as HTMLCollection;
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < n; i++) {
    const r = items[i]!;
    const root = kids[i] as Node;
    out[i] = root;
    map.set(r.id, { root, fr: null, item: r });
  }
  st.map = now() - t;
  t = now();
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  gp.removeChild(tbody);
  tbody.replaceChildren(anchor, ...out);
  gp.insertBefore(tbody, ref);
  st.insert = now() - t;
}

/* ---------------- variant: C_attached ---------------- */

function cAttachedNodes(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  const parts: string[] = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    parts[i] = `<tr data_id="${r.id}"><td class="col-md-1">${r.id}</td><td class="col-md-4"><a>${r.label}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
  }
  const htmlStr = parts.join('');
  st.render = now() - t;
  t = now();
  scratch.innerHTML = htmlStr;
  st.parse = now() - t;
  t = now();
  const n = items.length;
  const out: Node[] = new Array(n);
  const kids = scratch.children as HTMLCollection;
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < n; i++) {
    const r = items[i]!;
    const root = kids[i] as Node;
    out[i] = root;
    map.set(r.id, { root, fr: null, item: r });
  }
  st.map = now() - t;
  t = now();
  tbody.replaceChildren(anchor, ...out);
  st.insert = now() - t;
}

/* ---------------- variant: D_batch (clone + single-call insert) ---------------- */

function dBatchNodes(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  const out: Node[] = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = r.id;
    ((tr.childNodes[0] as HTMLElement).firstChild as Text).data = String(r.id);
    r.t = ((tr.childNodes[1] as HTMLElement).firstChild as HTMLElement).firstChild as Text;
    r.t.data = r.label;
    out[i] = tr;
  }
  st.render = now() - t;
  st.parse = 0;
  t = now();
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    map.set(r.id, { root: out[i]!, fr: null, item: r });
  }
  st.map = now() - t;
  t = now();
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  gp.removeChild(tbody);
  tbody.replaceChildren(anchor, ...out);
  gp.insertBefore(tbody, ref);
  st.insert = now() - t;
}

/* ---------------- variant: E_fused (data+string single pass) ---------------- */

function eFusedRun(items: undefined, st: StageRow): Row[] {
  let t = now();
  const count = 1000;
  const data: Row[] = new Array(count);
  const parts: string[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const id = idSeq++;
    const label =
      ADJECTIVES[_random(ADJECTIVES.length)] +
      ' ' +
      COLOURS[_random(COLOURS.length)] +
      ' ' +
      NOUNS[_random(NOUNS.length)];
    const r: Row = { id, label, t: null };
    data[i] = r;
    parts[i] = `<tr data_id="${id}"><td class="col-md-1">${id}</td><td class="col-md-4"><a>${label}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
  }
  st.data = now() - t;
  t = now();
  const htmlStr = parts.join('');
  st.render = now() - t;
  t = now();
  scratch.innerHTML = htmlStr;
  st.parse = now() - t;
  t = now();
  const n = count;
  const out: Node[] = new Array(n);
  const kids = scratch.children as HTMLCollection;
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < n; i++) {
    const r = data[i]!;
    const root = kids[i] as Node;
    out[i] = root;
    map.set(r.id, { root, fr: null, item: r });
  }
  st.map = now() - t;
  t = now();
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  gp.removeChild(tbody);
  tbody.replaceChildren(anchor, ...out);
  gp.insertBefore(tbody, ref);
  st.insert = now() - t;
  return data;
}

/* ---------------- variant: V_vanilla (official replica) ---------------- */

const rowTemplate = document.createElement('tr');
rowTemplate.innerHTML = "<td class='col-md-1'> </td><td class='col-md-4'><a> </a></td><td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";

function vVanillaRun(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  // official vanilla destroy: tbody.textContent = '' (in-document, like removeAllRows);
  // then re-add our anchor comment (vanilla has none — 1 node, negligible)
  tbody.textContent = '';
  tbody.appendChild(anchor);
  const empty = true;
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  tbody.remove();
  const out: Node[] = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    const d = items[i]!;
    const tr = rowTemplate.cloneNode(true) as HTMLElement;
    const td1 = tr.firstChild as HTMLElement;
    const a2 = (td1.nextSibling as HTMLElement).firstChild as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = d.id;
    (td1.firstChild as Text).nodeValue = String(d.id);
    (a2.firstChild as Text).nodeValue = d.label;
    tbody.appendChild(tr);
    out[i] = tr;
  }
  st.render = now() - t;
  st.parse = 0;
  st.map = 0;
  t = now();
  empty && gp.insertBefore(tbody, ref);
  st.insert = now() - t;
}

/* ---------------- variant: G_swap (replace via container clone-swap) ----------------
 * Destroy: wholesale — clone empty tbody, move anchor into it, drop the old
 * subtree in ONE remove() (GC absorbs it). No per-node unlink at all.
 * Build: fused clone+writes+map loop, off-document, per-row appendChild.
 */

function gSwapRun(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  const fresh = tbody.cloneNode(false) as HTMLElement;
  fresh.appendChild(anchor);
  gp.removeChild(tbody);
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = r.id;
    ((tr.childNodes[0] as HTMLElement).firstChild as Text).data = String(r.id);
    r.t = ((tr.childNodes[1] as HTMLElement).firstChild as HTMLElement).firstChild as Text;
    r.t.data = r.label;
    map.set(r.id, { root: tr, fr: null, item: r });
    fresh.appendChild(tr);
  }
  st.render = now() - t;
  st.parse = 0;
  st.map = 0;
  t = now();
  gp.insertBefore(fresh, ref);
  tbody = fresh; // keep the module-level handle on the live container
  st.insert = now() - t;
}

/* ---------------- variant: H_swap (clear via container clone-swap) ---------------- */

function hSwapClear(st: StageRow): void {
  let t = now();
  const fresh = tbody.cloneNode(false) as HTMLElement;
  fresh.appendChild(anchor);
  tbody.replaceWith(fresh);
  tbody = fresh; // keep the module-level handle on the live container
  st.insert = now() - t;
  st.render = 0;
  st.parse = 0;
  st.map = 0;
  st.data = 0;
}

function hCurClear(st: StageRow): void {
  // current _clearAll fast path: one replaceChildren (attached)
  let t = now();
  tbody.replaceChildren(anchor);
  st.insert = now() - t;
  st.render = 0;
  st.parse = 0;
  st.map = 0;
  st.data = 0;
}

/* ---------------- variant: J_fused (create, interleaved like optimized impl) ------- */

function jFusedRun(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  gp.removeChild(tbody);
  const map = new Map<number, { root: Node; fr: null; item: Row }>();
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = r.id;
    ((tr.childNodes[0] as HTMLElement).firstChild as Text).data = String(r.id);
    r.t = ((tr.childNodes[1] as HTMLElement).firstChild as HTMLElement).firstChild as Text;
    r.t.data = r.label;
    map.set(r.id, { root: tr, fr: null, item: r });
    tbody.appendChild(tr);
  }
  st.render = now() - t;
  st.parse = 0;
  st.map = 0;
  t = now();
  gp.insertBefore(tbody, ref);
  st.insert = now() - t;
}

/* ---------------- variant: K_lean (firstChild chains, node-direct map) ------------- */

function kLeanRun(items: Row[], st: StageRow): void {
  let t = now();
  st.data = now() - t;
  t = now();
  const gp = tbody.parentNode as HTMLElement;
  const ref = tbody.nextSibling;
  const fresh = tbody.cloneNode(false) as HTMLElement;
  fresh.appendChild(anchor);
  gp.removeChild(tbody);
  const map = new Map<number, Node>();
  for (let i = 0; i < items.length; i++) {
    const r = items[i]!;
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    (tr as unknown as { data_id: number }).data_id = r.id;
    const td1 = tr.firstChild as HTMLElement;              // id cell
    const a2 = (td1.nextSibling as HTMLElement).firstChild as HTMLElement; // label <a>
    (td1.firstChild as Text).data = String(r.id);
    (a2.firstChild as Text).data = r.label;
    map.set(r.id, tr);
    fresh.appendChild(tr);
  }
  st.render = now() - t;
  st.parse = 0;
  st.map = 0;
  t = now();
  gp.insertBefore(fresh, ref);
  tbody = fresh;
  st.insert = now() - t;
}


type Variant = {
  name: string;
  ops?: readonly ('create' | 'replace')[];
  create: (items: Row[], st: StageRow) => void; // tbody assumed anchor-only
  replace: (items: Row[], st: StageRow) => void; // tbody has 1000 old rows
  fused?: boolean;
};

const variants: Variant[] = [
  { name: 'A_cur', create: aCurNodes, replace: aCurNodes },
  { name: 'K_lean', create: kLeanRun, replace: kLeanRun },
  { name: 'J_fused', ops: ['create'], create: jFusedRun, replace: jFusedRun },
  { name: 'V_vanilla', create: vVanillaRun, replace: vVanillaRun },
];

// E_fused builds its own data — special-cased in the loop below.

const N = 50;
const WARM = 6;

function med(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[s.length >> 1]!;
}
function p90(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, (s.length * 0.9) | 0)]!;
}

type Agg = { n: number; total: { min: number; med: number; p90: number }; stages: Record<string, number> };

function aggregate(rows: StageRow[], layouts: number[]): Agg {
  const totals = rows.map((r) => r.total);
  const stageKeys = ['data', 'render', 'parse', 'map', 'insert'] as const;
  const stages: Record<string, number> = {};
  for (const k of stageKeys) stages[k] = +med(rows.map((r) => r[k])).toFixed(3);
  stages['layout'] = +med(layouts).toFixed(3);
  return {
    n: rows.length,
    total: { min: +Math.min(...totals).toFixed(3), med: +med(totals).toFixed(3), p90: +p90(totals).toFixed(3) },
    stages,
  };
}

async function benchVariant(v: Variant, op: 'create' | 'replace', pass: number): Promise<{ rows: StageRow[]; layouts: number[] }> {
  const rows: StageRow[] = [];
  const layouts: number[] = [];
  // setup initial state
  dropRowsKeepAnchor();
  if (op === 'replace') {
    const pre = buildData(1000);
    const st: StageRow = { ...T0 };
    v.create(pre, st);
  }
  await raf2();
  for (let i = 0; i < WARM; i++) {
    const st: StageRow = { ...T0 };
    const items = buildData(1000);
    if (op === 'create') v.create(items, st);
    else v.replace(items, st);
    if (op === 'create') dropRowsKeepAnchor();
    await raf2();
  }
  for (let i = 0; i < N; i++) {
    gcNow();
    await raf2();
    const st: StageRow = { ...T0 };
    let items: Row[] | undefined;
    const t0 = now();
    if (v.fused && op === 'create') {
      items = eFusedRun(undefined, st);
    } else {
      items = buildData(1000);
      st.data = now() - t0;
      if (op === 'create') v.create(items, st);
      else v.replace(items, st);
    }
    st.total = now() - t0;
    const tl = now();
    await raf2();
    st.layout = now() - tl;
    rows.push(st);
    layouts.push(st.layout);
    if (op === 'create') dropRowsKeepAnchor();
  }
  await raf2();
  return { rows, layouts };
}

async function benchE(op: 'create' | 'replace'): Promise<{ rows: StageRow[]; layouts: number[] }> {
  const rows: StageRow[] = [];
  const layouts: number[] = [];
  const setup = () => {
    dropRowsKeepAnchor();
    if (op === 'replace') eFusedRun(undefined, { ...T0 });
  };
  setup();
  await raf2();
  for (let i = 0; i < WARM; i++) {
    eFusedRun(undefined, { ...T0 });
    if (op === 'create') dropRowsKeepAnchor();
    await raf2();
  }
  for (let i = 0; i < N; i++) {
    gcNow();
    await raf2();
    const st: StageRow = { ...T0 };
    const t0 = now();
    eFusedRun(undefined, st);
    st.total = now() - t0;
    const tl = now();
    await raf2();
    st.layout = now() - tl;
    rows.push(st);
    layouts.push(st.layout);
    if (op === 'create') dropRowsKeepAnchor();
  }
  await raf2();
  return { rows, layouts };
}

async function runAll(): Promise<Record<string, Record<string, Agg>>> {
  const out: Record<string, Record<string, Agg>> = {};
  const bucket: Record<string, Record<string, StageRow[]>> = {};
  const layoutBucket: Record<string, Record<string, number[]>> = {};
  for (const v of variants) {
    bucket[v.name] = { create: [], replace: [] };
    layoutBucket[v.name] = { create: [], replace: [] };
  }
  bucket['E_fused'] = { create: [], replace: [] };
  layoutBucket['E_fused'] = { create: [], replace: [] };

  // two passes: forward + reverse to cancel drift
  const order = variants.map((v) => v.name);
  const passes = [order, [...order].reverse()];
  for (let p = 0; p < passes.length; p++) {
    for (const name of passes[p]!) {
      const ops: readonly ('create' | 'replace')[] =
        variants.find((v) => v.name === name)?.ops ?? ['create', 'replace'];
      for (const op of ops) {
        console.log('trace: pass', p, name, op, 'begin', performance.now().toFixed(0));
        const r =
          name === 'E_fused'
            ? await benchE(op)
            : await benchVariant(variants.find((v) => v.name === name)!, op, p);
        console.log('trace: pass', p, name, op, 'done', performance.now().toFixed(0));
        bucket[name]![op]!.push(...r.rows);
        layoutBucket[name]![op]!.push(...r.layouts);
        (out[name] ??= {})[op] = aggregate(r.rows, r.layouts);
        await new Promise((res) => setTimeout(res, 20));
      }
    }
  }
  // combined aggregates across both passes
  for (const name of Object.keys(bucket)) {
    for (const op of ['create', 'replace'] as const) {
      if (bucket[name]![op]!.length > 0) {
        out[name]![op + '_all'] = aggregate(bucket[name]![op]!, layoutBucket[name]![op]!);
      }
    }
  }

  // destroy-side A/B: current replaceChildren vs container clone-swap, 1k and 10k
  const clearAgg: Record<string, { cur: number; swap: number }> = {};
  for (const count of [1000, 10000]) {
    const cur: number[] = [];
    const swp: number[] = [];
    for (let i = 0; i < WARM; i++) {
      dropRowsKeepAnchor();
      prefill(count);
    }
    await raf2();
    for (let i = 0; i < N; i++) {
      // current: attached replaceChildren
      dropRowsKeepAnchor();
      prefill(count);
      gcNow();
      await raf2();
      const s1: StageRow = { ...T0 };
      hCurClear(s1);
      cur.push(s1.insert);
      // swap: wholesale
      dropRowsKeepAnchor();
      prefill(count);
      await raf2();
      const s2: StageRow = { ...T0 };
      hSwapClear(s2);
      swp.push(s2.insert);
    }
    await raf2();
    clearAgg['n' + count] = { cur: +med(cur).toFixed(3), swap: +med(swp).toFixed(3) };
  }
  (out as Record<string, unknown>)['__clearAB'] = clearAgg;

  return out as Record<string, Record<string, Agg>>;
}

const btn = document.createElement('button');
btn.id = 'start';
btn.textContent = 'run trace';
document.body.prepend(btn);

/** prefill `count` rows via the fused clone loop (untimed setup) */
function prefill(count: number): void {
  for (let i = 0; i < count; i++) {
    const tr = protoTr.cloneNode(true) as unknown as HTMLElement;
    ((tr.childNodes[0] as HTMLElement).firstChild as Text).data = String(i);
    ((tr.childNodes[1] as HTMLElement).firstChild as HTMLElement).firstChild!.textContent = 'row ' + i;
    tbody.appendChild(tr);
  }
}

btn.onclick = async () => {
  const r = await runAll();
  const pre = document.createElement('pre');
  pre.id = 'result';
  pre.textContent = JSON.stringify(r);
  document.body.appendChild(pre);
};
