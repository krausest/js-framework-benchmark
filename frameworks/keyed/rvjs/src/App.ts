import { a, button, div, dynamic, For, GetState, h1, SetState, span, table, tbody, td, tr, useState } from "@rvjs/core";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]; // prettier-ignore
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]; // prettier-ignore
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]; // prettier-ignore

interface Data {
  id: number;
  text: GetState<string>;
  setText: SetState<string>;
}

const App = () => {
  const [data, setData] = useState<Data[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  let rowId = 1;

  const runHandler = () => {
    setData(buildData(1000));
  };

  const runLotsHandler = () => {
    setData(buildData(10000));
  };

  const addHandler = () => {
    setData([...data(), ...buildData(1000)]);
  };

  const updateHandler = () => {
    const newData = data();
    for (let i = 0; i < newData.length; i += 10) {
      const { text, setText } = newData[i];
      setText(text() + " !!!");
    }
    setData([...newData]);
  };

  const clearHandler = () => {
    setData([]);
  };

  const swapRowsHandler = () => {
    const newData = [...data()];
    if (newData.length > 998) {
      let item = newData[1];
      newData[1] = newData[998];
      newData[998] = item;
      setData(newData);
    }
  };

  const selectOneHandler = (id: number) => {
    setSelected(id);
  };

  const removeOneHandler = (id: number) => {
    const index = data().findIndex((item) => item.id === id);
    const newData = [...data().slice(0, index), ...data().slice(index + 1)];
    setData(newData);
  };

  const random = (max: number) => {
    return Math.round(Math.random() * 1000) % max;
  };

  const buildData = (count: number) => {
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      const [text, setText] = useState(
        `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`
      );
      data[i] = { id: rowId++, text, setText };
    }
    return data as Data[];
  };

  return div({
    classes: ["container"],
    children: [
      div({
        classes: ["jumbotron"],
        children: [
          div({
            classes: ["row"],
            children: [
              div({
                classes: ["col-md-6"],
                children: [
                  h1({
                    textContent: "@rvjs/core",
                  }),
                ],
              }),
              div({
                classes: ["col-md-6"],
                children: [
                  div({
                    classes: ["row"],
                    children: [
                      div({
                        classes: ["col-sm-6", "smallpad"],
                        children: [
                          button({
                            type: "button",
                            id: "run",
                            classes: ["btn", "btn-primary", "btn-block"],
                            textContent: "Create 1,000 rows",
                            onclick: runHandler,
                          }),
                        ],
                      }),
                      div({
                        classes: ["col-sm-6", "smallpad"],
                        children: [
                          button({
                            type: "button",
                            id: "runlots",
                            classes: ["btn", "btn-primary", "btn-block"],
                            textContent: "Create 10,000 rows",
                            onclick: runLotsHandler,
                          }),
                        ],
                      }),
                      div({
                        classes: ["col-sm-6", "smallpad"],
                        children: [
                          button({
                            type: "button",
                            id: "add",
                            classes: ["btn", "btn-primary", "btn-block"],
                            textContent: "Append 1,000 rows",
                            onclick: addHandler,
                          }),
                        ],
                      }),
                      div({
                        classes: ["col-sm-6", "smallpad"],
                        children: [
                          button({
                            type: "button",
                            id: "update",
                            classes: ["btn", "btn-primary", "btn-block"],
                            textContent: "Update every 10th row",
                            onclick: updateHandler,
                          }),
                        ],
                      }),
                      div({
                        classes: ["col-sm-6", "smallpad"],
                        children: [
                          button({
                            type: "button",
                            id: "clear",
                            classes: ["btn", "btn-primary", "btn-block"],
                            textContent: "Clear",
                            onclick: clearHandler,
                          }),
                        ],
                      }),
                      div({
                        classes: ["col-sm-6", "smallpad"],
                        children: [
                          button({
                            type: "button",
                            id: "swaprows",
                            classes: ["btn", "btn-primary", "btn-block"],
                            textContent: "Swap Rows",
                            onclick: swapRowsHandler,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      table({
        classes: ["table", "table-hover", "table-striped", "test-data"],
        children: [
          tbody({
            children: [
              For(data, (item) => {
                const { id, text } = item;
                return tr({
                  classes: [dynamic(() => (selected() === id ? "danger" : ""))],
                  children: [
                    td({
                      classes: ["col-md-1"],
                      textContent: String(id),
                    }),
                    td({
                      classes: ["col-md-4"],
                      children: [
                        a({
                          onclick: () => selectOneHandler(id),
                          textContent: dynamic(text),
                        }),
                      ],
                    }),
                    td({
                      classes: ["col-md-1"],
                      children: [
                        a({
                          onclick: () => removeOneHandler(id),
                          children: [
                            span({
                              classes: ["glyphicon", "glyphicon-remove"],
                              ariaHidden: "true",
                            }),
                          ],
                        }),
                      ],
                    }),
                    td({
                      classes: ["col-md-6"],
                    }),
                  ],
                });
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export default App;
