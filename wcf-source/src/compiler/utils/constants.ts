export const FN = {
  REGISTER_COMPONENT: 'registerComponent',
  SIGNAL: 'signal',
  HTML: 'html',
  CSS: 'css',
} as const;

export const CLASS = {
  COMPONENT: 'Component',
} as const;

export const COMPONENT_TYPE = {
  COMPONENT: 'component',
  PAGE: 'page',
} as const;

export const PROP = {
  SELECTOR: 'selector',
  TYPE: 'type',
  COMPONENT_MODULE: 'componentModule',
} as const;

export const PLUGIN_NAME = {
  TYPE_CHECK: 'type-check',
  ROUTES: 'routes-ctfe',
  COMPONENT: 'component-ctfe',
  REACTIVE: 'reactive-binding',
  STRIPPER: 'stripper',
  GLOBAL_CSS_BUNDLER: 'global-css-bundler',
  POST_BUILD: 'post-build',
} as const;

export const BIND_FN = {
  TEXT: '__bindText',
  STYLE: '__bindStyle',
  ATTR: '__bindAttr',
  IF: '__bindIf',
  IF_EXPR: '__bindIfExpr',
  REPEAT: '__bindRepeat',
  REPEAT_TPL: '__bindRepeatTpl',
  NESTED_REPEAT: '__bindNestedRepeat',
  EVENTS: '__setupEventDelegation',
  FIND_EL: '__findEl',
} as const;

export const generateSelectorHTML = (selector: string): string => `<${selector}></${selector}>`;
