import { cample, component, each } from "cample";

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
  colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ],
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

let id = 1;

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const buildData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++)
    data.push({
      id: id++,
      label:
        adjectives[_random(adjectives.length)] +
        " " +
        colours[_random(colours.length)] +
        " " +
        nouns[_random(nouns.length)],
    });
  return data;
};
const eachComponent = each(
  "table-rows",
  ({ importedData }) => importedData.rows,
  `<tr class="{{[selected]}}">
    <td class='col-md-1'>{{row.id}}</td>
    <td class='col-md-4'><a :click="{{importedData.setSelected(row.id)}}" class='lbl'>{{row.label}}</a></td>
    <td class='col-md-1'><a :click="{{importedData.delete(row.id)}}" class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td>
    <td class='col-md-6'></td>
  </tr>`,
  {
    values: ({ row, importedData }) => {
      return {
        selected: {
          danger: row.id === importedData.selected,
        },
      };
    },
    valueName: "row",
    functionName: "updateTable",
    import: {
      value: ["rows", "selected", "setSelected", "delete"],
      exportId: "mainExport",
    },
  }
);
const mainComponent = component(
  "main-component",
  `<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>cample-"non-keyed"</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='run'>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='runlots'>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='add'>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='update'>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='clear'>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody id="tbody"><template data-cample-import="{{{tableData}}}" data-cample="table-rows"></template></tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`,
  {
    data: () => {
      return {
        rows: [],
        selected: null,
      };
    },
    functions: {
      updateRows: "rows",
      updateSelected: "selected",
    },
    script: [
      ({ functions, elements }) => {
        const addListener = (key, fn) => {
          elements[key].addEventListener("click", () => {
            functions.updateRows(fn);
          });
        };
        addListener("run", () => {
          return buildData(1000);
        });
        addListener("runLots", () => {
          return buildData(10000);
        });
        addListener("add", (d) => {
          return [...d, ...buildData(1000)];
        });
        addListener("update", (d) => {
          const value = d.slice();
          for (let i = 0; i < value.length; i += 10) {
            const item = value[i];
            value[i] = { ...item, label: item.label + " !!!" };
          }
          return value;
        });
        addListener("clear", () => {
          return [];
        });
        addListener("swapRows", (d) => {
          const value = d.slice();
          const tmp = value[1];
          value[1] = value[998];
          value[998] = tmp;
          return value;
        });
      },
      {
        start: "afterLoad",
        elements: [
          { run: "#run" },
          { runLots: "#runlots" },
          { add: "#add" },
          { update: "#update" },
          { clear: "#clear" },
          { swapRows: "#swaprows" },
        ],
      },
    ],
    export: {
      tableData: {
        data: {
          rows: "rows",
          selected: "selected",
        },
        functions: {
          setSelected: [
            (setData) => (id) => {
              setData(() => id);
            },
            "updateSelected",
          ],
          delete: [
            (setData) => (id) => {
              setData((d) => {
                const idx = d.findIndex((d) => d.id === id);
                return [...d.slice(0, idx), ...d.slice(idx + 1)];
              });
            },
            "updateRows",
          ],
        },
      },
    },
    exportId: "mainExport",
  }
);

cample("#main").render("{{mainComponent}}", { mainComponent, eachComponent });
