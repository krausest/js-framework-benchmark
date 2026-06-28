import { Framework, registerViewClass } from "@lark.js/mvc";
import MainView from "./main";

registerViewClass("main", MainView);

Framework.boot({
  rootId: "main",
  defaultView: "main",
  vdom: true,
});
