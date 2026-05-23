import { drawingContext, EventCapture, diff, vtext, vnode, delegator, eventContext } from "haskell-miso";

function union<T extends object>(obj: T, updates: Partial<T>): T {
  return Object.assign({}, obj, updates);
}

const delegatedEvents: Array<EventCapture> = [
  { name: "click", capture: true }
];

/* helper for vnode creation */
var m = (tag, obj) => {
  return vnode(union({ tag }, obj));
};

/* current virtual DOM */
var currentVTree = null;

var initDelegator = () => {
  delegator(document.body, delegatedEvents, (f) => f(currentVTree), false, eventContext);
};

var render = () => {
  var newTree = view();
  diff(currentVTree, newTree, document.body, drawingContext);
  currentVTree = newTree;
};

var eventAction = function (f) {
  return {
    options: { preventDefault: false, stopPropagation: false },
    runEvent: function (e) {
      f(e);
      render();
    },
  };
}

var eventActionStop = function (f) {
  return {
    options: { preventDefault: false, stopPropagation: true },
    runEvent: function (e) {
      f(e);
      render();
    },
  };
}

var viewJumbotron = function () {
  return m("div", {
    classList: new Set(["jumbotron"]),
    children: [
      m("div", {
        classList: new Set (["row"]),
        children: [
          m("div", {
            classList: new Set (["col-md-6"]),
            children: [m("h1", { children: [ vtext("miso.js-1.9.0.0-keyed") ]})],
          }),
          m("div", {
            classList: new Set (["col-md-6"]),
            children: [
              m("div", {
                 classList: new Set (["row"]),
                 children: [
                   btn("Create 1,000 rows", "run"),
                   btn("Create 10,000 rows", "runlots"),
                   btn("Append 1,000 rows", "add"),
                   btn("Update every 10th row", "update"),
                   btn("Clear", "clear"),
                   btn("Swap Rows", "swaprows"),
                 ]
              })]
          })]
      })]
  });
};

var createData = (count = 1000) => {
  var adjectives = [
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
  ];
  var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  var nouns = [
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
  var data = [];
  for (var i = 0; i < count; i++)
    data.push({
      id: model.lastId++,
      label:
        adjectives[_random(adjectives.length)] +
        " " +
        colours[_random(colours.length)] +
        " " +
        nouns[_random(nouns.length)],
    });
  return data;
};

var _random = (max) => Math.round(Math.random() * 1000) % max;

var dispatch = function (op, id) {
  return function () {
    if (op === "swaprows") {
      if (model.data.length > 998) {
        var a = model.data[1];
        model.data[1] = model.data[998];
        model.data[998] = a;
      }
    }

    if (op === "run") {
      model.data = createData();
      model.selected = null;
    }

    if (op === "clear") {
      model.data = [];
      model.selected = null;
    }

    if (op === "select") {
      model.selected = id;
    }

    if (op === "runlots") {
      model.data = createData(10000);
      model.selected = null;
    }

    if (op === "add") {
      model.data = model.data.concat(createData(1000));
      model.selected = null;
    }

    if (op === "delete") {
      const idx = model.data.findIndex((d) => d.id == id);
      model.data = model.data.filter((e, i) => i != idx);
    }

    if (op === "update") {
      for (let i = 0; i < model.data.length; i += 10) model.data[i].label += " !!!";
    }
  };
};

var btn = (msg, op) =>
  m("div", {
    classList: new Set(["col-sm-6", "smallpad"]),
    children: [
      m("button", {
        classList: new Set(["btn", "btn-primary", "btn-block"]),
        props: {
          type: "button",
          id: op,
        },
        events: { captures: { click: eventAction(dispatch(op, op)) }, bubbles: {} },
        children: [vtext(msg)],
      }),
    ],
  });

var viewTable = () => {
  return m("table", {
    classList: new Set (["table", "table-hover", "table-striped", "test-data"]),
    children: [m("tbody", { props: { id: "tbody" }, children: model.data.map(makeRow) })],
  });
};

var makeRow = (x) => {
  return m("tr", {
    key: x.id,
    events: { captures: { click: eventAction(dispatch("select", x.id)) }, bubbles: {} },
    classList: new Set([x.id === model.selected ? "danger" : ""]),
    children: [
      m("td", {
        classList: new Set(["col-md-1"]),
        children: [vtext(x.id)],
      }),
      m("td", {
        classList: new Set(["col-md-4"]),
        children: [
          m("a", {
            classList: new Set(["lbl"]),
            children: [vtext(x.label)],
          }),
        ],
      }),
      m("td", {
        classList: new Set(["col-md-1"]),
        children: [
          m("a", {
            classList: new Set(["remove"]),
            children: [
              m("span", {
               props: { "aria-hidden": true },
               events: { captures: { click: eventActionStop(dispatch("delete", x.id)) }, bubbles: {} },
               classList: new Set(["remove", "glyphicon", "glyphicon-remove"]),
              })
            ]
          })
        ]
      }),
      m("td", {
        classList: new Set(["col-md-6"]),
      }),
    ],
  });
};

var view = () =>
  m("div", {
    classList: new Set(["container"]),
    children: [viewJumbotron(), viewTable()],
  });

/* initial model */
var model = null;

function init(config) {
  /* assign root object for convenience */
  model = config;

  /* set defaults */
  model.lastId = 1;
  model.data = [];

  /* initial draw */
  render();

  /* initial delegator */
  initDelegator();
}

/* initializes table */
globalThis.startApp = (config) => {
  init(config);
};
