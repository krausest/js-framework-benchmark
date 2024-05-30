declare module '@glint/environment-ember-template-imports/globals' {
  export default interface Globals {
    // used to hang any macros off of that are provided by config.additionalGlobals
    on: (
      noop: unknown,
      event: string,
      callback: (e: Event, element: Element) => void,
    ) => ModifierReturn;
  }
}

export {};
