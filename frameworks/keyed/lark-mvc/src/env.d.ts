declare module "*.html" {
  import type { ViewTemplate, VDomTemplate } from "@lark.js/mvc";
  
  const template: ViewTemplate | VDomTemplate;
  export default template;
}
