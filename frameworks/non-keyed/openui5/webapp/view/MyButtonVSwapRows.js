sap.ui.define(
  ["sap/ui/core/mvc/View", "sap/m/Button"],
  function (View, Button) {
    return View.extend("ui5.benchmark.view.MyButtonVSwapRows", {
      // define, which controller to use
      getControllerName: function () {
        return "ui5.benchmark.controller.App";
      },
      // whether the ID of content controls should be prefixed automatically with the view ID
      getAutoPrefixId: function () {
        return false; // default is false
      },
      // create view content and return the root control(s)
      createContent: function (oController) {
        return new Button({
          id: "swaprows",
          text: "Swap Rows",
          press: oController._swapRows.bind(this),
        })
          .addStyleClass("btn")
          .addStyleClass("btn-primary")
          .addStyleClass("btn-block");
      },
    });
  }
);
