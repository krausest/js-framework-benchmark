/**
 * DOM Binding utilities for WCF runtime
 * 
 * Handles event delegation, conditional rendering, and repeat directives.
 */

import type { Signal } from './types.js';
import { signal as createSignal } from './signal.js';

/**
 * Root element type that supports getElementById
 */
type ComponentRoot = ShadowRoot | (HTMLElement & { getElementById(id: string): HTMLElement | null });

/**
 * Keyboard key code mappings for event modifiers
 */
const KEY_CODES: Record<string, string[]> = {
  enter: ['Enter'],
  tab: ['Tab'],
  delete: ['Backspace', 'Delete'],
  esc: ['Escape'],
  escape: ['Escape'],
  space: [' '],
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
};

/**
 * Set up event delegation on a component root
 * 
 * Uses data attributes to identify event handlers and supports modifiers:
 * - stop: stopPropagation()
 * - prevent: preventDefault()
 * - self: only trigger if target is the element itself
 * - keyboard modifiers: enter, tab, escape, etc.
 * 
 * @param root - The component root element
 * @param eventMap - Map of event types to handler functions
 * @returns Cleanup function to remove all listeners
 */
export const __setupEventDelegation = (
  root: ComponentRoot, 
  eventMap: Record<string, Record<string, (event: Event) => void>>
): (() => void) => {
  const cleanups: (() => void)[] = [];

  for (const eventType in eventMap) {
    const handlers = eventMap[eventType];
    const attrName = `data-evt-${eventType}`;

    const delegatedHandler = (event: Event) => {
      let target = event.target as Element | null;

      // Walk up the DOM tree looking for handlers
      while (target && target !== (root as unknown as Element)) {
        if (target instanceof HTMLElement) {
          const handlerIdWithModifiers = target.getAttribute(attrName);
          if (handlerIdWithModifiers) {
            const parts = handlerIdWithModifiers.split(':');
            const handlerId = parts[0];
            if (!handlerId) continue;

            const handler = handlers?.[handlerId];
            if (handler) {
              // Handle 'self' modifier - only trigger if target is exact element
              if (parts.includes('self') && event.target !== target) {
                target = target.parentElement;
                continue;
              }

              // Handle keyboard modifiers
              if (event instanceof KeyboardEvent) {
                let keyMatched = true;
                for (let i = 1; i < parts.length; i++) {
                  const mod = parts[i];
                  const keyCodes = mod ? KEY_CODES[mod] : undefined;
                  if (keyCodes) {
                    keyMatched = keyCodes.includes(event.key);
                    if (!keyMatched) break;
                  }
                }
                if (!keyMatched) {
                  target = target.parentElement;
                  continue;
                }
              }

              // Apply event modifiers
              if (parts.includes('prevent')) event.preventDefault();
              if (parts.includes('stop')) event.stopPropagation();

              // Call handler
              handler.call(null, event);

              return;
            }
          }
        }
        target = target.parentElement;
      }
    };

    // Use capture phase for delegation
    root.addEventListener(eventType, delegatedHandler, true);

    cleanups.push(() => {
      root.removeEventListener(eventType, delegatedHandler, true);
    });
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
};

// Temporary element for parsing HTML (lazy initialization)
let tempEl: HTMLTemplateElement | null = null;
const getTempEl = (): HTMLTemplateElement => {
  if (!tempEl) {
    tempEl = document.createElement('template');
  }
  return tempEl;
};

/**
 * Find an element by ID within a set of elements
 * Supports both id attribute and data-bind-id
 * Optimized for single-element arrays (common case in repeat)
 * 
 * @param elements - Array of elements to search within
 * @param id - The ID to find
 * @returns The found element or null
 */
export const __findEl = (elements: Element[], id: string): Element | null => {
  // Fast path for single element (most common case in repeat bindings)
  if (elements.length === 1) {
    const el = elements[0]!;
    // Check el itself first
    if (el.id === id) return el;
    const bindId = el.getAttribute('data-bind-id');
    if (bindId === id) return el;
    // Single querySelector with combined selector
    return el.querySelector(`#${id},[data-bind-id="${id}"]`);
  }
  
  // General case for multiple elements
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el) continue;
    if (el.id === id) return el;
    const bindId = el.getAttribute('data-bind-id');
    if (bindId === id) return el;
    const found = el.querySelector(`#${id},[data-bind-id="${id}"]`);
    if (found) return found;
  }
  return null;
};

/**
 * Internal helper for conditional binding (when/whenElse)
 * 
 * Manages showing/hiding content based on a condition, with lazy initialization
 * of nested bindings.
 */
