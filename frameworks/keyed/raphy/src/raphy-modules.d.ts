// Тип модуля `.raphy` для typecheck лаборатории; приложение получает его из
// `@raphy-js/vite/client`.
declare module '*.raphy' {
  const component: import('@raphy-js/core').AnyComponentDefinition
  export default component
}
