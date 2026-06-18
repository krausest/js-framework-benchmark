import "nuclo";

const adjectives = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint",
  "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly",
  "adorable", "important", "inexpensive", "cheap", "expensive", "fancy",
];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

interface Row {
  id: number;
  label: string;
}

let nextId = 1;
let rows: Row[] = [];
let selectedId: number | null = null;

function buildData(count: number): Row[] {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`,
    };
  }
  return data;
}

function doRun(): void {
  rows = buildData(1000);
  selectedId = null;
  update();
}

function doRunLots(): void {
  rows = buildData(10000);
  selectedId = null;
  update();
}

function doAdd(): void {
  rows = rows.concat(buildData(1000));
  update();
}

function doUpdate(): void {
  for (let i = 0; i < rows.length; i += 10) {
    rows[i]!.label += " !!!";
  }
  update();
}

function doClear(): void {
  rows = [];
  selectedId = null;
  update();
}

function doSwapRows(): void {
  if (rows.length > 998) {
    const tmp = rows[1]!;
    rows[1] = rows[998]!;
    rows[998] = tmp;
    update();
  }
}

function doSelect(id: number): void {
  selectedId = id;
  update();
}

function doDelete(id: number): void {
  rows = rows.filter((r) => r.id !== id);
  update();
}

const app = div(
  { className: "container" },
  div(
    { className: "jumbotron" },
    div(
      { className: "row" },
      div({ className: "col-md-6" }, h1("Nuclo")),
      div(
        { className: "col-md-6" },
        div(
          { className: "row" },
          div(
            { className: "col-sm-6 smallpad" },
            button(
              { type: "button", className: "btn btn-primary btn-block", id: "run" },
              on("click", doRun),
              "Create 1,000 rows",
            ),
          ),
          div(
            { className: "col-sm-6 smallpad" },
            button(
              { type: "button", className: "btn btn-primary btn-block", id: "runlots" },
              on("click", doRunLots),
              "Create 10,000 rows",
            ),
          ),
          div(
            { className: "col-sm-6 smallpad" },
            button(
              { type: "button", className: "btn btn-primary btn-block", id: "add" },
              on("click", doAdd),
              "Append 1,000 rows",
            ),
          ),
          div(
            { className: "col-sm-6 smallpad" },
            button(
              { type: "button", className: "btn btn-primary btn-block", id: "update" },
              on("click", doUpdate),
              "Update every 10th row",
            ),
          ),
          div(
            { className: "col-sm-6 smallpad" },
            button(
              { type: "button", className: "btn btn-primary btn-block", id: "clear" },
              on("click", doClear),
              "Clear",
            ),
          ),
          div(
            { className: "col-sm-6 smallpad" },
            button(
              { type: "button", className: "btn btn-primary btn-block", id: "swaprows" },
              on("click", doSwapRows),
              "Swap Rows",
            ),
          ),
        ),
      ),
    ),
  ),
  table(
    { className: "table table-hover table-striped test-data" },
    tbody(
      list(
        () => rows,
        (row: Row) =>
          tr(
            { className: () => (selectedId === row.id ? "danger" : "") },
            td({ className: "col-md-1" }, String(row.id)),
            td({ className: "col-md-4" }, a(on("click", () => doSelect(row.id)), () => row.label)),
            td(
              { className: "col-md-1" },
              a(
                on("click", () => doDelete(row.id)),
                span({ className: "glyphicon glyphicon-remove", "aria-hidden": "true" }),
              ),
            ),
            td({ className: "col-md-6" }),
          ),
      ),
    ),
  ),
  span({ className: "preloadicon glyphicon glyphicon-remove", "aria-hidden": "true" }),
);

render(app, document.getElementById("main")!);