const bindConditional = (
  root: ComponentRoot,
  id: string,
  template: string,
  initNested: () => (() => void)[],
  subscribe: (update: () => void) => (() => void)[],
  evalCondition: () => boolean,
): (() => void) => {
  let cleanups: (() => void)[] = [];
  let bindingsInitialized = false;

  // Check if content is already showing (not a <template> placeholder)
  const initialElement = root.getElementById(id);
  const initiallyShowing = initialElement?.tagName !== 'TEMPLATE';

  let contentEl: HTMLElement;
  if (initiallyShowing) {
    contentEl = initialElement as HTMLElement;
  } else {
    // Create content element from template
    const tpl = getTempEl();
    tpl.innerHTML = template;
    contentEl = (tpl.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
  }

  let currentlyShowing = initiallyShowing;

  // Initialize bindings if already showing
  if (initiallyShowing) {
    bindingsInitialized = true;
    cleanups = initNested();
  }

  const show = () => {
    if (currentlyShowing) return;
    currentlyShowing = true;
    const current = root.getElementById(id);
    if (current && contentEl) {
      current.replaceWith(contentEl);
      // Lazy initialize bindings on first show
      if (!bindingsInitialized) {
        bindingsInitialized = true;
        cleanups = initNested();
      }
    }
  };

  const hide = () => {
    if (!currentlyShowing) return;
    currentlyShowing = false;
    const current = root.getElementById(id);
    if (current) {
      // Replace with empty template placeholder
      const p = document.createElement('template');
      p.id = id;
      current.replaceWith(p);
    }
  };

  const update = () => {
    if (evalCondition()) {
      show();
    } else {
      hide();
    }
  };

  // Subscribe to signal changes
  const unsubscribes = subscribe(update);
  update();

  return () => {
    for (let i = 0; i < unsubscribes.length; i++) unsubscribes[i]?.();
    for (let i = 0; i < cleanups.length; i++) cleanups[i]?.();
    cleanups = [];
  };
};

/**
 * Bind conditional content to a single signal (when directive)
 * 
 * @param root - Component root element
 * @param signal - Signal controlling visibility
 * @param id - Element ID for the conditional content
 * @param template - HTML template to show when condition is true
 * @param initNested - Function to initialize nested bindings
 * @returns Cleanup function
 */
export const __bindIf = (
  root: ComponentRoot, 
  signal: Signal<any>, 
  id: string, 
  template: string, 
  initNested: () => (() => void)[]
): (() => void) =>
  bindConditional(
    root,
    id,
    template,
    initNested,
    (update) => [signal.subscribe(update, true)],
    () => Boolean(signal()),
  );

/**
 * Bind conditional content to multiple signals with expression (whenElse directive)
 * 
 * @param root - Component root element
 * @param signals - Array of signals used in the condition
 * @param evalExpr - Function to evaluate the condition expression
 * @param id - Element ID for the conditional content
 * @param template - HTML template to show when condition is true
 * @param initNested - Function to initialize nested bindings
 * @returns Cleanup function
 */
export const __bindIfExpr = (
  root: ComponentRoot, 
  signals: Signal<any>[], 
  evalExpr: () => boolean, 
  id: string, 
  template: string, 
  initNested: () => (() => void)[]
): (() => void) =>
  bindConditional(root, id, template, initNested, (update) => signals.map((s) => s.subscribe(update, true)), evalExpr);

/**
 * Managed item in a repeat directive
 */
interface ManagedItem<T> {
  itemSignal: Signal<T>;
  el: Element;
  cleanups: (() => void)[];
}

/**
 * Key function type for tracking items in repeat
 */
type KeyFn<T> = (item: T, index: number) => string | number;

/**
 * Bind repeat directive for rendering arrays
 * 
 * Efficiently renders and updates lists of items with optional trackBy for diffing.
 * 
 * @param root - Component root element
 * @param arraySignal - Signal containing the array of items
 * @param anchorId - ID of the anchor element marking where to insert items
 * @param templateFn - Function that generates HTML for each item
 * @param initItemBindings - Function to initialize bindings for each item
 * @param emptyTemplate - Optional HTML to show when array is empty
 * @param itemEventHandlers - Event handlers for items
 * @param keyFn - Optional function to generate unique keys for items
 * @returns Cleanup function
 */
export const __bindRepeat = <T>(
  root: ComponentRoot,
  arraySignal: Signal<T[]>,
  anchorId: string,
  templateFn: (itemSignal: Signal<T>, index: number) => string,
  initItemBindings: (elements: Element[], itemSignal: Signal<T>, index: number) => (() => void)[],
  emptyTemplate?: string,
  itemEventHandlers?: Record<string, Record<string, (itemSignal: Signal<T>, index: number, e: Event) => void>>,
  keyFn?: KeyFn<T>,
): (() => void) => {
  const managedItems: ManagedItem<T>[] = [];
  
  // Map of keys to managed items for efficient lookup
  const keyMap: Map<string | number, ManagedItem<T>> | null = keyFn ? new Map() : null;

  const anchor = root.getElementById(anchorId);
  if (!anchor) return () => {};

  const container = anchor.parentNode as ParentNode & Element;
  if (!container) return () => {};
  
  // Save parent info for detach optimization
  const containerParent = container.parentNode;
  const containerNextSibling = container.nextSibling;

  let emptyElement: Element | null = null;
  let emptyShowing = false;

  const showEmpty = () => {
    if (emptyShowing || !emptyTemplate) return;
    emptyShowing = true;
    const tpl = getTempEl();
    tpl.innerHTML = emptyTemplate;
    emptyElement = (tpl.content.cloneNode(true) as DocumentFragment).firstElementChild;
    if (emptyElement) container.insertBefore(emptyElement, anchor);
  };

  const hideEmpty = () => {
    if (!emptyShowing || !emptyElement) return;
    emptyShowing = false;
    emptyElement.remove();
    emptyElement = null;
  };

  /**
   * Create a managed item and insert it into the DOM
   */
  const createItem = (item: T, index: number, refNode: Node): ManagedItem<T> => {
    const itemSignal = createSignal(item);

    const html = templateFn(itemSignal, index);
    const tpl = getTempEl();
    tpl.innerHTML = html;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;
    
    const el = fragment.firstElementChild!;

    container.insertBefore(fragment, refNode);

    const cleanups = initItemBindings([el], itemSignal, index);

    // Set up item event handlers (only if handlers exist)
    if (itemEventHandlers) {
      for (const eventType in itemEventHandlers) {
        const handlers = itemEventHandlers[eventType];
        if (!handlers) continue;
        
        const attrName = `data-evt-${eventType}`;
        const nested = el.querySelectorAll(`[${attrName}]`);
        
        // Check el itself first
        if (el.hasAttribute(attrName)) {
          const handlerId = el.getAttribute(attrName)?.split(':')[0];
          if (handlerId) {
            const handler = handlers[handlerId];
            if (handler) {
              const listener = (e: Event) => handler(itemSignal, index, e);
              el.addEventListener(eventType, listener);
              cleanups.push(() => el.removeEventListener(eventType, listener));
            }
          }
        }
        
        // Then nested elements
        for (let i = 0, len = nested.length; i < len; i++) {
          const target = nested[i]!;
          const handlerId = target.getAttribute(attrName)?.split(':')[0];
          if (handlerId) {
            const handler = handlers[handlerId];
            if (handler) {
              const listener = (e: Event) => handler(itemSignal, index, e);
              target.addEventListener(eventType, listener);
              cleanups.push(() => target.removeEventListener(eventType, listener));
            }
          }
        }
      }
    }

    const managed: ManagedItem<T> = { itemSignal, el, cleanups };
    
    if (keyMap && keyFn) {
      keyMap.set(keyFn(item, index), managed);
    }
    
    return managed;
  };

  /**
   * Remove a managed item and clean up
   */
  const removeItem = (managed: ManagedItem<T>) => {
    const cleanups = managed.cleanups;
    for (let i = 0, len = cleanups.length; i < len; i++) {
      cleanups[i]!();
    }
    managed.el.remove();
  };

  /**
   * Clear all items - optimized for speed
   */
  const clearAll = () => {
    const len = managedItems.length;
    if (len === 0) return;
    
    // Run all cleanups first
    for (let i = 0; i < len; i++) {
      const cleanups = managedItems[i]!.cleanups;
      for (let j = 0, clen = cleanups.length; j < clen; j++) {
        cleanups[j]!();
      }
    }
    
    // Fast bulk removal: remove all children except anchor, then re-add anchor
    // This is faster than Range.deleteContents() for large lists
    const anchorParent = anchor.parentNode;
    if (anchorParent) {
      anchor.remove();
      (container as HTMLElement).textContent = '';
      container.appendChild(anchor);
    }
    
    managedItems.length = 0;
    
    if (keyMap) {
      keyMap.clear();
    }
  };

  /**
   * Bulk create items (with detach optimization)
   */
  const bulkCreate = (items: T[], startIndex: number = 0) => {
    const count = items.length;
    if (count === 0) return;
    
    // Always detach container for bulk insertions - prevents reflow per item
    if (containerParent) {
      container.remove();
    }
    
    for (let i = 0; i < count; i++) {
      const managed = createItem(items[i]!, startIndex + i, anchor);
      managedItems.push(managed);
    }
    
    if (containerParent) {
      containerParent.insertBefore(container, containerNextSibling);
    }
  };

  /**
   * Reconcile current items with new items
   */
  const reconcile = (newItems: T[]) => {
    const newLength = newItems?.length ?? 0;
    const oldLength = managedItems.length;

    // Handle empty array
    if (newLength === 0) {
      clearAll();
      showEmpty();
      return;
    }
    hideEmpty();

    // With trackBy key function - use keyed reconciliation
    if (keyMap && keyFn) {
      // Fast path: single item removed
      if (oldLength === newLength + 1) {
        let removedIdx = -1;
        
        for (let i = 0; i < newLength; i++) {
          const newKey = keyFn(newItems[i]!, i);
          const oldKey = keyFn(managedItems[i]!.itemSignal(), i);
          if (newKey !== oldKey) {
            removedIdx = i;
            break;
          }
        }
        
        if (removedIdx === -1) {
          removedIdx = oldLength - 1;
        }
        
        const removedManaged = managedItems[removedIdx]!;
        const removedKey = keyFn(removedManaged.itemSignal(), removedIdx);
        
        let isActualRemoval = true;
        for (let i = removedIdx; i < newLength; i++) {
          if (keyFn(newItems[i]!, i) === removedKey) {
            isActualRemoval = false;
            break;
          }
        }
        
        if (isActualRemoval) {
          removeItem(removedManaged);
          keyMap.delete(removedKey);
          
          for (let i = removedIdx; i < oldLength - 1; i++) {
            managedItems[i] = managedItems[i + 1]!;
          }
          managedItems.length = oldLength - 1;
          
          return;
        }
      }
      
      // Fast path: reorder with same keys
      if (oldLength === newLength) {
        let allKeysExist = true;
        for (let i = 0; i < newLength && allKeysExist; i++) {
          const key = keyFn(newItems[i]!, i);
          if (!keyMap.has(key)) {
            allKeysExist = false;
          }
        }
        
        if (allKeysExist) {
          const newManagedItems: ManagedItem<T>[] = [];
          let mismatchCount = 0;
          let mismatch1 = -1, mismatch2 = -1;
          
          for (let i = 0; i < newLength; i++) {
            const newItem = newItems[i]!;
            const key = keyFn(newItem, i);
            const existing = keyMap.get(key)!;
            
            if (existing.itemSignal() !== newItem) {
              existing.itemSignal(newItem);
            }
            
            if (managedItems[i] !== existing) {
              mismatchCount++;
              if (mismatchCount === 1) mismatch1 = i;
              else if (mismatchCount === 2) mismatch2 = i;
            }
            
            newManagedItems.push(existing);
          }
          
          if (mismatchCount === 0) {
            return;
          }
          
          // Fast path: two items swapped
          if (mismatchCount === 2 &&
              managedItems[mismatch1] === newManagedItems[mismatch2] &&
              managedItems[mismatch2] === newManagedItems[mismatch1]) {
            const el1 = newManagedItems[mismatch1]!.el;
            const el2 = newManagedItems[mismatch2]!.el;
            
            const next1 = el1.nextSibling;
            const next2 = el2.nextSibling;
            
            if (next1 === el2) {
              container.insertBefore(el2, el1);
            } else if (next2 === el1) {
              container.insertBefore(el1, el2);
            } else {
              container.insertBefore(el1, next2);
              container.insertBefore(el2, next1);
            }
            
            managedItems[mismatch1] = newManagedItems[mismatch1]!;
            managedItems[mismatch2] = newManagedItems[mismatch2]!;
            return;
          }
          
          // General reorder
          let currentEl: Element | null = managedItems[0]?.el || null;
          for (let i = 0; i < newLength; i++) {
            const wanted = newManagedItems[i]!.el;
            if (wanted === currentEl) {
              currentEl = currentEl?.nextElementSibling || null;
            } else {
              container.insertBefore(wanted, currentEl);
            }
          }
          
          managedItems.length = 0;
          for (let i = 0; i < newLength; i++) {
            managedItems.push(newManagedItems[i]!);
          }
          return;
        }
      }
      
      // Fast path: complete replacement (first and last keys both new)
      if (oldLength > 0 && oldLength === newLength) {
        const firstNewKey = keyFn(newItems[0]!, 0);
        if (!keyMap.has(firstNewKey)) {
          const lastNewKey = keyFn(newItems[newLength - 1]!, newLength - 1);
          if (!keyMap.has(lastNewKey)) {
            clearAll();
            bulkCreate(newItems);
            return;
          }
        }
      }
      
      // General keyed reconciliation
      const newKeys = new Set<string | number>();
      for (let i = 0; i < newLength; i++) {
        newKeys.add(keyFn(newItems[i]!, i));
      }
      
      // Remove items no longer present
      const toRemove: number[] = [];
      for (let i = 0; i < oldLength; i++) {
        const managed = managedItems[i]!;
        const key = keyFn(managed.itemSignal(), i);
        if (!newKeys.has(key)) {
          toRemove.push(i);
          keyMap.delete(key);
        }
      }
      
      for (let i = toRemove.length - 1; i >= 0; i--) {
        const idx = toRemove[i]!;
        removeItem(managedItems[idx]!);
        managedItems.splice(idx, 1);
      }
      
      // Build new managed items array
      const newManagedItems: ManagedItem<T>[] = [];
      
      for (let i = 0; i < newLength; i++) {
        const newItem = newItems[i]!;
        const key = keyFn(newItem, i);
        const existing = keyMap.get(key);
        
        if (existing) {
          if (existing.itemSignal() !== newItem) {
            existing.itemSignal(newItem);
          }
          newManagedItems.push(existing);
        } else {
          const refNode = i < managedItems.length ? managedItems[i]!.el : anchor;
          const managed = createItem(newItem, i, refNode);
          newManagedItems.push(managed);
        }
      }
      
      // Reorder to match new order
      let currentEl: Element | null = newManagedItems[0]?.el.previousElementSibling?.nextElementSibling || container.firstElementChild;
      for (let i = 0; i < newLength; i++) {
        const wanted = newManagedItems[i]!.el;
        if (wanted === currentEl) {
          currentEl = currentEl?.nextElementSibling || null;
        } else {
          container.insertBefore(wanted, currentEl);
        }
      }
      
      managedItems.length = 0;
      for (let i = 0; i < newLength; i++) {
        managedItems.push(newManagedItems[i]!);
      }
      
      return;
    }

    // Without trackBy - simple index-based reconciliation
    
    // Fast path: same length, first and last both changed = replace all
    if (oldLength > 0 && newLength > 0 && oldLength === newLength) {
      const firstChanged = managedItems[0]!.itemSignal() !== newItems[0];
      const lastChanged = managedItems[oldLength - 1]!.itemSignal() !== newItems[newLength - 1];
      
      if (firstChanged && lastChanged) {
        for (let i = 0; i < newLength; i++) {
          const managed = managedItems[i]!;
          if (managed.itemSignal() !== newItems[i]) {
            managed.itemSignal(newItems[i]!);
          }
        }
        return;
      }
    }

    // Update existing items
    const minLength = Math.min(oldLength, newLength);
    for (let i = 0; i < minLength; i++) {
      const managed = managedItems[i]!;
      if (managed.itemSignal() !== newItems[i]) {
        managed.itemSignal(newItems[i]!);
      }
    }

    // Remove excess items
    if (newLength < oldLength) {
      for (let i = newLength; i < oldLength; i++) {
        removeItem(managedItems[i]!);
      }
      managedItems.length = newLength;
    }

    // Add new items
    if (newLength > oldLength) {
      const itemsToAdd = newItems.slice(oldLength);
      bulkCreate(itemsToAdd, oldLength);
    }
  };

  // Initial render
  reconcile(arraySignal());

  // Subscribe to changes
  const unsubscribe = arraySignal.subscribe((items) => {
    reconcile(items);
  }, true);

  return () => {
    unsubscribe();
    hideEmpty();
    clearAll();
  };
};

/**
 * Element path for navigating to a dynamic element via children indices
 * e.g., [0, 1, 0] means el.children[0].children[1].children[0]
 */
type ElementPath = number[];

/**
 * Configuration for a dynamic element binding in a repeat template
 */
interface RepeatElementBinding {
  /** Path from root element to this element via children indices */
  path: ElementPath;
  /** ID assigned to this element (for fallback) */
  id: string;
}

/**
 * Navigate to an element using a pre-computed children path
 * This is O(depth) instead of O(n) for querySelector
 */
const navigatePath = (root: Element, path: ElementPath): Element | null => {
  let el: Element | null = root;
  for (let i = 0, len = path.length; i < len && el; i++) {
    el = el.children[path[i]!] as Element || null;
  }
  return el;
};

/**
 * Optimized repeat binding using pre-compiled static templates
 * 
 * Instead of building HTML strings and parsing them for each item,
 * this clones a pre-parsed template and uses direct DOM navigation
 * to find dynamic elements.
 * 
 * @param root - Component root element
 * @param arraySignal - Signal containing the array of items
 * @param anchorId - ID of the anchor element marking where to insert items
 * @param itemTemplate - Pre-parsed template element for items
 * @param elementBindings - Array of element bindings with paths
 * @param fillItem - Function to fill initial values into cloned element
 * @param initItemBindings - Function to set up reactive bindings
 * @param emptyTemplate - Optional HTML to show when array is empty
 * @param keyFn - Optional function to generate unique keys for items
 * @returns Cleanup function
 */
export const __bindRepeatTpl = <T>(
  root: ComponentRoot,
  arraySignal: Signal<T[]>,
  anchorId: string,
  itemTemplate: HTMLTemplateElement,
  elementBindings: RepeatElementBinding[],
  fillItem: (elements: Element[], item: T, index: number) => void,
  initItemBindings: (elements: Element[], itemSignal: Signal<T>, index: number) => (() => void)[],
  emptyTemplate?: string,
  keyFn?: KeyFn<T>,
): (() => void) => {
  const managedItems: ManagedItem<T>[] = [];
  const keyMap: Map<string | number, ManagedItem<T>> | null = keyFn ? new Map() : null;

  const anchor = root.getElementById(anchorId);
  if (!anchor) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.error(`[wcf] repeat: anchor #${anchorId} not found`);
    }
    return () => {};
  }

  const container = anchor.parentNode as ParentNode & Element;
  if (!container) return () => {};
  
  const containerParent = container.parentNode;
  const containerNextSibling = container.nextSibling;

  let emptyElement: Element | null = null;
  let emptyShowing = false;

  const showEmpty = () => {
    if (emptyShowing || !emptyTemplate) return;
    emptyShowing = true;
    const tpl = getTempEl();
    tpl.innerHTML = emptyTemplate;
    emptyElement = (tpl.content.cloneNode(true) as DocumentFragment).firstElementChild;
    if (emptyElement) container.insertBefore(emptyElement, anchor);
  };

  const hideEmpty = () => {
    if (!emptyShowing || !emptyElement) return;
    emptyShowing = false;
    emptyElement.remove();
    emptyElement = null;
  };

  // Pre-extract the template content for cloning
  const templateContent = itemTemplate.content;

  /**
   * Create a managed item using template cloning (no HTML parsing!)
   */
  const createItem = (item: T, index: number, refNode: Node): ManagedItem<T> => {
    const itemSignal = createSignal(item);

    // Clone the pre-parsed template - MUCH faster than innerHTML parsing
    const fragment = templateContent.cloneNode(true) as DocumentFragment;
    const el = fragment.firstElementChild!;

    // Resolve element references using pre-computed paths
    const elements: Element[] = new Array(elementBindings.length);
    for (let i = 0, len = elementBindings.length; i < len; i++) {
      const binding = elementBindings[i]!;
      const path = binding.path;
      // Navigate using children indices - no querySelector needed!
      elements[i] = path.length === 0 ? el : navigatePath(el, path)!;
    }

    // Fill in initial values (direct DOM manipulation, no parsing)
    fillItem(elements, item, index);

    container.insertBefore(fragment, refNode);

    // Set up reactive bindings
    const cleanups = initItemBindings(elements, itemSignal, index);

    const managed: ManagedItem<T> = { itemSignal, el, cleanups };
    
    if (keyMap && keyFn) {
      keyMap.set(keyFn(item, index), managed);
    }
    
    return managed;
  };

  const removeItem = (managed: ManagedItem<T>) => {
    const cleanups = managed.cleanups;
    for (let i = 0, len = cleanups.length; i < len; i++) {
      cleanups[i]!();
    }
    managed.el.remove();
  };

  const clearAll = () => {
    const len = managedItems.length;
    if (len === 0) return;
    
    for (let i = 0; i < len; i++) {
      const cleanups = managedItems[i]!.cleanups;
      for (let j = 0, clen = cleanups.length; j < clen; j++) {
        cleanups[j]!();
      }
    }
    
    const anchorParent = anchor.parentNode;
    if (anchorParent) {
      anchor.remove();
      (container as HTMLElement).textContent = '';
      container.appendChild(anchor);
    }
    
    managedItems.length = 0;
    if (keyMap) keyMap.clear();
  };

  const bulkCreate = (items: T[], startIndex: number = 0) => {
    const count = items.length;
    if (count === 0) return;
    
    if (containerParent) container.remove();
    
    for (let i = 0; i < count; i++) {
      const managed = createItem(items[i]!, startIndex + i, anchor);
      managedItems.push(managed);
    }
    
    if (containerParent) containerParent.insertBefore(container, containerNextSibling);
  };

  const reconcile = (newItems: T[]) => {
    const newLength = newItems?.length ?? 0;
    const oldLength = managedItems.length;

    if (newLength === 0) {
      clearAll();
      showEmpty();
      return;
    }
    hideEmpty();

    // With trackBy - keyed reconciliation
    if (keyMap && keyFn) {
      // Fast path: single item removed
      if (oldLength === newLength + 1) {
        let removedIdx = -1;
        for (let i = 0; i < newLength; i++) {
          const newKey = keyFn(newItems[i]!, i);
          const oldKey = keyFn(managedItems[i]!.itemSignal(), i);
          if (newKey !== oldKey) {
            removedIdx = i;
            break;
          }
        }
        if (removedIdx === -1) removedIdx = oldLength - 1;
        
        const removedManaged = managedItems[removedIdx]!;
        const removedKey = keyFn(removedManaged.itemSignal(), removedIdx);
        
        let isActualRemoval = true;
        for (let i = removedIdx; i < newLength; i++) {
          if (keyFn(newItems[i]!, i) === removedKey) {
            isActualRemoval = false;
            break;
          }
        }
        
        if (isActualRemoval) {
          removeItem(removedManaged);
          keyMap.delete(removedKey);
          for (let i = removedIdx; i < oldLength - 1; i++) {
            managedItems[i] = managedItems[i + 1]!;
          }
          managedItems.length = oldLength - 1;
          return;
        }
      }
      
      // Fast path: reorder with same keys
      if (oldLength === newLength) {
        let allKeysExist = true;
        for (let i = 0; i < newLength && allKeysExist; i++) {
          const key = keyFn(newItems[i]!, i);
          if (!keyMap.has(key)) allKeysExist = false;
        }
        
        if (allKeysExist) {
          const reordered: ManagedItem<T>[] = [];
          let moveCount = 0;
          let firstMoveIdx = -1;
          let secondMoveIdx = -1;
          
          for (let i = 0; i < newLength; i++) {
            const newItem = newItems[i]!;
            const key = keyFn(newItem, i);
            const existing = keyMap.get(key)!;
            if (existing.itemSignal() !== newItem) existing.itemSignal(newItem);
            if (managedItems[i] !== existing) {
              moveCount++;
              if (moveCount === 1) firstMoveIdx = i;
              else if (moveCount === 2) secondMoveIdx = i;
            }
            reordered.push(existing);
          }
          
          if (moveCount === 0) return;
          
          // Swap optimization
          if (moveCount === 2 && managedItems[firstMoveIdx] === reordered[secondMoveIdx] && managedItems[secondMoveIdx] === reordered[firstMoveIdx]) {
            const elA = reordered[firstMoveIdx]!.el;
            const elB = reordered[secondMoveIdx]!.el;
            const nextA = elA.nextSibling;
            const nextB = elB.nextSibling;
            if (nextA === elB) {
              container.insertBefore(elB, elA);
            } else if (nextB === elA) {
              container.insertBefore(elA, elB);
            } else {
              container.insertBefore(elA, nextB);
              container.insertBefore(elB, nextA);
            }
            managedItems[firstMoveIdx] = reordered[firstMoveIdx]!;
            managedItems[secondMoveIdx] = reordered[secondMoveIdx]!;
            return;
          }
          
          // General reorder
          let currentEl: Element | null = managedItems[0]?.el || null;
          for (let i = 0; i < newLength; i++) {
            const wanted = reordered[i]!.el;
            if (wanted === currentEl) {
              currentEl = currentEl?.nextElementSibling || null;
            } else {
              container.insertBefore(wanted, currentEl);
            }
          }
          
          managedItems.length = 0;
          for (let i = 0; i < newLength; i++) managedItems.push(reordered[i]!);
          return;
        }
      }
      
      // Full reconciliation needed - first/last both missing, assume replace all
      if (oldLength > 0 && oldLength === newLength) {
        const firstKey = keyFn(newItems[0]!, 0);
        if (!keyMap.has(firstKey)) {
          const lastKey = keyFn(newItems[newLength - 1]!, newLength - 1);
          if (!keyMap.has(lastKey)) {
            clearAll();
            bulkCreate(newItems);
            return;
          }
        }
      }
      
      // Remove items no longer in new list
      const newKeys = new Set<string | number>();
      for (let i = 0; i < newLength; i++) newKeys.add(keyFn(newItems[i]!, i));
      
      const toRemove: number[] = [];
      for (let i = 0; i < oldLength; i++) {
        const managed = managedItems[i]!;
        const key = keyFn(managed.itemSignal(), i);
        if (!newKeys.has(key)) {
          toRemove.push(i);
          keyMap.delete(key);
        }
      }
      
      for (let i = toRemove.length - 1; i >= 0; i--) {
        const idx = toRemove[i]!;
        removeItem(managedItems[idx]!);
        managedItems.splice(idx, 1);
      }
      
      // Build new managed items array
      const newManagedItems: ManagedItem<T>[] = [];
      for (let i = 0; i < newLength; i++) {
        const newItem = newItems[i]!;
        const key = keyFn(newItem, i);
        const existing = keyMap.get(key);
        
        if (existing) {
          if (existing.itemSignal() !== newItem) existing.itemSignal(newItem);
          newManagedItems.push(existing);
        } else {
          const refNode = i < managedItems.length ? managedItems[i]!.el : anchor;
          const managed = createItem(newItem, i, refNode);
          newManagedItems.push(managed);
        }
      }
      
      // Reorder
      let currentEl: Element | null = newManagedItems[0]?.el.previousElementSibling?.nextElementSibling || container.firstElementChild;
      for (let i = 0; i < newLength; i++) {
        const wanted = newManagedItems[i]!.el;
        if (wanted === currentEl) {
          currentEl = currentEl?.nextElementSibling || null;
        } else {
          container.insertBefore(wanted, currentEl);
        }
      }
      
      managedItems.length = 0;
      for (let i = 0; i < newLength; i++) managedItems.push(newManagedItems[i]!);
      return;
    }

    // Without trackBy - simple index-based reconciliation
    if (oldLength > 0 && newLength > 0 && oldLength === newLength) {
      const firstChanged = managedItems[0]!.itemSignal() !== newItems[0];
      const lastChanged = managedItems[oldLength - 1]!.itemSignal() !== newItems[newLength - 1];
      if (firstChanged && lastChanged) {
        for (let i = 0; i < newLength; i++) {
          const managed = managedItems[i]!;
          if (managed.itemSignal() !== newItems[i]) managed.itemSignal(newItems[i]!);
        }
        return;
      }
    }

    const minLength = Math.min(oldLength, newLength);
    for (let i = 0; i < minLength; i++) {
      const managed = managedItems[i]!;
      if (managed.itemSignal() !== newItems[i]) managed.itemSignal(newItems[i]!);
    }

    if (newLength < oldLength) {
      for (let i = newLength; i < oldLength; i++) removeItem(managedItems[i]!);
      managedItems.length = newLength;
    }

    if (newLength > oldLength) {
      const itemsToAdd = newItems.slice(oldLength);
      bulkCreate(itemsToAdd, oldLength);
    }
  };

  reconcile(arraySignal());

  const unsubscribe = arraySignal.subscribe((items) => {
    reconcile(items);
  }, true);

  return () => {
    unsubscribe();
    hideEmpty();
    clearAll();
  };
};

