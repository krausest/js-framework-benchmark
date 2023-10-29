sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("ui5.benchmark.controller.App", {
    _run() {
      const oData2 = this.getModel("list").getData();

      oData2.elements = buildData();
      this.getModel("list").setData(oData2);
    },
    _runLots() {
      const oData2 = this.getModel("list").getData();

      oData2.elements = buildData(10000);
      this.getModel("list").setData(oData2);
    },
    _add() {
      const oData2 = this.getModel("list").getData();

      oData2.elements = [...oData2.elements, ...buildData(1000)];
      this.getModel("list").setData(oData2);
    },
    _update() {
      const oData2 = this.getModel("list").getData();
      for (let i = 0; i < oData2.elements.length; i += 10) {
        oData2.elements[i].label += " !!!";
      }
      this.getModel("list").setData(oData2);
    },
    _clear() {
      this.getModel("list").setData({ elements: [] });
    },
    _swapRows() {
      const oData2 = this.getModel("list").getData();
      if (oData2.elements.length > 998) {
        const d1 = oData2.elements[1];
        const d998 = oData2.elements[998];
        oData2.elements[1] = d998;
        oData2.elements[998] = d1;
      }

      this.getModel("list").setData(oData2);
    },
  });
});

let ID = 1;

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count = 1000) {
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
  ];
  const colours = [
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
  ];
  const nouns = [
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
  const data = [];
  for (let i = 0; i < count; i++)
    data.push({
      id: ID++,
      label:
        adjectives[_random(adjectives.length)] +
        " " +
        colours[_random(colours.length)] +
        " " +
        nouns[_random(nouns.length)],
    });
  return data;
}
