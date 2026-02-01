/**
 * Runtime index
 * Main entry point for the runtime library
 */

// Global type declarations for template tags and directives
declare global {
  /**
   * Tagged template for HTML content
   */
  function html(strings: TemplateStringsArray, ...values: any[]): any;

  /**
   * Tagged template for CSS content
   */
  function css(strings: TemplateStringsArray, ...values: any[]): any;

  /**
   * Conditional directive - shows content when condition is truthy
   */
  function when(condition: boolean | (() => boolean)): string;

  /**
   * Conditional directive with else branch
   */
  function whenElse<T, F>(condition: boolean | (() => boolean), thenTemplate: T, elseTemplate: F): T | F;

  /**
   * Repeat directive for rendering arrays
   */
  function repeat<T>(
    items: T[] | (() => T[]), 
    templateFn: (item: T, index: number) => any, 
    emptyTemplate?: any, 
    trackBy?: (item: T, index: number) => string | number
  ): any[];

  /**
   * Navigate to a path (router)
   */
  function navigate(path: string): void;

  /**
   * Navigate back in history (router)
   */
  function navigateBack(): void;

  /**
   * Get a route parameter value (router)
   */
  function getRouteParam(paramName: string): string;
}

// Export types
export type { Signal, SignalFactory, ComponentConfig, ComponentRoot, EventHandlerMap, ItemEventHandlerMap, TrackByFn } from './types.js';

// Export signal
export { signal } from './signal.js';

// Export component
export { 
  Component, 
  registerComponent, 
  registerGlobalStyles, 
  globalStyleManager,
  mountComponent,
  mount,
  createComponentHTMLSelector,
  generateComponentHTML,
  type ComponentRoot as NativeComponentRoot
} from './component.js';

// Export DOM binding utilities
export { 
  __bindIf, 
  __bindIfExpr, 
  __bindRepeat, 
  __bindRepeatTpl,
  __bindNestedRepeat, 
  __setupEventDelegation, 
  __findEl 
} from './dom-binding.js';
