global.Moon = require("moonjs");
var startTime;
var lastMeasure;
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
  "fancy"
];
var colours = [
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
  "keyboard"
];

var nounsLen = nouns.length;
var adjectivesLen = adjectives.length;
var coloursLen = colours.length;
var startMeasure = function(name) {
  startTime = performance.now();
  lastMeasure = name;
};
var stopMeasure = function() {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function() {
      lastMeasure = null;
      var stop = performance.now();
      console.log(last + " took " + (stop - startTime));
    }, 0);
  }
};

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

var id = 1;

var buildData = function(count) {
  if (count === undefined) {
    count = 1000;
  }

  var data = new Array(count);

  for (var i = 0; i < count; i++) {
    data[i] = {
      id: id++,
      label:
        adjectives[_random(adjectivesLen)] +
        " " +
        colours[_random(coloursLen)] +
        " " +
        nouns[_random(nounsLen)]
    };
  }

  return data;
};

new Moon({
  el: "#main",
  data: {
    data: [],
    selected: undefined,
    id: 1
  },
  methods: {
    run: function() {
      startMeasure("run");
      this.set("data", buildData());
      this.set("selected", undefined);
      stopMeasure("run");
    },
    runLots: function() {
      startMeasure("run");
      this.set("data", buildData(10000));
      this.set("selected", undefined);
      stopMeasure("run");
    },
    add: function() {
      startMeasure("add");
      var data = this.get("data");
      this.set("data", data.concat(buildData(1000)));
      stopMeasure("add");
    },
    update: function() {
      startMeasure("update");
      var data = this.get("data");
      for (var i = 0; i < data.length; i += 10) {
        data[i].label += " !!!";
      }
      this.set("data", data);
      stopMeasure("update");
    },
    clear: function() {
      startMeasure("clear");
      this.set("data", []);
      this.set("selected", undefined);
      stopMeasure("clear");
    },
    swap: function() {
      var data = this.get("data");
      if (data.length > 10) {
        startMeasure("swap");
        var tmp = data[4];
        data[4] = data[9];
        data[9] = tmp;
        this.set("data", data);
        stopMeasure("swap");
      }
    },
    handleClick: function(e) {
      var target = event.target;
      var action = target.__moon__action__;
      switch (action) {
        case 0:
          startMeasure("select");
          this.set("selected", target.__moon__id__);
          stopMeasure("select");
          break;
        case 1:
          startMeasure("remove");
          var data = this.get("data");
          data.splice(target.__moon__index__, 1);
          this.set("data", data);
          stopMeasure("remove");
          break;
      }
    }
  },
  render: function(m) {
    var instance = this;
    var selected = instance.get("selected");
    var data = instance.get("data");
    return m("div", { attrs: { id: "main" } }, { shouldRender: true }, [
      m("div", { attrs: { class: "container" } }, { shouldRender: true }, [
        m("div", { attrs: { class: "jumbotron" } }, { shouldRender: true }, [
          m("div", { attrs: { class: "row" } }, { shouldRender: true }, [
            m(
              "div",
              { attrs: { class: "col-md-6" } },
              { shouldRender: false },
              [
                m("h1", { attrs: {} }, { shouldRender: false }, [
                  m("#text", { shouldRender: false }, "Moon v0.11.0")
                ])
              ]
            ),
            m("div", { attrs: { class: "col-md-6" } }, { shouldRender: true }, [
              m("div", { attrs: { class: "row" } }, { shouldRender: true }, [
                m(
                  "div",
                  { attrs: { class: "col-sm-6 smallpad" } },
                  { shouldRender: true },
                  [
                    m(
                      "button",
                      {
                        attrs: {
                          type: "button",
                          class: "btn btn-primary btn-block",
                          id: "run"
                        }
                      },
                      {
                        shouldRender: true,
                        eventListeners: {
                          click: [
                            function(event) {
                              instance.callMethod("run", [event]);
                            }
                          ]
                        }
                      },
                      [m("#text", { shouldRender: false }, "Create 1,000 rows")]
                    )
                  ]
                ),
                m(
                  "div",
                  { attrs: { class: "col-sm-6 smallpad" } },
                  { shouldRender: true },
                  [
                    m(
                      "button",
                      {
                        attrs: {
                          type: "button",
                          class: "btn btn-primary btn-block",
                          id: "runlots"
                        }
                      },
                      {
                        shouldRender: true,
                        eventListeners: {
                          click: [
                            function(event) {
                              instance.callMethod("runLots", [event]);
                            }
                          ]
                        }
                      },
                      [
                        m(
                          "#text",
                          { shouldRender: false },
                          "Create 10,000 rows"
                        )
                      ]
                    )
                  ]
                ),
                m(
                  "div",
                  { attrs: { class: "col-sm-6 smallpad" } },
                  { shouldRender: true },
                  [
                    m(
                      "button",
                      {
                        attrs: {
                          type: "button",
                          class: "btn btn-primary btn-block",
                          id: "add"
                        }
                      },
                      {
                        shouldRender: true,
                        eventListeners: {
                          click: [
                            function(event) {
                              instance.callMethod("add", [event]);
                            }
                          ]
                        }
                      },
                      [m("#text", { shouldRender: false }, "Append 1,000 rows")]
                    )
                  ]
                ),
                m(
                  "div",
                  { attrs: { class: "col-sm-6 smallpad" } },
                  { shouldRender: true },
                  [
                    m(
                      "button",
                      {
                        attrs: {
                          type: "button",
                          class: "btn btn-primary btn-block",
                          id: "update"
                        }
                      },
                      {
                        shouldRender: true,
                        eventListeners: {
                          click: [
                            function(event) {
                              instance.callMethod("update", [event]);
                            }
                          ]
                        }
                      },
                      [
                        m(
                          "#text",
                          { shouldRender: false },
                          "Update every 10th row"
                        )
                      ]
                    )
                  ]
                ),
                m(
                  "div",
                  { attrs: { class: "col-sm-6 smallpad" } },
                  { shouldRender: true },
                  [
                    m(
                      "button",
                      {
                        attrs: {
                          type: "button",
                          class: "btn btn-primary btn-block",
                          id: "clear"
                        }
                      },
                      {
                        shouldRender: true,
                        eventListeners: {
                          click: [
                            function(event) {
                              instance.callMethod("clear", [event]);
                            }
                          ]
                        }
                      },
                      [m("#text", { shouldRender: false }, "Clear")]
                    )
                  ]
                ),
                m(
                  "div",
                  { attrs: { class: "col-sm-6 smallpad" } },
                  { shouldRender: true },
                  [
                    m(
                      "button",
                      {
                        attrs: {
                          type: "button",
                          class: "btn btn-primary btn-block",
                          id: "swaprows"
                        }
                      },
                      {
                        shouldRender: true,
                        eventListeners: {
                          click: [
                            function(event) {
                              instance.callMethod("swap", [event]);
                            }
                          ]
                        }
                      },
                      [m("#text", { shouldRender: false }, "Swap Rows")]
                    )
                  ]
                )
              ])
            ])
          ])
        ]),
        m(
          "table",
          { attrs: { class: "table table-hover table-striped test-data" } },
          {
            shouldRender: true,
            eventListeners: {
              click: [
                function(event) {
                  instance.callMethod("handleClick", [event]);
                }
              ]
            }
          },
          [
            m(
              "tbody",
              { attrs: {} },
              { shouldRender: true },
              [].concat.apply(
                [],
                [
                  Moon.renderLoop(data, function(item, index) {
                    return m(
                      "tr",
                      {
                        attrs: {
                          class: Moon.renderClass(
                            item.id === selected ? "danger" : ""
                          )
                        }
                      },
                      { shouldRender: true },
                      [
                        m(
                          "td",
                          { attrs: { class: "col-md-1" } },
                          { shouldRender: true },
                          [
                            m(
                              "#text",
                              { shouldRender: true },
                              "" + item.id + ""
                            )
                          ]
                        ),
                        m(
                          "td",
                          { attrs: { class: "col-md-4" } },
                          { shouldRender: true },
                          [
                            m(
                              "a",
                              {
                                attrs: {},
                                dom: {
                                  __moon__action__: 0,
                                  __moon__id__: item.id
                                }
                              },
                              { shouldRender: true },
                              [
                                m(
                                  "#text",
                                  { shouldRender: true },
                                  "" + item.label + ""
                                )
                              ]
                            )
                          ]
                        ),
                        m(
                          "td",
                          { attrs: { class: "col-md-1" } },
                          { shouldRender: false },
                          [
                            m("a", { attrs: {} }, { shouldRender: false }, [
                              m(
                                "span",
                                {
                                  attrs: {
                                    class: "glyphicon glyphicon-remove",
                                    "aria-hidden": "true"
                                  },
                                  dom: {
                                    __moon__action__: 1,
                                    __moon__index__: index
                                  }
                                },
                                { shouldRender: false },
                                []
                              )
                            ])
                          ]
                        ),
                        m(
                          "td",
                          { attrs: { class: "col-md-6" } },
                          { shouldRender: false },
                          []
                        )
                      ]
                    );
                  })
                ]
              )
            )
          ]
        ),
        m(
          "span",
          {
            attrs: {
              class: "preloadicon glyphicon glyphicon-remove",
              "aria-hidden": "true"
            }
          },
          { shouldRender: false },
          []
        )
      ])
    ]);
  }
});
