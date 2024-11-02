import { HTMLBuilder, HTMLView, renderToDOM } from "spheres/view";
import { RowData, rows, selectRow } from "./state.js";
import { State, Store, StoreMessage, use, write } from "spheres/store";

function app(root: HTMLBuilder) {
  root.div((el) => {
    el.config.class("container");
    el.children
      .div((el) => {
        el.config.class("jumbotron");
        el.children.div((el) => {
          el.config.class("row");
          el.children
            .div((el) => {
              el.config.class("col-md-6");
              el.children.h1((el) => {
                el.children.textNode("Spheres");
              });
            })
            .div((el) => {
              el.config.class("col-md-6");
              el.children.div((el) => {
                el.config.class("row");
                el.children
                  .subview(
                    button({
                      id: "run",
                      title: "Create 1,000 rows",
                      handler: () => write(rows, { type: "set", count: 1000 }),
                    })
                  )
                  .subview(
                    button({
                      id: "runlots",
                      title: "Create 10,000 rows",
                      handler: () => write(rows, { type: "set", count: 10000 }),
                    })
                  )
                  .subview(
                    button({
                      id: "add",
                      title: "Append 1,000 rows",
                      handler: () => write(rows, { type: "add", count: 1000 }),
                    })
                  )
                  .subview(
                    button({
                      id: "update",
                      title: "Update every 10th row",
                      handler: () => write(rows, { type: "update" }),
                    })
                  )
                  .subview(
                    button({
                      id: "clear",
                      title: "Clear",
                      handler: () => write(rows, { type: "clear" }),
                    })
                  )
                  .subview(
                    button({
                      id: "swaprows",
                      title: "Swap Rows",
                      handler: () => write(rows, { type: "swap" }),
                    })
                  );
              });
            });
        });
      })
      .table((el) => {
        el.config.class("table table-hover table-striped test-data");
        el.children.tbody((el) => {
          el.children.subviews((get) => get(rows), tableRow);
        });
      })
      .span((el) => {
        el.config.class("preloadicon glyphicon glyphicon-remove").aria("hidden", "true");
      });
  });
}

function tableRow(row: State<RowData>): HTMLView {
  return (root) =>
    root.tr((el) => {
      el.config
        .class((get) => (get(get(row).isSelected) ? "danger" : undefined));
      el.children
        .td((el) => {
          el.config.class("col-md-1");
          el.children.textNode((get) => `${get(row).id}`);
        })
        .td((el) => {
          el.config.class("col-md-4");
          el.children.a((el) => {
            el.config.class("lbl").on("click", () => use(selectRow(row)));
            el.children.textNode((get) => get(get(row).label));
          });
        })
        .td((el) => {
          el.config.class("col-md-1");
          el.children.a((el) => {
            el.config
              .class("remove")
              .on("click", () => use((get) => write(rows, { type: "remove", rowData: get(row) })));
            el.children.span((el) => {
              el.config.class("remove glyphicon glyphicon-remove").aria("hidden", "true");
            });
          });
        })
        .td((el) => {
          el.config.class("col-md-6");
        });
    });
}

interface ButtonContext {
  id: string;
  title: string;
  handler: (evt: Event) => StoreMessage<any>;
}

function button(props: ButtonContext): HTMLView {
  return (root) =>
    root.div((el) => {
      el.config.class("col-sm-6 smallpad");
      el.children.button((el) => {
        el.config.id(props.id).class("btn btn-primary btn-block").on("click", props.handler);
        el.children.textNode(props.title);
      });
    });
}

renderToDOM(new Store(), document.body, app);
