declare module "*.html" {
  import type { ViewTemplate } from "@lark.js/mvc";
  const template: ViewTemplate;
  export default template;
}
