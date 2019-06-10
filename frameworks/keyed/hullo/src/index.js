const { Atom, map, deepMapByKey } = require("@hullo/core");
const { html, mount } = require("@hullo/dom");

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = [
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
  "fancy"
];
const C = [
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
  "orange"
];
const N = [
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
  "keyboard"
];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`
    };
  }
  return data;
}

function GlyphIcon() {
  return html.span({
    props: { className: "glyphicon glyphicon-remove" },
    attrs: { "aria-hidden": "true" }
  });
}

function Td(props) {
  return html.td(
    {
      props: Object.assign(
        {
          className: "col-md-" + props.span
        },
        props.text
          ? {
              textContent: props.text
            }
          : {}
      )
    },
    props.children
  );
}

function Link(props) {
  return html.a(
    {
      props: props.text
        ? {
            textContent: props.text
          }
        : {},
      events: { click: props.click }
    },
    props.children
  );
}

function Row(props) {
  const item$ = props.item;

  return html.tr(
    {
      props: {
        className: item$.pipe(map(item => (item.selected ? "danger" : "")))
      }
    },
    [
      Td({
        span: 1,
        text: item$.pipe(map(item => item.id))
      }),

      Td({
        span: 4,
        children: [
          Link({
            text: item$.pipe(map(item => item.label)),
            click: () => {
              props.select(item$.valueOf().id);
            }
          })
        ]
      }),

      Td({
        span: 1,
        children: [
          Link({
            children: [GlyphIcon()],
            click: () => {
              props.remove(item$.valueOf().id);
            }
          })
        ]
      })
    ]
  );
}

function Button(props) {
  return html.div({ props: { className: "col-sm-6 smallpad" } }, [
    html.button({
      props: {
        id: props.id,
        className: "btn btn-primary btn-block",
        type: "button",
        textContent: props.title
      },
      events: { click: props.cb }
    })
  ]);
}

function Jumbotron(props) {
  return html.div({ props: { className: "jumbotron" } }, [
    html.div({ props: { className: "row" } }, [
      html.div({ props: { className: "col-md-6" } }, [
        html.h1({ props: { textContent: "Hullo keyed" } })
      ]),
      html.div({ props: { className: "col-md-6" } }, [
        html.div({ props: { className: "row" } }, [
          Button({ id: "run", title: "Create 1,000 rows", cb: props.run }),
          Button({
            id: "runlots",
            title: "Create 10,000 rows",
            cb: props.runLots
          }),
          Button({ id: "add", title: "Append 1,000 rows", cb: props.add }),
          Button({
            id: "update",
            title: "Update every 10th row",
            cb: props.update
          }),
          Button({ id: "clear", title: "Clear", cb: props.clear }),
          Button({ id: "swaprows", title: "Swap Rows", cb: props.swapRows })
        ])
      ])
    ])
  ]);
}

function Main() {
  const state$ = new Atom({ data: [], selected: 0 });

  const run = () => {
    // console.time("run");
    state$.next({
      data: buildData(1000),
      selected: 0
    });
  };

  const runLots = () => {
    // console.time("runLots");
    state$.next({
      data: buildData(10000),
      selected: 0
    });
    // console.timeEnd("runLots");
  };

  const add = () => {
    // console.time("add");
    state$.next({
      data: state$.valueOf().data.concat(buildData(1000)),
      selected: 0
    });
    // console.timeEnd("add");
  };

  const update = () => {
    // console.time("update");
    const newData = state$.valueOf().data.slice(0);
    for (let i = 0; i < newData.length; i += 10) {
      const item = newData[i];
      newData[i] = { id: item.id, label: item.label + " !!!" };
    }
    state$.next({
      data: newData,
      selected: state$.valueOf().selected
    });
    // console.timeEnd("update");
  };

  const clear = () => {
    // console.time("clear");
    state$.next({
      data: [],
      selected: 0
    });
    // console.timeEnd("clear");
  };

  const swapRows = () => {
    // console.time("swap");
    const newData = state$.valueOf().data.slice(0);
    if (newData.length > 998) {
      let temp = newData[1];
      newData[1] = newData[998];
      newData[998] = temp;
    }
    state$.next({
      data: newData,
      selected: state$.valueOf().selected
    });
    // console.timeEnd("swap");
  };

  const select = id => {
    // console.time("select");
    state$.next({
      data: state$.valueOf().data,
      selected: id
    });
    // console.timeEnd("select");
  };

  const remove = id => {
    // console.time("remove");
    const newData = state$.valueOf().data.slice(0);
    newData.splice(newData.findIndex(item => item.id === id), 1);
    state$.next({
      data: newData,
      selected: state$.valueOf().selected === id ? 0 : state$.valueOf().selected
    });
    // console.timeEnd("remove");
  };

  return html.div({ props: { className: "container" } }, [
    Jumbotron({ run, runLots, add, update, clear, swapRows }),
    html.table(
      { props: { className: "table table-hover table-striped test-data" } },
      [
        html.tbody(
          {},
          state$
            .pipe(
              map(({ selected, data }) =>
                data.map(item =>
                  item.id === selected
                    ? { id: item.id, label: item.label, selected: true }
                    : item
                )
              )
            )
            .pipe(
              deepMapByKey(
                (itemAndSelection$, _i) => {
                  return Row({
                    item: itemAndSelection$,
                    select,
                    remove
                  });
                },
                itemAndSelection => itemAndSelection.id.toString()
              )
            )
        )
      ]
    ),
    html.span({
      props: { className: "preloadicon glyphicon glyphicon-remove" },
      attrs: {
        "aria-hidden": "true"
      }
    })
  ]);
}

mount(document.getElementById("main"), Main());
