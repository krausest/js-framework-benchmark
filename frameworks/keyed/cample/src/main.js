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
  `<tr key="{{row.id}}" class="{{stack.class}}">
    <td class='col-md-1'>{{row.id}}</td>
    <td class='col-md-4'><a ::click="{{setSelected()}}" class='lbl'>{{row.label}}</a></td>
    <td class='col-md-1'><a ::click="{{importedData.delete(row.id)}}" class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td>
    <td class='col-md-6'></td>
  </tr>`,
  {
    valueName: "row",
    functionName: "updateTable",
    stackName: "stack",
    import: {
      value: ["rows", "delete"],
      exportId: "mainExport",
    },
    functions: {
      setSelected: [
        (setData, event, eachStack) => () => {
          event.stopPropagation();
          const { setStack, clearStack } = eachStack;
          clearStack();
          setStack(() => {
            return { class: "danger" };
          });
        },
        "updateTable",
      ],
    },
  }
);
const mainComponent = component(
  "main-component",
  `<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
              <h1>cample-"keyed"</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' :click="{{run()}}" id='run'>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' :click="{{runLots()}}" id='runlots'>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' :click="{{add()}}" id='add'>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' :click="{{update()}}" id='update'>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' :click="{{clear()}}" id='clear'>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' :click="{{swapRows()}}" id='swaprows'>Swap Rows</button>
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
      };
    },
    dataFunctions: {
      updateRows: "rows",
    },
    functions: {
      run: [
        (setData, event) => () => {
          event.stopPropagation();
          setData(() => buildData(1000));
        },
        "updateRows",
      ],
      runLots: [
        (setData, event) => () => {
          event.stopPropagation();
          setData(() => buildData(10000));
        },
        "updateRows",
      ],
      add: [
        (setData, event) => () => {
          event.stopPropagation();
          setData((d) => [...d, ...buildData(1000)]);
        },
        "updateRows",
      ],
      update: [
        (setData, event) => () => {
          event.stopPropagation();
          setData((d) => {
            const value = d.slice();
            for (let i = 0; i < value.length; i += 10) {
              const item = value[i];
              value[i] = { ...item, label: item.label + " !!!" };
            }
            return value;
          });
        },
        "updateRows",
      ],
      clear: [
        (setData, event) => () => {
          event.stopPropagation();
          setData(() => []);
        },
        "updateRows",
      ],
      swapRows: [
        (setData, event) => () => {
          event.stopPropagation();
          setData((d) => {
            const tmp = d[1];
            d[1] = d[998];
            d[998] = tmp;
            return d;
          });
        },
        "updateRows",
      ],
    },
    export: {
      tableData: {
        data: {
          rows: "rows",
        },
        functions: {
          delete: [
            (setData, event) => (id) => {
              event.stopPropagation();
              setData((d) => {
                const value = d.slice();
                let idx = -1;
                for (let i = 0; i < d.length; i++) {
                  const item = d[i];
                  if (item.id === id) {
                    idx = i;
                    break;
                  }
                }
                value.splice(idx, 1);
                return value;
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