/**
 * Bind nested repeat directive (repeat inside repeat or when)
 * 
 * Similar to __bindRepeat but works within a parent item context.
 */
export const __bindNestedRepeat = <P, T>(
  elements: Element[],
  parentSignal: Signal<P>,
  getArray: () => T[],
  anchorId: string,
  templateFn: (itemSignal: Signal<T>, index: number) => string,
  initItemBindings: (elements: Element[], itemSignal: Signal<T>, index: number) => (() => void)[],
  emptyTemplate?: string,
): (() => void) => {
  const anchor = __findEl(elements, anchorId);
  if (!anchor) return () => {};

  const container = anchor.parentNode as ParentNode;
  if (!container) return () => {};

  const managedItems: ManagedItem<T>[] = [];

  let emptyElement: Element | null = null;
  let emptyShowing = false;

  const showEmpty = () => {
    if (emptyShowing || !emptyTemplate) return;
    emptyShowing = true;
    const tpl = getTempEl();
    tpl.innerHTML = emptyTemplate;
    emptyElement = (tpl.content.cloneNode(true) as DocumentFragment).firstElementChild;
    if (emptyElement) container.insertBefore(emptyElement, anchor);
  };

  const hideEmpty = () => {
    if (!emptyShowing || !emptyElement) return;
    emptyShowing = false;
    emptyElement.remove();
    emptyElement = null;
  };

  const createItem = (item: T, index: number, refNode: Node): ManagedItem<T> => {
    const itemSignal = createSignal(item);

    const html = templateFn(itemSignal, index);
    const tpl = getTempEl();
    tpl.innerHTML = html;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;
    const el = fragment.firstElementChild!;
    const itemElements = [el];

    container.insertBefore(fragment, refNode);

    const cleanups = initItemBindings(itemElements, itemSignal, index);

    return { itemSignal, el, cleanups };
  };

  const removeItem = (managed: ManagedItem<T>) => {
    const cleanups = managed.cleanups;
    for (let i = 0, len = cleanups.length; i < len; i++) {
      cleanups[i]!();
    }
    managed.el.remove();
  };

  const reconcile = (newItems: T[]) => {
    const newLength = newItems?.length ?? 0;
    const oldLength = managedItems.length;

    if (newLength === 0) {
      for (let i = 0; i < oldLength; i++) {
        removeItem(managedItems[i]!);
      }
      managedItems.length = 0;
      showEmpty();
      return;
    }
    hideEmpty();

    // Update existing items
    const minLength = Math.min(oldLength, newLength);
    for (let i = 0; i < minLength; i++) {
      const managed = managedItems[i]!;
      if (managed.itemSignal() !== newItems[i]) {
        managed.itemSignal(newItems[i]!);
      }
    }

    // Remove excess items
    if (newLength < oldLength) {
      for (let i = newLength; i < oldLength; i++) {
        removeItem(managedItems[i]!);
      }
      managedItems.length = newLength;
    }

    // Add new items
    if (newLength > oldLength) {
      for (let i = oldLength; i < newLength; i++) {
        const managed = createItem(newItems[i]!, i, anchor);
        managedItems.push(managed);
      }
    }
  };

  // Initial render
  reconcile(getArray());

  // Subscribe to parent signal changes
  const unsubscribe = parentSignal.subscribe(() => {
    reconcile(getArray());
  }, true);

  return () => {
    unsubscribe();
    hideEmpty();
    for (let i = 0; i < managedItems.length; i++) {
      removeItem(managedItems[i]!);
    }
    managedItems.length = 0;
  };
};
