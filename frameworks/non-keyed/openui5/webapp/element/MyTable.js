sap.ui.define(
  ["sap/m/table", "./MyTableRenderer"],
  function (Table, MyTableRenderer) {
    return Table.extend("ui5.benchmark.element.MyTable", {
      metadata: {
        aggregations: {
          columns: {
            type: "sap.m.Column",
            multiple: true,
            singularName: "column",
            dnd: { draggable: true, droppable: true, layout: "Horizontal" },
          },
        },
      },

      renderer: MyTableRenderer,
    });
  }
);
