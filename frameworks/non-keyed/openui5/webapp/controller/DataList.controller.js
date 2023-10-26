sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";
  let selected = null;
  return Controller.extend("ui5.benchmark.controller.DataList", {
    selectRow(oEvent) {
      const id =
        Number.parseInt(
          oEvent.getSource().getParent().mAggregations.cells[0].mProperties.text
        ) - 1;

      if (selected === id) {
        oEvent.getSource().getParent().removeStyleClass("danger");
      } else if (selected === null) {
        oEvent.getSource().getParent().addStyleClass("danger");
      } else if (selected != null) {
        oEvent.getSource().getParent().addStyleClass("danger");
        oEvent
          .getSource()
          .getParent()
          .getParent()
          .mAggregations.items[selected].removeStyleClass("danger");
      }
      selected = id;
    },
    deleteRow(oEvent) {
      const id = Number.parseInt(
        oEvent.getSource().getParent().mAggregations.cells[0].mProperties.text
      );
      const oData2 = this.getView().getModel("list").getData();

      oData2.elements.splice(
        oData2.elements.findIndex((d) => d.id == id),
        1
      );

      this.getView().getModel("list").setData(oData2);
    },
  });
});
