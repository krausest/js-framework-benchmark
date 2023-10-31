sap.ui.define(
  ["sap/m/ColumnListItem", "./MyColumnListItemRenderer"],
  function (ColumnListItem, MyColumnListItemRenderer) {
    return ColumnListItem.extend("ui5.benchmark.element.MyColumnListItem", {
      metadata: {
        aggregations: {
          cells: {
            type: "sap.ui.core.Control",
            multiple: true,
            singularName: "cell",
            bindable: "bindable",
          },
        },
      },

      renderer: MyColumnListItemRenderer,
    });
  }
);
