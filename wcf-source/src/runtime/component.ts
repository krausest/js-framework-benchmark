/**
 * Component implementation - base class and registration
 * 
 * WCF uses native DOM mode - no Web Components Shadow DOM required.
 * Components are rendered as regular DOM elements with scoped styles.
 */

import type { Signal } from './types.js';

type LowercaseString = `${Lowercase<string>}`;
type ValidComponentSelector = `${LowercaseString}-${LowercaseString}`;

/**
 * Configuration for registering a component
 */
interface CreateComponentConfig {
  selector: ValidComponentSelector;
  type: 'page' | 'component';
}

/**
 * Internal component constructor interface
 */
interface InputComponent {
  new (...params: any[]): NativeComponent;
  styles: string;
  template?: HTMLTemplateElement;
}

type ComponentProps = Record<string, any>;
type ComponentHTMLSelector<T> = (props: T) => string;
type PageHTMLSelector = `<${ValidComponentSelector}></${ValidComponentSelector}>`;

/**
 * Root element type that supports getElementById
 */
export type ComponentRoot = ShadowRoot | (HTMLElement & { 
  getElementById(id: string): HTMLElement | null 
});

/**
 * Base component class that all WCF components extend
 * 
 * Uses native DOM instead of Shadow DOM for simpler implementation
 * while maintaining similar API patterns.
 */
export abstract class NativeComponent {
  static styles: string;
  static template?: HTMLTemplateElement;
  
  /** The root element containing component content */
  root: HTMLElement & { getElementById(id: string): HTMLElement | null };
  
  /** Alias for root to maintain shadowRoot-like API */
  get shadowRoot(): HTMLElement & { getElementById(id: string): HTMLElement | null } {
    return this.root;
  }
  
  /** Render method that returns the component's HTML */
  abstract render: () => string;
  
  /** Optional method to set up reactive bindings after render */
  initializeBindings?: () => void;
  
  constructor() {
    const el = document.createElement('div') as any;
    // Add getElementById method to element for binding lookups
    el.getElementById = (id: string): HTMLElement | null => {
      if (el.id === id) return el;
      return el.querySelector(`#${id}`);
    };
    this.root = el;
  }
}

// Export NativeComponent as Component for public API
export { NativeComponent as Component };

/**
 * Global style manager for registering shared styles
 */
export const globalStyleManager = {
  register(..._styles: string[]): void {
    // Styles are managed by registerGlobalStyles
  }
};

// Track registered styles to avoid duplicates
const registeredStyles = new Set<string>();

// Global style element reference
let globalStyleEl: HTMLStyleElement | null = null;

/**
 * Ensure global style element exists in document head
 */
const ensureGlobalStyleElement = (): HTMLStyleElement => {
  if (!globalStyleEl) {
    globalStyleEl = document.createElement('style');
    globalStyleEl.id = 'wcf-styles';
    document.head.appendChild(globalStyleEl);
  }
  return globalStyleEl;
};

/**
 * Register global styles to be added to the document
 * 
 * @param styles - CSS strings to register
 */
export function registerGlobalStyles(...styles: string[]): void {
  const styleEl = ensureGlobalStyleElement();
  for (const css of styles) {
    if (!registeredStyles.has(css)) {
      registeredStyles.add(css);
      styleEl.textContent += css + '\n';
    }
  }
}

// Map of component selectors to factory functions
const componentFactories = new Map<string, () => NativeComponent>();

/**
 * Register a component with the framework
 * 
 * Overload for 'component' type - returns a function that generates HTML with props
 */
export function registerComponent<T extends ComponentProps>(
  config: CreateComponentConfig & { type: 'component' }, 
  component: InputComponent
): ComponentHTMLSelector<T>;

/**
 * Register a component with the framework
 * 
 * Overload for 'page' type - returns an HTML selector string
 */
export function registerComponent(
  config: CreateComponentConfig & { type: 'page' }, 
  component: InputComponent
): PageHTMLSelector;

