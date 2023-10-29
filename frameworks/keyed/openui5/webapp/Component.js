sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  (UIComponent, JSONModel) => {
    "use strict";

    return UIComponent.extend("ui5.benchmark.Component", {
      metadata: {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json",
      },

      init() {
        // call the init function of the parent
        UIComponent.prototype.init.apply(this, arguments);

        // set data model on view
        var oModel2 = new JSONModel({
          elements: [],
        });

        oModel2.setSizeLimit(99999);
        // Assign the model object to the SAPUI5 core
        this.setModel(oModel2, "list");
      },
    });
  }
);
