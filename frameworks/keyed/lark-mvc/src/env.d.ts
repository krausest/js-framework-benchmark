declare module "*.html" {
  const template: (data: Record<string, unknown>, viewId: string, refData: Record<string, unknown>) => string;
  export default template;
}
