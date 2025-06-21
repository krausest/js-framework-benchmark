import { type FT, defineElement, useTemplate } from "plaited";

let did = 1;
const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];

const random = (max: number) => Math.round(Math.random() * 1000) % max;

type DataItem = { id: number; label: string };
type Data = DataItem[];
const buildData = (count: number): Data => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: did++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`,
    });
  }
  return data;
};

const Button: FT<{ id: string; value?: number }> = (attrs) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" {...attrs} />
  </div>
);

const shadowDom = (
  <>
    <link href="/css/currentStyle.css" rel="stylesheet" />
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Plaited-"keyed"</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button p-trigger={{ click: "run" }} id="run" value={1000}>
                Create 1,000 rows
              </Button>
              <Button p-trigger={{ click: "run" }} id="runlots" value={10000}>
                Create 10,000 rows
              </Button>
              <Button p-trigger={{ click: "add" }} id="add" value={1000}>
                Append 1,000 rows
              </Button>
              <Button p-trigger={{ click: "update" }} id="update">
                Update every 10th row
              </Button>
              <Button p-trigger={{ click: "clear" }} id="clear">
                Clear
              </Button>
              <Button p-trigger={{ click: "swapRows" }} id="swaprows">
                Swap Rows
              </Button>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody id="tbody" p-target="tbody" p-trigger={{ click: "interact" }} />
      </table>
    </div>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    <template p-target="row-template">
      <tr p-target="row">
        <td className="col-md-1" p-target="id"></td>
        <td className="col-md-4">
          <a p-target="label"></a>
        </td>
        <td className="col-md-1">
          <a>
            <span className="glyphicon glyphicon-remove" aria-hidden="true" p-target="delete"></span>
          </a>
        </td>
        <td className="col-md-6"></td>
      </tr>
    </template>
  </>
);
defineElement({
  tag: "js-benchmark",
  shadowDom,
  bProgram({ $ }) {
    let selected = -1;
    const [tbody] = $("tbody");
    const [template] = $<HTMLTemplateElement>("row-template");
    const cb = useTemplate<DataItem>(template, ($, data) => {
      $("row")[0].attr("p-target", data.id);
      $("id")[0].render(data.id);
      $("label")[0].render(data.label);
    });
    return {
      add(evt: MouseEvent & { target: HTMLButtonElement }) {
        tbody.insert("beforeend", ...buildData(parseInt(evt.target.value)).map(cb));
      },
      run(evt: MouseEvent & { target: HTMLButtonElement }) {
        tbody.render(...buildData(parseInt(evt.target.value)).map(cb));
      },
      clear() {
        tbody.replaceChildren();
      },
      interact(evt: MouseEvent & { target: HTMLElement }) {
        const target = evt.target;
        const pTarget = target.getAttribute("p-target");
        if (pTarget === "delete") return target.closest("tr").remove();
        if (pTarget === "label") {
          if (selected > -1) {
            $(`${selected}`)[0]?.attr("class", null);
          }
          const row = target.closest<ReturnType<typeof $>[number]>("tr");
          row.attr("class", "danger");
          selected = parseInt(row.getAttribute("p-target"));
        }
      },
      swapRows() {
        const rows = Array.from(tbody.childNodes);
        tbody.insertBefore(rows[1], rows[999]);
        tbody.insertBefore(rows[998], rows[2]);
      },
      update() {
        const labels = $("label");
        const length = labels.length;
        for (let i = 0; i < length; i += 10) {
          labels[i].insert("beforeend", " !!!");
        }
      },
    };
  },
});