/**
 * Register a component with the framework
 * 
 * @param config - Component configuration (selector and type)
 * @param component - The component class to register
 * @returns HTML selector for page type, or function for component type
 */
export function registerComponent<T extends ComponentProps>(
  config: CreateComponentConfig, 
  component: InputComponent
): ComponentHTMLSelector<T> | PageHTMLSelector {
  const { selector } = config;
  
  // Register component styles if not already registered
  if (component.styles && !registeredStyles.has(selector)) {
    registeredStyles.add(selector);
    const styleEl = ensureGlobalStyleElement();
    // Scope :host selectors to component class
    const scopedStyles = component.styles
      .replace(/:host\b/g, `.${selector}`)
      .replace(/:host\(/g, `.${selector}(`);
    styleEl.textContent += `/* ${selector} */\n${scopedStyles}\n`;
  }
  
  // Create factory function for component instantiation
  const factory = (): NativeComponent => {
    const instance = new component() as NativeComponent;
    instance.root.className = selector;
    instance.root.setAttribute('data-wcf', selector);
    
    const ctor = component as typeof NativeComponent;
    if (ctor.template) {
      // Use pre-compiled template if available
      instance.root.appendChild(ctor.template.content.cloneNode(true));
      instance.render();
    } else {
      // Otherwise render HTML directly
      instance.root.innerHTML = instance.render();
    }
    
    // Initialize reactive bindings after render
    if (instance.initializeBindings) {
      instance.initializeBindings();
    }
    
    return instance;
  };
  
  componentFactories.set(selector, factory);
  
  if (config.type === 'page') {
    return `<${selector}></${selector}>` as PageHTMLSelector;
  } else {
    // Return a function that generates component HTML with props
    return (props: T) => {
      const propsString = Object.entries(props)
        .map(([key, value]) => {
          const val = typeof value === 'string' ? value : JSON.stringify(value) || '';
          return `${key}="${val.replace(/"/g, '&quot;')}"`;
        })
        .join(' ');
      return `<div data-wcf-component="${selector}" ${propsString}></div>`;
    };
  }
}

/**
 * Mount a page component to a target element
 * 
 * @param pageSelector - HTML selector string like <my-page></my-page>
 * @param target - DOM element to mount to (defaults to document.body)
 * @returns The mounted component instance or null if not found
 */
export function mountComponent(
  pageSelector: PageHTMLSelector | string,
  target: HTMLElement = document.body
): NativeComponent | null {
  const match = pageSelector.match(/<([^>]+)>/);
  if (!match) return null;
  
  const selector = match[1]!;
  const factory = componentFactories.get(selector);
  
  if (!factory) {
    console.error(`Component not found: ${selector}`);
    return null;
  }
  
  const instance = factory();
  target.appendChild(instance.root);
  
  return instance;
}

// Alias for mountComponent
export { mountComponent as mount };

/**
 * Generate HTML selector function for a component
 */
export function createComponentHTMLSelector<T extends ComponentProps>(
  selector: ValidComponentSelector
): ComponentHTMLSelector<T> {
  return (props: T) => {
    const propsString = Object.entries(props)
      .map(([key, value]) => {
        const val = typeof value === 'string' ? value : JSON.stringify(value) || '';
        return `${key}="${val.replace(/"/g, '&quot;')}"`;
      })
      .join(' ');
    return `<div data-wcf-component="${selector}" ${propsString}></div>`;
  };
}

/**
 * Generate component HTML string (for static rendering)
 */
export function generateComponentHTML(
  selector: ValidComponentSelector,
  props: ComponentProps = {}
): string {
  const propsString = Object.entries(props)
    .map(([key, value]) => {
      const val = typeof value === 'string' ? value : JSON.stringify(value) || '';
      return `${key}="${val.replace(/"/g, '&quot;')}"`;
    })
    .join(' ');
  return `<${selector} ${propsString}></${selector}>`;
}
