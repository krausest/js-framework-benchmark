// ============================================================================
// plastron-dom — js-framework-benchmark NON-KEYED variant.
//
// Plastron-first shape (cookbook §1a): one cel for the rows array, one
// cel for selectedIdx, one native-fn cel that emits the <tbody> vnode.
// Krausest button clicks call `set` against the rows / selectedIdx cels;
// the painter diffs against the previous vnode and applies the patch.
//
// This variant omits the `key:` prop on <tr> vnodes — plastron-dom's
// diffChildren falls back to positional matching. Swap and remove
// operations will regenerate every row from the changed index forward,
// which is the worst case for index-based diffs. That's the expected
// non-keyed-division performance characteristic.
//
// Local-iteration note: imports use deep relative paths into the
// plastron monorepo. The PR-to-krausest version swaps these for bare
// imports (`from "plastron"`, etc.) with github: deps in package.json.
// ============================================================================

import {
  createInitialState,
  precomputeOptional,
  type Fn,
  type Segment,
  type State,
} from "../../../../../plastron/src/index.js";
import { installDom, installDomSchemas } from "../../../../../segments/plastron-dom/src/index.js";
import { el, cx, onClick, onSet, vnodeSchema } from "../../../../../segments/plastron-dom/src/vnode.js";

// ── standard krausest data generator ────────────────────────────────────────

const A = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
  "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
  "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy",
];
const C = [
  "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
  "white", "black", "orange",
];
const N = [
  "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
  "sandwich", "burger", "pizza", "mouse", "keyboard",
];

interface Row { id: number; label: string }

let nextId = 1;
const buildData = (n: number): Row[] => {
  const out: Row[] = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = {
      id: nextId++,
      label:
        A[(Math.random() * A.length) | 0]! + " " +
        C[(Math.random() * C.length) | 0]! + " " +
        N[(Math.random() * N.length) | 0]!,
    };
  }
  return out;
};

// ── render lambda ───────────────────────────────────────────────────────────

interface BuildTbodyInput { rows: Row[]; sel: number | null }

const buildTbody = ({ rows, sel }: BuildTbodyInput) =>
  el(
    "tbody",
    null,
    ...rows.map((row) =>
      el(
        "tr",
        {
          // NON-KEYED: no `key` prop — plastron-dom uses positional diff
          class: cx(row.id === sel && "danger"),
        },
        el("td", { class: "col-md-1" }, String(row.id)),
        el(
          "td",
          { class: "col-md-4" },
          el(
            "a",
            { class: "lbl", onClick: onSet("krausest:selectedIdx", row.id) },
            row.label,
          ),
        ),
        el(
          "td",
          { class: "col-md-1" },
          el(
            "a",
            { class: "remove", onClick: onClick("krausest:removeRow", row.id) },
            el("span", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }),
          ),
        ),
        el("td", { class: "col-md-6" }),
      )
    ),
  );

// ── segment ─────────────────────────────────────────────────────────────────

const segment: Segment = {
  key: "krausest",
  cels: [
    { key: "krausest:rows",        v: [],   segment: "krausest" },
    { key: "krausest:selectedIdx", v: null, segment: "krausest" },
    {
      key: "krausest:tbody",
      segment: "krausest",
      l: "buildTbody",
      inputMap: { rows: "krausest:rows", sel: "krausest:selectedIdx" },
      schema: vnodeSchema,
    },
  ],
  fnMetaData: {
    buildTbody: {
      key: "buildTbody",
      inputSchema: "object",
      outputSchema: "object",
      arity: 1,
      source: buildTbody.toString(),
    },
  },
};

// ── boot ────────────────────────────────────────────────────────────────────

const main = async (): Promise<void> => {
  const state = createInitialState();
  const hydrate  = state.fns.get("hydrate")  as Fn;
  const runCycle = state.fns.get("runCycle") as Fn;
  const set      = state.fns.get("set")      as Fn;
  const update   = state.fns.get("update")   as Fn;

  // Register plastron-dom's schema BEFORE hydrate so the segment's
  // tree cel (which declares `schema: vnodeSchema`) gets its
  // `_isChanged` / `_diffFn` auto-wired during hydrate. Idempotent —
  // installDom calls this internally too.
  installDomSchemas(state);

  const removeRow = async (s: State, payload: unknown): Promise<State> => {
    const id = payload as number;
    return update(s, "krausest:rows", (cur: unknown) =>
      (cur as Row[]).filter((r) => r.id !== id),
    );
  };

  await hydrate(state, [segment], [
    new Map<string, Fn>([
      ["buildTbody", buildTbody as unknown as Fn],
      ["krausest:removeRow", removeRow],
    ]),
  ]);
  await runCycle(state);
  await precomputeOptional(state);

  // Mount with replaceTarget — the rendered <tbody> REPLACES the
  // placeholder <tbody id="tbody"> in the DOM (its id merges into the
  // rendered root automatically). Without replaceTarget, the rendered
  // tbody would nest inside the placeholder and break `tbody > tr`
  // selectors.
  installDom(state, {
    roots: {
      tbody: {
        selector: "#tbody",
        cel: "krausest:tbody",
        replaceTarget: true,
      },
    },
  });

  await runCycle(state);

  const $ = (id: string): HTMLElement => document.getElementById(id)!;

  $("run").onclick     = () => void set(state, "krausest:rows", buildData(1000));
  $("runlots").onclick = () => void set(state, "krausest:rows", buildData(10000));
  $("clear").onclick   = () => void set(state, "krausest:rows", []);

  $("add").onclick = () => void update(state, "krausest:rows",
    (cur: unknown) => (cur as Row[]).concat(buildData(1000)));

  $("update").onclick = () => void update(state, "krausest:rows", (cur: unknown) => {
    const rows = (cur as Row[]).slice();
    for (let i = 0; i < rows.length; i += 10) {
      rows[i] = { ...rows[i]!, label: rows[i]!.label + " !!!" };
    }
    return rows;
  });

  $("swaprows").onclick = () => void update(state, "krausest:rows", (cur: unknown) => {
    const rows = (cur as Row[]).slice();
    if (rows.length >= 999) {
      const t = rows[1]!;
      rows[1] = rows[998]!;
      rows[998] = t;
    }
    return rows;
  });
};

void main().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
