/**
 * WCF Runtime Type Definitions
 * These types define the public API that developers use.
 */

/**
 * Core reactive primitive. Calling with no args returns the value,
 * calling with an arg sets the value and notifies subscribers.
 */
export type Signal<T> = {
  (): T;                                                    // Get value
  (newValue: T): T;                                         // Set value
  subscribe: (
    callback: (value: T) => void, 
    skipInitial?: boolean
  ) => () => void;                                          // Returns unsubscribe
};

/**
 * Factory function signature for creating signals
 */
export type SignalFactory = <T>(initialValue: T) => Signal<T>;

/**
 * Base class that all WCF components extend
 */
export abstract class Component extends HTMLElement {
  static styles: string;
  abstract render(): string;
  initializeBindings?(): void;
}

/**
 * Configuration for registering a component
 */
export interface ComponentConfig {
  selector: `${Lowercase<string>}-${Lowercase<string>}`;    // Must be kebab-case with hyphen
  type: 'page' | 'component';
}

/**
 * The root element for binding lookups (shadow root or element with getElementById)
 */
export type ComponentRoot = ShadowRoot | (HTMLElement & { 
  getElementById(id: string): HTMLElement | null 
});

/**
 * Event handler map for event delegation
 * Outer key: event type (click, keydown, etc.)
 * Inner key: handler ID (e0, e1, etc.)
 * Value: the handler function
 */
export type EventHandlerMap = Record<string, Record<string, (event: Event) => void>>;

/**
 * Item event handler map for repeat directives
 * Handlers receive the item signal and index in addition to the event
 */
export type ItemEventHandlerMap<T> = Record<string, Record<string, (
  itemSignal: Signal<T>, 
  index: number, 
  event: Event
) => void>>;

/**
 * Function that extracts a unique key from a repeat item for efficient diffing
 */
export type TrackByFn<T> = (item: T, index: number) => string | number;
