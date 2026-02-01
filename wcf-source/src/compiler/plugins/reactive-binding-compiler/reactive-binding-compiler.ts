import fs from 'fs';
import type { Plugin } from 'esbuild';
import ts from 'typescript';
import type { SignalExpression, ImportInfo, TemplateInfo } from '../../types.js';
import {
  findComponentClass,
  findSignalInitializers,
  getSignalGetterName,
  extractTemplateContent,
  isHtmlTemplate,
  isCssTemplate,
  applyEdits,
  sourceCache,
  logger,
  hasHtmlTemplates,
  extendsComponentQuick,
  toCamelCase,
  createLoaderResult,
  PLUGIN_NAME,
  BIND_FN,
} from '../../utils/index.js';
import {
  parseHtmlTemplate,
  walkElements,
  findElementsWithWhenDirective,
  getElementHtml,
  getBindingsForElement,
  injectIdIntoFirstElement,
  type HtmlElement,
  type ParsedTemplate,
} from '../../utils/html-parser.js';

// NOTE: Additional html-parser utilities available for future use:

const NAME = PLUGIN_NAME.REACTIVE;

interface ConditionalBlock {
  id: string;
  signalName: string; // Primary signal (for simple cases)
  signalNames: string[]; // All signals in the expression
  jsExpression: string; // The full JS expression e.g. "!this._loading()" or "this._a() && this._b()"
  initialValue: boolean;
  templateContent: string; // HTML to insert when true
  startIndex: number; // Position in HTML where the element/block starts
  endIndex: number; // Position where it ends
  nestedBindings: BindingInfo[]; // Signal bindings inside this conditional
  nestedItemBindings: ItemBinding[]; // Item bindings inside this conditional (for conditionals inside repeats)
  nestedConditionals: ConditionalBlock[]; // Nested when blocks inside this conditional
  nestedEventBindings: EventBinding[]; // Event bindings inside this conditional
}

interface WhenElseBlock {
  thenId: string; // ID for the "then" conditional element
  elseId: string; // ID for the "else" conditional element
  signalName: string; // Primary signal
  signalNames: string[]; // All signals in the expression
  jsExpression: string; // The condition expression
  initialValue: boolean;
  thenTemplate: string; // HTML to insert when true
  elseTemplate: string; // HTML to insert when false
  startIndex: number; // Position in HTML where ${whenElse starts
  endIndex: number; // Position after }
  thenBindings: BindingInfo[]; // Bindings inside then template
  elseBindings: BindingInfo[]; // Bindings inside else template
  nestedConditionals: ConditionalBlock[]; // Nested when blocks inside then/else
  nestedWhenElse: WhenElseBlock[]; // Nested whenElse blocks inside then/else
}

interface RepeatBlock {
  id: string; // ID for the anchor element
  signalName: string; // Primary signal (the array signal)
  signalNames: string[]; // All signals in the expression
  itemsExpression: string; // e.g., "this._countries()"
  itemVar: string; // e.g., "country"
  indexVar?: string; // e.g., "index" (optional)
  itemTemplate: string; // HTML template for each item (processed)
  emptyTemplate?: string; // HTML template shown when list is empty
  trackByFn?: string; // Custom trackBy function source (deprecated - no longer used)
  startIndex: number; // Position in HTML where ${repeat starts
  endIndex: number; // Position after }
  itemBindings: ItemBinding[]; // Bindings inside item template that reference item/index
  itemEvents: ItemEventBinding[]; // Event handlers inside item template
  signalBindings: BindingInfo[]; // Signal bindings like ${this._class()}
  eventBindings: EventBinding[]; // Event bindings not involving item
  nestedConditionals: ConditionalBlock[];
  nestedWhenElse: WhenElseBlock[];
  nestedRepeats: RepeatBlock[];
}

interface ItemBinding {
  elementId: string; // ID assigned to the element (e.g., 'i0', 'i1')
  type: 'text' | 'attr' | 'style'; // Type of binding
  property?: string; // For attr/style: the property name
  expression: string; // The JS expression (e.g., 'item.label', 'item.count > 0')
}

interface ItemEventBinding {
  eventId: string; // Unique ID for this event handler (e.g., 'ie0', 'ie1')
  eventName: string; // Event type (e.g., 'click', 'mouseenter')
  modifiers: string[]; // Event modifiers (e.g., ['stop', 'prevent'])
  handlerExpression: string; // The handler code with item/index references
}

interface EventBinding {
  id: string; // Unique ID for this event handler (e.g., 'e0', 'e1')
  eventName: string; // Event type (e.g., 'click', 'mouseenter')
  modifiers: string[]; // Event modifiers (e.g., ['stop', 'prevent'])
  handlerExpression: string; // The handler code (method reference or arrow function)
  elementId: string; // ID of the element with the event binding
  startIndex: number; // Position in HTML where @event= starts
  endIndex: number; // Position after closing quote
}

interface BindingInfo {
  id: string;
  signalName: string;
  type: 'text' | 'style' | 'attr';
  property?: string; // For style/attr bindings
  isInsideConditional: boolean;
  conditionalId?: string; // Which conditional block this is inside
}

const isWcfRuntimeImport = (specifier: string): boolean => {
  return (
    specifier.includes('shadow-dom') ||
    specifier.includes('dom/index') ||
    specifier === 'wcf' ||
    specifier.startsWith('wcf/')
  );
};

const findServicesImport = (sourceFile: ts.SourceFile): ImportInfo | null => {
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;

      if (isWcfRuntimeImport(specifier)) {
        const namedImports: string[] = [];

        if (statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)) {
          for (const element of statement.importClause.namedBindings.elements) {
            namedImports.push(element.name.text);
          }
        }

        const fullText = statement.moduleSpecifier.getFullText(sourceFile);
        const quoteChar = fullText.includes("'") ? "'" : '"';
        const normalizedSpecifier = specifier === 'wcf' || specifier.startsWith('wcf/')
          ? specifier
          : specifier.includes('shadow-dom')
            ? specifier.replace('shadow-dom.js', 'index.js').replace('shadow-dom', 'index')
            : specifier;

        return {
          namedImports,
          moduleSpecifier: normalizedSpecifier,
          start: statement.getStart(sourceFile),
          end: statement.getEnd(),
          quoteChar,
        };
      }
    }
  }
  return null;
};

const findHtmlTemplates = (sourceFile: ts.SourceFile): TemplateInfo[] => {
  const templates: TemplateInfo[] = [];

  const visit = (node: ts.Node, insideHtmlTemplate: boolean) => {
    if (ts.isTaggedTemplateExpression(node) && isHtmlTemplate(node)) {
      if (insideHtmlTemplate) {
        return; // Don't process or recurse into nested html templates
      }

      const template = node.template;
      const expressions: SignalExpression[] = [];

      if (ts.isTemplateExpression(template)) {
        for (const span of template.templateSpans) {
          if (ts.isCallExpression(span.expression)) {
            const signalName = getSignalGetterName(span.expression);
            if (signalName) {
              expressions.push({
                signalName,
                fullExpression: span.expression.getText(sourceFile),
                start: span.expression.getStart(sourceFile),
                end: span.expression.getEnd(),
              });
            }
          }
        }
      }

      templates.push({
        node,
        expressions,
        templateStart: node.getStart(sourceFile),
        templateEnd: node.getEnd(),
      });
      ts.forEachChild(node, (child) => visit(child, true));
      return; // Don't use the default forEachChild below
    }

    ts.forEachChild(node, (child) => visit(child, insideHtmlTemplate));
  };

  visit(sourceFile, false);
  return templates;
};

const processHtmlTemplateWithConditionals = (
  templateContent: string,
  signalInitializers: Map<string, string | number | boolean>,
  startingId: number,
): {
  processedContent: string;
  bindings: BindingInfo[];
  conditionals: ConditionalBlock[];
  whenElseBlocks: WhenElseBlock[];
  repeatBlocks: RepeatBlock[];
  eventBindings: EventBinding[];
  nextId: number;
  hasConditionals: boolean;
} => {
  const parsed = parseHtmlTemplate(templateContent);

  const bindings: BindingInfo[] = [];
  const conditionals: ConditionalBlock[] = [];
  const whenElseBlocks: WhenElseBlock[] = [];
  const repeatBlocks: RepeatBlock[] = [];
  const eventBindings: EventBinding[] = [];
  let idCounter = startingId;
  const eventIdCounter = { value: 0 };
  const elementIdMap = new Map<HtmlElement, string>();
  const allConditionalElements = findElementsWithWhenDirective(parsed.roots);
  const conditionalElementSet = new Set(allConditionalElements);
  const elementsInsideConditionals = new Set<HtmlElement>();
  for (const condEl of allConditionalElements) {
    walkElements([condEl], (el) => {
      if (el !== condEl) {
        elementsInsideConditionals.add(el);
      }
    });
  }
  const topLevelConditionalElements = allConditionalElements.filter((el) => !elementsInsideConditionals.has(el));
  const nestedConditionalsMap = new Map<HtmlElement, HtmlElement[]>();
  for (const condEl of topLevelConditionalElements) {
    const nested: HtmlElement[] = [];
    walkElements([condEl], (el) => {
      if (el !== condEl && conditionalElementSet.has(el)) {
        nested.push(el);
      }
    });
    nestedConditionalsMap.set(condEl, nested);
  }
  for (const condEl of topLevelConditionalElements) {
    const whenBinding = parsed.bindings.find((b) => b.element === condEl && b.type === 'when');
    if (!whenBinding || !whenBinding.jsExpression) continue;

    const signalNames = whenBinding.signalNames || [whenBinding.signalName];
    const jsExpression = whenBinding.jsExpression;

    const conditionalId = `b${idCounter++}`;
    elementIdMap.set(condEl, conditionalId);
    let evalExpr = jsExpression;
    for (const sigName of signalNames) {
      const initialVal = signalInitializers.get(sigName);
      const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
      evalExpr = evalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
    }
    let initialValue = false;
    try {
      initialValue = Boolean(eval(evalExpr));
    } catch (e) {
    }
    const condBindings = getBindingsForElement(condEl, parsed.bindings);
    const nestedBindings: BindingInfo[] = [];

    for (const binding of condBindings) {
      if (binding.type === 'when') continue;
      if (binding.type === 'event') continue;
      let elementId: string;
      if (binding.element === condEl) {
        elementId = conditionalId;
      } else {
        if (!elementIdMap.has(binding.element)) {
          elementIdMap.set(binding.element, `b${idCounter++}`);
        }
        elementId = elementIdMap.get(binding.element)!;
      }

      nestedBindings.push({
        id: elementId,
        signalName: binding.signalName,
        type: binding.type as 'text' | 'style' | 'attr',
        property: binding.property,
        isInsideConditional: true,
        conditionalId,
      });
    }
    const nestedCondElements = nestedConditionalsMap.get(condEl) || [];
    const nestedConditionals: ConditionalBlock[] = [];

    for (const nestedCondEl of nestedCondElements) {
      const nestedWhenBinding = parsed.bindings.find((b) => b.element === nestedCondEl && b.type === 'when');
      if (!nestedWhenBinding || !nestedWhenBinding.jsExpression) continue;

      const nestedSignalNames = nestedWhenBinding.signalNames || [nestedWhenBinding.signalName];
      const nestedJsExpression = nestedWhenBinding.jsExpression;
      const nestedCondId = `b${idCounter++}`;
      elementIdMap.set(nestedCondEl, nestedCondId);
      let nestedEvalExpr = nestedJsExpression;
      for (const sigName of nestedSignalNames) {
        const initialVal = signalInitializers.get(sigName);
        const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
        nestedEvalExpr = nestedEvalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
      }
      let nestedInitialValue = false;
      try {
        nestedInitialValue = Boolean(eval(nestedEvalExpr));
      } catch (e) {}
      const nestedCondBindings = getBindingsForElement(nestedCondEl, parsed.bindings);
      const nestedNestedBindings: BindingInfo[] = [];

      for (const binding of nestedCondBindings) {
        if (binding.type === 'when') continue;
        if (binding.type === 'event') continue;

        let nestedElementId: string;
        if (binding.element === nestedCondEl) {
          nestedElementId = nestedCondId;
        } else {
          if (!elementIdMap.has(binding.element)) {
            elementIdMap.set(binding.element, `b${idCounter++}`);
          }
          nestedElementId = elementIdMap.get(binding.element)!;
        }

        nestedNestedBindings.push({
          id: nestedElementId,
          signalName: binding.signalName,
          type: binding.type as 'text' | 'style' | 'attr',
          property: binding.property,
          isInsideConditional: true,
          conditionalId: nestedCondId,
        });
      }

      const nestedProcessedResult = processConditionalElementHtml(nestedCondEl, templateContent, signalInitializers, elementIdMap, nestedCondId, undefined, eventIdCounter);

      const primarySignal = nestedSignalNames[0];
      if (!primarySignal) continue;

      nestedConditionals.push({
        id: nestedCondId,
        signalName: primarySignal,
        signalNames: nestedSignalNames,
        jsExpression: nestedJsExpression,
        initialValue: nestedInitialValue,
        templateContent: nestedProcessedResult.html,
        startIndex: nestedCondEl.tagStart,
        endIndex: nestedCondEl.closeTagEnd,
        nestedBindings: nestedNestedBindings,
        nestedItemBindings: [],
        nestedConditionals: [],
        nestedEventBindings: nestedProcessedResult.eventBindings,
      });
    }
    const processedCondResult = processConditionalElementHtml(condEl, templateContent, signalInitializers, elementIdMap, conditionalId, nestedConditionals, eventIdCounter);

    conditionals.push({
      id: conditionalId,
      signalName: signalNames[0] ?? '', // Primary signal for backwards compatibility
      signalNames,
      jsExpression,
      initialValue,
      templateContent: processedCondResult.html,
      startIndex: condEl.tagStart,
      endIndex: condEl.closeTagEnd,
      nestedBindings,
      nestedItemBindings: [],
      nestedConditionals,
      nestedEventBindings: processedCondResult.eventBindings,
    });

    bindings.push(...nestedBindings);
    eventBindings.push(...processedCondResult.eventBindings);
  }
  for (const binding of parsed.bindings) {
    if (binding.type !== 'whenElse') continue;
    if (!binding.jsExpression || !binding.thenTemplate || !binding.elseTemplate) continue;

    const signalNames = binding.signalNames || [binding.signalName];
    const jsExpression = binding.jsExpression;
    const thenId = `b${idCounter++}`;
    const elseId = `b${idCounter++}`;
    let evalExpr = jsExpression;
    for (const sigName of signalNames) {
      const initialVal = signalInitializers.get(sigName);
      const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
      evalExpr = evalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
    }
    let initialValue = false;
    try {
      initialValue = Boolean(eval(evalExpr));
    } catch (e) {
    }
    const thenProcessed = processSubTemplateWithNesting(binding.thenTemplate, signalInitializers, idCounter, thenId);
    idCounter = thenProcessed.nextId;
    const elseProcessed = processSubTemplateWithNesting(binding.elseTemplate, signalInitializers, idCounter, elseId);
    idCounter = elseProcessed.nextId;

    whenElseBlocks.push({
      thenId,
      elseId,
      signalName: signalNames[0] || '',
      signalNames,
      jsExpression,
      initialValue,
      thenTemplate: thenProcessed.processedContent,
      elseTemplate: elseProcessed.processedContent,
      startIndex: binding.expressionStart,
      endIndex: binding.expressionEnd,
      thenBindings: thenProcessed.bindings,
      elseBindings: elseProcessed.bindings,
      nestedConditionals: [...thenProcessed.conditionals, ...elseProcessed.conditionals],
      nestedWhenElse: [...thenProcessed.whenElseBlocks, ...elseProcessed.whenElseBlocks],
    });
  }
  const allRepeatRanges: Array<{ start: number; end: number }> = [];
  for (const binding of parsed.bindings) {
    if (binding.type === 'repeat') {
      allRepeatRanges.push({ start: binding.expressionStart, end: binding.expressionEnd });
    }
  }
  const isInsideOtherRepeat = (start: number, end: number): boolean => {
    for (const range of allRepeatRanges) {
      if (start > range.start && end < range.end) {
        return true;
      }
    }
    return false;
  };
  for (const binding of parsed.bindings) {
    if (binding.type !== 'repeat') continue;
    if (!binding.itemsExpression || !binding.itemVar || !binding.itemTemplate) continue;
    if (isInsideOtherRepeat(binding.expressionStart, binding.expressionEnd)) continue;

    const signalNames = binding.signalNames || [binding.signalName];
    const repeatId = `b${idCounter++}`;
    const itemTemplateProcessed = processItemTemplate(binding.itemTemplate, binding.itemVar, binding.indexVar, idCounter, signalInitializers);
    idCounter = itemTemplateProcessed.nextId;
    let processedEmptyTemplate: string | undefined;
    if (binding.emptyTemplate) {
      processedEmptyTemplate = binding.emptyTemplate.replace(/\s+/g, ' ').trim();
    }

    repeatBlocks.push({
      id: repeatId,
      signalName: signalNames[0] || '',
      signalNames,
      itemsExpression: binding.itemsExpression,
      itemVar: binding.itemVar,
      indexVar: binding.indexVar,
      itemTemplate: itemTemplateProcessed.processedContent,
      emptyTemplate: processedEmptyTemplate,
      trackByFn: binding.trackByFn,
      startIndex: binding.expressionStart,
      endIndex: binding.expressionEnd,
      itemBindings: itemTemplateProcessed.bindings,
      itemEvents: itemTemplateProcessed.events,
      signalBindings: itemTemplateProcessed.signalBindings,
      eventBindings: itemTemplateProcessed.eventBindings,
      nestedConditionals: itemTemplateProcessed.nestedConditionals,
      nestedWhenElse: itemTemplateProcessed.nestedWhenElse,
      nestedRepeats: itemTemplateProcessed.nestedRepeats,
    });
  }
  const textBindingSpans = new Map<number, string>(); // Map expression position to span ID

  for (const binding of parsed.bindings) {
    if (elementsInsideConditionals.has(binding.element)) continue;
    if (conditionalElementSet.has(binding.element)) continue;
    if (binding.type === 'when') continue;
    if (binding.type === 'whenElse') continue;
    if (binding.type === 'repeat') continue;
    if (binding.type === 'event') continue;
    if (binding.type === 'text') {
      const spanId = `b${idCounter++}`;
      textBindingSpans.set(binding.expressionStart, spanId);

      bindings.push({
        id: spanId,
        signalName: binding.signalName,
        type: 'text',
        property: binding.property,
        isInsideConditional: false,
        conditionalId: undefined,
      });
      continue;
    }
    if (!elementIdMap.has(binding.element)) {
      elementIdMap.set(binding.element, `b${idCounter++}`);
    }
    const elementId = elementIdMap.get(binding.element)!;

    bindings.push({
      id: elementId,
      signalName: binding.signalName,
      type: binding.type as 'style' | 'attr',
      property: binding.property,
      isInsideConditional: false,
      conditionalId: undefined,
    });
  }
  for (const binding of parsed.bindings) {
    if (binding.type !== 'event') continue;
    if (!binding.eventName || !binding.handlerExpression) continue;

    const eventId = `e${eventIdCounter.value++}`;
    if (!elementIdMap.has(binding.element)) {
      elementIdMap.set(binding.element, `b${idCounter++}`);
    }
    const elementId = elementIdMap.get(binding.element)!;

    eventBindings.push({
      id: eventId,
      eventName: binding.eventName,
      modifiers: binding.eventModifiers || [],
      handlerExpression: binding.handlerExpression,
      elementId,
      startIndex: binding.expressionStart,
      endIndex: binding.expressionEnd,
    });
  }
  const processedContent = generateProcessedHtml(
    templateContent,
    parsed,
    signalInitializers,
    elementIdMap,
    conditionals,
    whenElseBlocks,
    repeatBlocks,
    eventBindings,
    textBindingSpans,
  );

  return {
    processedContent,
    bindings,
    conditionals,
    whenElseBlocks,
    repeatBlocks,
    eventBindings,
    nextId: idCounter,
    hasConditionals: conditionals.length > 0 || whenElseBlocks.length > 0 || repeatBlocks.length > 0,
  };
};

const processConditionalElementHtml = (
  element: HtmlElement,
  originalHtml: string,
  signalInitializers: Map<string, string | number | boolean>,
  elementIdMap: Map<HtmlElement, string>,
  conditionalId: string,
  nestedConditionalBlocks?: ConditionalBlock[],
  eventIdCounter: { value: number } = { value: 0 },
): { html: string; eventBindings: EventBinding[] } => {
  let html = getElementHtml(element, originalHtml);
  const eventBindings: EventBinding[] = [];
  if (element.whenDirective) {
    html = html.replace(element.whenDirective, '');
  }
  const tagNameEnd = element.tagName.length + 1; // +1 for '<'
  html = html.substring(0, tagNameEnd) + ` id="${conditionalId}"` + html.substring(tagNameEnd);
  html = replaceExpressionsWithValues(html, signalInitializers);
  const eventAttrRegex = /@([\w.]+)=\$\{([^}]+)\}/g;
  let eventMatch: RegExpExecArray | null;
  const eventReplacements: Array<{ original: string; replacement: string; eventBinding: EventBinding }> = [];

  while ((eventMatch = eventAttrRegex.exec(html)) !== null) {
    const fullMatch = eventMatch[0];
    const eventSpec = eventMatch[1]; // e.g., "click" or "click.stop.prevent"
    const handlerExpression = eventMatch[2]?.trim() ?? '';
    if (!eventSpec) continue;
    const parts = eventSpec.split('.');
    const eventName = parts[0] ?? '';
    const modifiers = parts.slice(1);

    const eventId = `e${eventIdCounter.value++}`;
    const attrValue = modifiers.length > 0 ? `${eventId}:${modifiers.join(':')}` : eventId;
    eventReplacements.push({
      original: fullMatch,
      replacement: `data-evt-${eventName}="${attrValue}"`,
      eventBinding: {
        id: eventId,
        eventName,
        modifiers,
        handlerExpression,
        elementId: conditionalId, // Events on the conditional element itself
        startIndex: 0, // Not used in conditional context
        endIndex: 0,
      },
    });
  }
  for (const { original, replacement, eventBinding } of eventReplacements) {
    html = html.replace(original, replacement);
    eventBindings.push(eventBinding);
  }
  html = addIdsToNestedElements(html, element, elementIdMap, originalHtml);
  if (nestedConditionalBlocks && nestedConditionalBlocks.length > 0) {
    for (const nestedCond of nestedConditionalBlocks) {
      const jsExprEscaped = nestedCond.jsExpression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const whenAttrPattern = new RegExp(`"\\$\\{when\\(${jsExprEscaped}\\)\\}"`, 'g');
      const elementWithWhenPattern = new RegExp(`<(\\w+)([^>]*)"\\$\\{when\\(${jsExprEscaped}\\)\\}"([^>]*)>([\\s\\S]*?)<\\/\\1>`, 'g');

      const match = elementWithWhenPattern.exec(html);
      if (match) {
        html = html.replace(match[0], `<template id="${nestedCond.id}"></template>`);
      } else {
        html = html.replace(whenAttrPattern, '');
      }
    }
  }
  html = html.replace(/\s+/g, ' ').replace(/\s+>/g, '>').replace(/\s>/g, '>');

  return { html, eventBindings };
};

const replaceExpressionsWithValues = (html: string, signalInitializers: Map<string, string | number | boolean>): string => {
  return html.replace(/\$\{this\.(\w+)\(\)\}/g, (match, signalName) => {
    const value = signalInitializers.get(signalName);
    return value !== undefined ? String(value) : '';
  });
};

/**
 * Information about a static repeat template with DOM navigation paths
 */
interface StaticTemplateInfo {
  /** Static HTML template without dynamic values */
  staticHtml: string;
  /** Array of element bindings with navigation paths */
  elementBindings: Array<{
    id: string;
    path: number[];
    bindings: Array<{
      type: 'text' | 'attr';
      property?: string;
      expression: string;
    }>;
  }>;
  /** Whether this template can use the optimized path */
  canUseOptimized: boolean;
  /** Reason optimization was skipped (for warnings) */
  skipReason?: 'multi-root' | 'path-not-found';
}

/** Reasons why a repeat block cannot use the optimized template-based rendering */
type RepeatOptimizationSkipReason = 
  | 'no-bindings'           // No item bindings at all
  | 'signal-bindings'       // Has this._signal() bindings inside
  | 'nested-repeat'         // Has repeat() inside repeat()
  | 'nested-conditional'    // Has when() or whenElse() inside
  | 'item-events'           // Has @click etc. inside items
  | 'mixed-bindings'        // Item binding expressions contain this._
  | 'multi-root'            // Template has multiple root elements
  | 'path-not-found';       // Element path couldn't be computed

/**
 * Get a human-readable explanation for why optimization was skipped
 */
const getOptimizationSkipMessage = (reason: RepeatOptimizationSkipReason): string => {
  switch (reason) {
    case 'no-bindings':
      return 'no item bindings found';
    case 'signal-bindings':
      return 'contains component signal bindings (this._signalName()) inside items - move to data model';
    case 'nested-repeat':
      return 'contains nested repeat() - not yet supported for optimization';
    case 'nested-conditional':
      return 'contains when()/whenElse() inside items - not yet supported for optimization';
    case 'item-events':
      return 'contains @event handlers inside items - use event delegation on container instead';
    case 'mixed-bindings':
      return 'item bindings reference component signals (this._) - use pure item data instead';
    case 'multi-root':
      return 'template has multiple root elements - wrap in a single container element';
    case 'path-not-found':
      return 'element navigation path could not be computed';
  }
};

/**
 * Generate a static template and element paths for optimized repeat rendering
 * 
 * This transforms a dynamic template like:
 *   <tr data-id="${item.id}"><td><span>${item.label}</span></td></tr>
 * Into a static template:
 *   <tr><td><span></span></td></tr>
 * Plus navigation paths to each dynamic element.
 */
const generateStaticRepeatTemplate = (
  itemTemplate: string,
  itemBindings: ItemBinding[],
  itemVar: string,
): StaticTemplateInfo => {
  // Parse the template to get element structure
  const parsed = parseHtmlTemplate(itemTemplate);
  
  if (parsed.roots.length !== 1) {
    // Multiple root elements - cannot use optimized path
    return { staticHtml: '', elementBindings: [], canUseOptimized: false, skipReason: 'multi-root' };
  }
  
  const rootEl = parsed.roots[0]!;
  
  // Build a map of element ID to bindings
  const bindingsByElement = new Map<string, ItemBinding[]>();
  for (const binding of itemBindings) {
    if (!bindingsByElement.has(binding.elementId)) {
      bindingsByElement.set(binding.elementId, []);
    }
    bindingsByElement.get(binding.elementId)!.push(binding);
  }
  
  // Compute path for each element with bindings
  const elementPaths = new Map<string, number[]>();
  
  const findElementPath = (el: HtmlElement, targetId: string, currentPath: number[]): number[] | null => {
    // Check if this element has the target ID
    const elId = el.attributes.get('id')?.value || el.attributes.get('data-bind-id')?.value;
    if (elId === targetId) {
      return currentPath;
    }
    
    // Search children
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i]!;
      const childPath = findElementPath(child, targetId, [...currentPath, i]);
      if (childPath) return childPath;
    }
    
    return null;
  };
  
  // Find path for each element with bindings
  for (const elementId of bindingsByElement.keys()) {
    // Check if root element matches
    const rootId = rootEl.attributes.get('id')?.value || rootEl.attributes.get('data-bind-id')?.value;
    if (rootId === elementId) {
      elementPaths.set(elementId, []);
    } else {
      const path = findElementPath(rootEl, elementId, []);
      if (path) {
        elementPaths.set(elementId, path);
      }
    }
  }
  
  // Check if all bindings have paths
  for (const elementId of bindingsByElement.keys()) {
    if (!elementPaths.has(elementId)) {
      return { staticHtml: '', elementBindings: [], canUseOptimized: false, skipReason: 'path-not-found' };
    }
  }
  
  // Generate static HTML by removing dynamic expressions
  let staticHtml = itemTemplate;
  
  // Remove template literal expressions ${...} that contain item variable
  // Replace text content bindings with empty spans or just empty text
  const itemPattern = new RegExp(`\\$\\{[^}]*\\b${itemVar}[^}]*\\}`, 'g');
  staticHtml = staticHtml.replace(itemPattern, '');
  
  // Also remove any id attributes that were added for bindings (they're not needed in static template)
  // But keep data-bind-id for navigation reference
  // Actually, we should keep IDs since they might be used for other purposes
  
  // Remove data-bind-id attributes (we use paths instead)
  staticHtml = staticHtml.replace(/\s*data-bind-id="[^"]*"/g, '');
  
  // Remove inline id attributes that were only added for bindings
  // These follow the pattern id="i0", id="i1", etc.
  staticHtml = staticHtml.replace(/\s*id="i\d+"/g, '');
  
  // Clean up whitespace
  staticHtml = staticHtml.replace(/\s+/g, ' ').trim();
  
  // Build element bindings array (sorted by path for consistent indexing)
  const elementBindingsArray: StaticTemplateInfo['elementBindings'] = [];
  const sortedIds = [...bindingsByElement.keys()].sort((a, b) => {
    const pathA = elementPaths.get(a) || [];
    const pathB = elementPaths.get(b) || [];
    // Sort by path length, then by path values
    if (pathA.length !== pathB.length) return pathA.length - pathB.length;
    for (let i = 0; i < pathA.length; i++) {
      if (pathA[i] !== pathB[i]) return pathA[i]! - pathB[i]!;
    }
    return 0;
  });
  
  for (const elementId of sortedIds) {
    const bindings = bindingsByElement.get(elementId)!;
    const path = elementPaths.get(elementId)!;
    
    elementBindingsArray.push({
      id: elementId,
      path,
      bindings: bindings.map(b => ({
        type: b.type as 'text' | 'attr',
        property: b.property,
        expression: b.expression,
      })),
    });
  }
  
  return {
    staticHtml,
    elementBindings: elementBindingsArray,
    canUseOptimized: true,
  };
};

const processItemTemplateRecursively = (
  templateContent: string,
  itemVar: string,
  indexVar: string | undefined,
  signalInitializers: Map<string, string | number | boolean>,
  startingId: number,
): {
  processedContent: string;
  itemBindings: ItemBinding[];
  itemEvents: ItemEventBinding[];
  signalBindings: BindingInfo[];
  eventBindings: EventBinding[];
  nestedConditionals: ConditionalBlock[];
  nestedWhenElse: WhenElseBlock[];
  nestedRepeats: RepeatBlock[];
  nextId: number;
} => {
  const parsed = parseHtmlTemplate(templateContent);

  const itemBindings: ItemBinding[] = [];
  const itemEvents: ItemEventBinding[] = [];
  const signalBindings: BindingInfo[] = [];
  const eventBindings: EventBinding[] = [];
  const conditionals: ConditionalBlock[] = [];
  const whenElseBlocks: WhenElseBlock[] = [];
  const repeatBlocks: RepeatBlock[] = [];

  let idCounter = startingId;
  const eventIdCounter = { value: 0 };
  let itemEventIdCounter = 0;

  const elementIdMap = new Map<HtmlElement, string>();
  const conditionalElements = findElementsWithWhenDirective(parsed.roots);
  const conditionalElementSet = new Set(conditionalElements);
  const elementsInsideConditionals = new Set<HtmlElement>();
  for (const condEl of conditionalElements) {
    walkElements([condEl], (el) => {
      if (el !== condEl) {
        elementsInsideConditionals.add(el);
      }
    });
  }
  for (const condEl of conditionalElements) {
    const whenBinding = parsed.bindings.find((b) => b.element === condEl && b.type === 'when');
    if (!whenBinding || !whenBinding.jsExpression) continue;

    const signalNames = whenBinding.signalNames || [whenBinding.signalName];
    const jsExpression = whenBinding.jsExpression;

    const conditionalId = `b${idCounter++}`;
    elementIdMap.set(condEl, conditionalId);
    let evalExpr = jsExpression;
    for (const sigName of signalNames) {
      const initialVal = signalInitializers.get(sigName);
      const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
      evalExpr = evalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
    }
    let initialValue = false;
    try {
      initialValue = Boolean(eval(evalExpr));
    } catch (e) {
    }
    const condBindings = getBindingsForElement(condEl, parsed.bindings);
    const nestedBindings: BindingInfo[] = [];

    for (const binding of condBindings) {
      if (binding.type === 'when') continue;
      if (binding.type === 'event') continue;

      let elementId: string;
      if (binding.element === condEl) {
        elementId = conditionalId;
      } else {
        if (!elementIdMap.has(binding.element)) {
          elementIdMap.set(binding.element, `b${idCounter++}`);
        }
        elementId = elementIdMap.get(binding.element)!;
      }

      nestedBindings.push({
        id: elementId,
        signalName: binding.signalName,
        type: binding.type as 'text' | 'style' | 'attr',
        property: binding.property,
        isInsideConditional: true,
        conditionalId,
      });
    }

    const processedCondResult = processConditionalElementHtml(condEl, templateContent, signalInitializers, elementIdMap, conditionalId, undefined, eventIdCounter);
    const itemPattern = new RegExp(`\\$\\{\\s*${itemVar}\\s*\\}`, 'g');
    const condItemBindings: ItemBinding[] = [];
    let transformedCondHtml = processedCondResult.html;
    const itemMatches = [...processedCondResult.html.matchAll(itemPattern)];
    if (itemMatches.length > 0) {
      let offset = 0;
      for (const match of itemMatches) {
        const matchStart = match.index! + offset;
        const matchEnd = matchStart + match[0].length;
        const itemBindingId = `i${idCounter++}`;
        const replacement = `<span id="${itemBindingId}">\${${itemVar}$()}</span>`;
        transformedCondHtml = transformedCondHtml.substring(0, matchStart) + replacement + transformedCondHtml.substring(matchEnd);
        condItemBindings.push({
          elementId: itemBindingId,
          expression: itemVar,
          type: 'text',
        });
        offset += replacement.length - match[0].length;
      }
    }

    conditionals.push({
      id: conditionalId,
      signalName: signalNames[0] ?? '',
      signalNames,
      jsExpression,
      initialValue,
      templateContent: transformedCondHtml,
      startIndex: condEl.tagStart,
      endIndex: condEl.closeTagEnd,
      nestedBindings,
      nestedItemBindings: condItemBindings,
      nestedConditionals: [],
      nestedEventBindings: processedCondResult.eventBindings,
    });

    signalBindings.push(...nestedBindings);
    eventBindings.push(...processedCondResult.eventBindings);
  }
  for (const binding of parsed.bindings) {
    if (binding.type !== 'whenElse') continue;
    if (!binding.jsExpression || !binding.thenTemplate || !binding.elseTemplate) continue;

    const signalNames = binding.signalNames || [binding.signalName];
    const jsExpression = binding.jsExpression;

    const thenId = `b${idCounter++}`;
    const elseId = `b${idCounter++}`;
    let evalExpr = jsExpression;
    for (const sigName of signalNames) {
      const initialVal = signalInitializers.get(sigName);
      const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
      evalExpr = evalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
    }
    let initialValue = false;
    try {
      initialValue = Boolean(eval(evalExpr));
    } catch (e) {
    }
    const thenProcessed = processSubTemplateWithNesting(binding.thenTemplate, signalInitializers, idCounter, thenId);
    idCounter = thenProcessed.nextId;
    const elseProcessed = processSubTemplateWithNesting(binding.elseTemplate, signalInitializers, idCounter, elseId);
    idCounter = elseProcessed.nextId;

    whenElseBlocks.push({
      thenId,
      elseId,
      signalName: signalNames[0] || '',
      signalNames,
      jsExpression,
      initialValue,
      thenTemplate: thenProcessed.processedContent,
      elseTemplate: elseProcessed.processedContent,
      startIndex: binding.expressionStart,
      endIndex: binding.expressionEnd,
      thenBindings: thenProcessed.bindings,
      elseBindings: elseProcessed.bindings,
      nestedConditionals: [...thenProcessed.conditionals, ...elseProcessed.conditionals],
      nestedWhenElse: [...thenProcessed.whenElseBlocks, ...elseProcessed.whenElseBlocks],
    });
  }
  for (const binding of parsed.bindings) {
    if (binding.type !== 'repeat') continue;
    if (!binding.itemsExpression || !binding.itemVar || !binding.itemTemplate) continue;

    const nestedSignalNames = binding.signalNames || [binding.signalName];
    const nestedRepeatId = `b${idCounter++}`;
    const nestedProcessed = processItemTemplateRecursively(binding.itemTemplate, binding.itemVar, binding.indexVar, signalInitializers, idCounter);
    idCounter = nestedProcessed.nextId;
    let processedEmptyTemplate: string | undefined;
    if (binding.emptyTemplate) {
      processedEmptyTemplate = binding.emptyTemplate.replace(/\s+/g, ' ').trim();
    }

    repeatBlocks.push({
      id: nestedRepeatId,
      signalName: nestedSignalNames[0] || '',
      signalNames: nestedSignalNames,
      itemsExpression: binding.itemsExpression,
      itemVar: binding.itemVar,
      indexVar: binding.indexVar,
      itemTemplate: nestedProcessed.processedContent,
      emptyTemplate: processedEmptyTemplate,
      trackByFn: binding.trackByFn,
      startIndex: binding.expressionStart,
      endIndex: binding.expressionEnd,
      itemBindings: nestedProcessed.itemBindings,
      itemEvents: nestedProcessed.itemEvents,
      signalBindings: nestedProcessed.signalBindings,
      eventBindings: nestedProcessed.eventBindings,
      nestedConditionals: nestedProcessed.nestedConditionals,
      nestedWhenElse: nestedProcessed.nestedWhenElse,
      nestedRepeats: nestedProcessed.nestedRepeats,
    });
  }
  const conditionalRanges = conditionals.map((c) => ({ start: c.startIndex, end: c.endIndex }));
  const whenElseRanges = whenElseBlocks.map((w) => ({ start: w.startIndex, end: w.endIndex }));
  const repeatRanges = repeatBlocks.map((r) => ({ start: r.startIndex, end: r.endIndex }));
  const allRanges = [...conditionalRanges, ...whenElseRanges, ...repeatRanges];
  const textBindingSpans = new Map<number, string>();
  for (const binding of parsed.bindings) {
    if (elementsInsideConditionals.has(binding.element)) continue;
    if (conditionalElementSet.has(binding.element)) continue;
    if (binding.type === 'when' || binding.type === 'whenElse' || binding.type === 'repeat') continue;
    const insideRange = allRanges.some((r) => binding.expressionStart >= r.start && binding.expressionStart < r.end);
    if (insideRange) continue;
    if (binding.type === 'event' && binding.eventName && binding.handlerExpression) {
      const refsItem = new RegExp(`\\b${itemVar}\\b`).test(binding.handlerExpression);
      const refsIndex = indexVar ? new RegExp(`\\b${indexVar}\\b`).test(binding.handlerExpression) : false;

      if (refsItem || refsIndex) {
        const eventId = `ie${itemEventIdCounter++}`;
        if (!elementIdMap.has(binding.element)) {
          elementIdMap.set(binding.element, `b${idCounter++}`);
        }
        itemEvents.push({
          eventId,
          eventName: binding.eventName,
          modifiers: binding.eventModifiers || [],
          handlerExpression: binding.handlerExpression,
        });
      } else {
        const eventId = `e${eventIdCounter.value++}`;
        if (!elementIdMap.has(binding.element)) {
          elementIdMap.set(binding.element, `b${idCounter++}`);
        }
        const elementId = elementIdMap.get(binding.element)!;
        eventBindings.push({
          id: eventId,
          eventName: binding.eventName,
          modifiers: binding.eventModifiers || [],
          handlerExpression: binding.handlerExpression,
          elementId,
          startIndex: binding.expressionStart,
          endIndex: binding.expressionEnd,
        });
      }
      continue;
    }
    if (binding.type === 'text' || binding.type === 'style' || binding.type === 'attr') {
      const spanId = `b${idCounter++}`;

      if (binding.type === 'text') {
        textBindingSpans.set(binding.expressionStart, spanId);
      } else {
        if (!elementIdMap.has(binding.element)) {
          elementIdMap.set(binding.element, spanId);
        }
      }

      signalBindings.push({
        id: binding.type === 'text' ? spanId : elementIdMap.get(binding.element)!,
        signalName: binding.signalName,
        type: binding.type as 'text' | 'style' | 'attr',
        property: binding.property,
        isInsideConditional: false,
        conditionalId: undefined,
      });
    }
  }
  const itemExprRegex = new RegExp(`\\$\\{([^}]*\\b${itemVar}\\b[^}]*)\\}`, 'g');
  const itemTextMatches: Array<{ start: number; end: number; expr: string; id: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = itemExprRegex.exec(templateContent)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;
    const insideRange = allRanges.some((r) => matchStart >= r.start && matchStart < r.end);
    if (insideRange) continue;
    const beforeText = templateContent.substring(Math.max(0, matchStart - 200), matchStart);
    const inAttr = /=["'][^"']*$/.test(beforeText);

    if (!inAttr) {
      const id = `i${idCounter++}`;
      const expression = match[1]?.trim() ?? '';

      itemBindings.push({
        elementId: id,
        type: 'text',
        expression: expression,
      });

      itemTextMatches.push({ start: matchStart, end: matchEnd, expr: expression, id });
    }
  }
  const indexPattern = indexVar ? `|${indexVar}` : '';
  const attrItemRegex = new RegExp(`(?:^|[>\\s])([\\w-]+)=["']\\$\\{([^}]*\\b(?:${itemVar}${indexPattern})\\b[^}]*)\\}["']`, 'g');
  const itemAttrMatches: Array<{ start: number; end: number; attrName: string; expr: string; id: string }> = [];

  while ((match = attrItemRegex.exec(templateContent)) !== null) {
    const leadingChar = match[0].match(/^[>\s]/);
    const leadingOffset = leadingChar ? 1 : 0;
    const matchStart = match.index + leadingOffset;
    const matchEnd = match.index + match[0].length;
    const insideRange = allRanges.some((r) => matchStart >= r.start && matchStart < r.end);
    if (insideRange) continue;

    const id = `i${idCounter++}`;
    const attrName = match[1];
    const expression = match[2]?.trim() ?? '';
    if (!attrName) continue;

    itemBindings.push({
      elementId: id,
      type: 'attr',
      property: attrName,
      expression: expression,
    });

    itemAttrMatches.push({ start: matchStart, end: matchEnd, attrName, expr: expression, id });
  }
  const edits: Array<{ start: number; end: number; replacement: string }> = [];
  for (const cond of conditionals) {
    const replacement = cond.initialValue ? cond.templateContent : `<template id="${cond.id}"></template>`;
    edits.push({ start: cond.startIndex, end: cond.endIndex, replacement });
  }
  for (const we of whenElseBlocks) {
    const thenReplacement = we.initialValue ? injectIdIntoFirstElement(we.thenTemplate, we.thenId) : `<template id="${we.thenId}"></template>`;
    const elseReplacement = we.initialValue ? `<template id="${we.elseId}"></template>` : injectIdIntoFirstElement(we.elseTemplate, we.elseId);
    edits.push({ start: we.startIndex, end: we.endIndex, replacement: thenReplacement + elseReplacement });
  }
  for (const rep of repeatBlocks) {
    edits.push({ start: rep.startIndex, end: rep.endIndex, replacement: `<template id="${rep.id}"></template>` });
  }
  for (const [exprPos, spanId] of textBindingSpans) {
    const exprMatch = /\$\{this\.(\w+)\(\)\}/.exec(templateContent.substring(exprPos));
    if (exprMatch && exprMatch.index === 0 && exprMatch[1]) {
      const signalName = exprMatch[1];
      const value = signalInitializers.get(signalName);
      const valueStr = value !== undefined ? String(value) : '';
      edits.push({
        start: exprPos,
        end: exprPos + exprMatch[0].length,
        replacement: `<span id="${spanId}">${valueStr}</span>`,
      });
    }
  }
  for (const { start, end, expr, id } of itemTextMatches) {
    const transformedExpr = expr.replace(new RegExp(`\\b${itemVar}\\b`, 'g'), `${itemVar}$()`);
    edits.push({
      start,
      end,
      replacement: `<span id="${id}">\${${transformedExpr}}</span>`,
    });
  }
  const elementIdByTagStart = new Map<number, string>();
  
  for (const itemAttr of itemAttrMatches) {
    let tagStart = itemAttr.start;
    while (tagStart > 0 && templateContent[tagStart] !== '<') {
      tagStart--;
    }
    if (!elementIdByTagStart.has(tagStart)) {
      elementIdByTagStart.set(tagStart, itemAttr.id);
    }
  }
  const injectedElementIds = new Set<number>();
  
  for (const { start, end, attrName, expr, id } of itemAttrMatches) {
    let tagStart = start;
    while (tagStart > 0 && templateContent[tagStart] !== '<') {
      tagStart--;
    }
    const elementId = elementIdByTagStart.get(tagStart) || id;
    let transformedExpr = expr.replace(new RegExp(`\\b${itemVar}\\b`, 'g'), `${itemVar}$()`);
    if (indexVar) {
      transformedExpr = transformedExpr.replace(new RegExp(`\\b${indexVar}\\b`, 'g'), indexVar);
    }
    const needsDataBindId = !injectedElementIds.has(tagStart);
    if (needsDataBindId) {
      injectedElementIds.add(tagStart);
    }
    const binding = itemBindings.find(b => b.elementId === id);
    if (binding) {
      binding.elementId = elementId;
    }
    
    edits.push({
      start,
      end,
      replacement: needsDataBindId 
        ? `data-bind-id="${elementId}" ${attrName}="\${${transformedExpr}}"`
        : `${attrName}="\${${transformedExpr}}"`,
    });
  }
  for (const [element, id] of elementIdMap) {
    const insideRange = allRanges.some((r) => element.tagStart >= r.start && element.tagStart < r.end);
    if (insideRange) continue;
    if (element.attributes.has('id')) continue;
    const evtAttrs: string[] = [];
    for (const evt of eventBindings) {
      if (evt.elementId === id) {
        const attrValue = evt.modifiers.length > 0 ? `${evt.id}:${evt.modifiers.join(':')}` : evt.id;
        evtAttrs.push(`data-evt-${evt.eventName}="${attrValue}"`);
      }
    }
    for (const evt of itemEvents) {
      const attrValue = evt.modifiers.length > 0 ? `${evt.eventId}:${evt.modifiers.join(':')}` : evt.eventId;
      evtAttrs.push(`data-evt-${evt.eventName}="${attrValue}"`);
    }

    const attrsToAdd = [`id="${id}"`, ...evtAttrs].join(' ');
    edits.push({ start: element.tagNameEnd, end: element.tagNameEnd, replacement: ' ' + attrsToAdd });
  }
  for (const binding of parsed.bindings) {
    if (binding.type === 'event') {
      const alreadyEdited = edits.some((e) => e.start <= binding.expressionStart && e.end >= binding.expressionEnd);
      if (!alreadyEdited) {
        edits.push({ start: binding.expressionStart, end: binding.expressionEnd, replacement: '' });
      }
    }
  }
  edits.sort((a, b) => b.start - a.start);

  let result = templateContent;
  for (const edit of edits) {
    result = result.substring(0, edit.start) + edit.replacement + result.substring(edit.end);
  }
  result = result.replace(/\s+/g, ' ').trim();

  return {
    processedContent: result,
    itemBindings,
    itemEvents,
    signalBindings,
    eventBindings,
    nestedConditionals: conditionals,
    nestedWhenElse: whenElseBlocks,
    nestedRepeats: repeatBlocks,
    nextId: idCounter,
  };
};

const processItemTemplate = (
  templateContent: string,
  itemVar: string,
  indexVar: string | undefined,
  startingId: number,
  signalInitializers: Map<string, string | number | boolean> = new Map(),
): {
  processedContent: string;
  bindings: ItemBinding[];
  events: ItemEventBinding[];
  signalBindings: BindingInfo[];
  eventBindings: EventBinding[];
  nestedConditionals: ConditionalBlock[];
  nestedWhenElse: WhenElseBlock[];
  nestedRepeats: RepeatBlock[];
  nextId: number;
} => {
  const result = processItemTemplateRecursively(templateContent, itemVar, indexVar, signalInitializers, startingId);
  return {
    processedContent: result.processedContent,
    bindings: result.itemBindings,
    events: result.itemEvents,
    signalBindings: result.signalBindings,
    eventBindings: result.eventBindings,
    nestedConditionals: result.nestedConditionals,
    nestedWhenElse: result.nestedWhenElse,
    nestedRepeats: result.nestedRepeats,
    nextId: result.nextId,
  };
};

const processSubTemplateWithNesting = (
  templateContent: string,
  signalInitializers: Map<string, string | number | boolean>,
  startingId: number,
  parentId: string,
): {
  processedContent: string;
  bindings: BindingInfo[];
  conditionals: ConditionalBlock[];
  whenElseBlocks: WhenElseBlock[];
  nextId: number;
} => {
  const parsed = parseHtmlTemplate(templateContent);
  const bindings: BindingInfo[] = [];
  const conditionals: ConditionalBlock[] = [];
  const whenElseBlocks: WhenElseBlock[] = [];
  let idCounter = startingId;
  const elementIdMap = new Map<HtmlElement, string>();
  const eventIdCounter = { value: 0 };
  const conditionalElements = findElementsWithWhenDirective(parsed.roots);
  const conditionalElementSet = new Set(conditionalElements);
  const elementsInsideConditionals = new Set<HtmlElement>();
  for (const condEl of conditionalElements) {
    walkElements([condEl], (el) => {
      if (el !== condEl) {
        elementsInsideConditionals.add(el);
      }
    });
  }
  for (const condEl of conditionalElements) {
    const whenBinding = parsed.bindings.find((b) => b.element === condEl && b.type === 'when');
    if (!whenBinding || !whenBinding.jsExpression) continue;

    const signalNames = whenBinding.signalNames || [whenBinding.signalName];
    const jsExpression = whenBinding.jsExpression;

    const conditionalId = `b${idCounter++}`;
    elementIdMap.set(condEl, conditionalId);
    let evalExpr = jsExpression;
    for (const sigName of signalNames) {
      const initialVal = signalInitializers.get(sigName);
      const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
      evalExpr = evalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
    }
    let initialValue = false;
    try {
      initialValue = Boolean(eval(evalExpr));
    } catch (e) {
    }
    const condBindings = getBindingsForElement(condEl, parsed.bindings);
    const nestedBindings: BindingInfo[] = [];

    for (const binding of condBindings) {
      if (binding.type === 'when') continue;
      if (binding.type === 'event') continue;

      let elementId: string;
      if (binding.element === condEl) {
        elementId = conditionalId;
      } else {
        if (!elementIdMap.has(binding.element)) {
          elementIdMap.set(binding.element, `b${idCounter++}`);
        }
        elementId = elementIdMap.get(binding.element)!;
      }

      nestedBindings.push({
        id: elementId,
        signalName: binding.signalName,
        type: binding.type as 'text' | 'style' | 'attr',
        property: binding.property,
        isInsideConditional: true,
        conditionalId,
      });
    }

    const processedCondResult = processConditionalElementHtml(condEl, templateContent, signalInitializers, elementIdMap, conditionalId, undefined, eventIdCounter);

    conditionals.push({
      id: conditionalId,
      signalName: signalNames[0] ?? '',
      signalNames,
      jsExpression,
      initialValue,
      templateContent: processedCondResult.html,
      startIndex: condEl.tagStart,
      endIndex: condEl.closeTagEnd,
      nestedBindings,
      nestedItemBindings: [],
      nestedConditionals: [],
      nestedEventBindings: processedCondResult.eventBindings,
    });

    bindings.push(...nestedBindings);
  }
  for (const binding of parsed.bindings) {
    if (binding.type !== 'whenElse') continue;
    if (!binding.jsExpression || !binding.thenTemplate || !binding.elseTemplate) continue;

    const signalNames = binding.signalNames || [binding.signalName];
    const jsExpression = binding.jsExpression;

    const thenId = `b${idCounter++}`;
    const elseId = `b${idCounter++}`;
    let evalExpr = jsExpression;
    for (const sigName of signalNames) {
      const initialVal = signalInitializers.get(sigName);
      const sigRegex = new RegExp(`this\\.${sigName}\\(\\)`, 'g');
      evalExpr = evalExpr.replace(sigRegex, JSON.stringify(initialVal ?? false));
    }
    let initialValue = false;
    try {
      initialValue = Boolean(eval(evalExpr));
    } catch (e) {
    }
    const thenProcessed = processSubTemplateWithNesting(binding.thenTemplate, signalInitializers, idCounter, thenId);
    idCounter = thenProcessed.nextId;
    const elseProcessed = processSubTemplateWithNesting(binding.elseTemplate, signalInitializers, idCounter, elseId);
    idCounter = elseProcessed.nextId;

    whenElseBlocks.push({
      thenId,
      elseId,
      signalName: signalNames[0] || '',
      signalNames,
      jsExpression,
      initialValue,
      thenTemplate: thenProcessed.processedContent,
      elseTemplate: elseProcessed.processedContent,
      startIndex: binding.expressionStart,
      endIndex: binding.expressionEnd,
      thenBindings: thenProcessed.bindings,
      elseBindings: elseProcessed.bindings,
      nestedConditionals: [...thenProcessed.conditionals, ...elseProcessed.conditionals],
      nestedWhenElse: [...thenProcessed.whenElseBlocks, ...elseProcessed.whenElseBlocks],
    });
  }
  for (const binding of parsed.bindings) {
    if (elementsInsideConditionals.has(binding.element)) continue;
    if (conditionalElementSet.has(binding.element)) continue;
    if (binding.type === 'when' || binding.type === 'whenElse') continue;

    if (!elementIdMap.has(binding.element)) {
      elementIdMap.set(binding.element, `b${idCounter++}`);
    }
    const elementId = elementIdMap.get(binding.element)!;

    bindings.push({
      id: elementId,
      signalName: binding.signalName,
      type: binding.type as 'text' | 'style' | 'attr',
      property: binding.property,
      isInsideConditional: true,
      conditionalId: parentId,
    });
  }
  const edits: Array<{ start: number; end: number; replacement: string }> = [];
  for (const cond of conditionals) {
    const replacement = cond.initialValue ? cond.templateContent : `<template id="${cond.id}"></template>`;
    edits.push({ start: cond.startIndex, end: cond.endIndex, replacement });
  }
  for (const we of whenElseBlocks) {
    const thenReplacement = we.initialValue ? we.thenTemplate : `<template id="${we.thenId}"></template>`;
    const elseReplacement = we.initialValue ? `<template id="${we.elseId}"></template>` : we.elseTemplate;
    edits.push({ start: we.startIndex, end: we.endIndex, replacement: thenReplacement + elseReplacement });
  }
  const conditionalRanges = conditionals.map((c) => ({ start: c.startIndex, end: c.endIndex }));
  const whenElseRanges = whenElseBlocks.map((w) => ({ start: w.startIndex, end: w.endIndex }));
  const allRanges = [...conditionalRanges, ...whenElseRanges];

  const exprRegex = /\$\{this\.(\w+)\(\)\}/g;
  let match: RegExpExecArray | null;
  while ((match = exprRegex.exec(templateContent)) !== null) {
    const exprStart = match.index;
    const exprEnd = exprStart + match[0].length;
    const insideRange = allRanges.some((r) => exprStart >= r.start && exprStart < r.end);
    if (insideRange) continue;

    const signalName = match[1];
    if (!signalName) continue;
    const value = signalInitializers.get(signalName);
    const replacement = value !== undefined ? String(value) : '';
    edits.push({ start: exprStart, end: exprEnd, replacement });
  }
  for (const [element, id] of elementIdMap) {
    const insideRange = allRanges.some((r) => element.tagStart >= r.start && element.tagStart < r.end);
    if (insideRange) continue;
    if (element.attributes.has('id')) continue;
    edits.push({ start: element.tagNameEnd, end: element.tagNameEnd, replacement: ` id="${id}"` });
  }
  edits.sort((a, b) => b.start - a.start);
  let result = templateContent;
  for (const edit of edits) {
    result = result.substring(0, edit.start) + edit.replacement + result.substring(edit.end);
  }

  result = result.replace(/\s+/g, ' ').trim();

  return {
    processedContent: result,
    bindings,
    conditionals,
    whenElseBlocks,
    nextId: idCounter,
  };
};

const addIdsToNestedElements = (processedHtml: string, rootElement: HtmlElement, elementIdMap: Map<HtmlElement, string>, _originalHtml: string): string => {
  let result = processedHtml;
  walkElements([rootElement], (el) => {
    if (el === rootElement) return; // Root already has ID

    const id = elementIdMap.get(el);
    if (!id) return; // No ID needed for this element
    const existingAttrs: string[] = [];
    for (const [name, attr] of el.attributes) {
      const processedValue = replaceExpressionsWithValues(attr.value, new Map());
      existingAttrs.push(`${name}="${processedValue}"`);
    }
    const tagPattern = new RegExp(`<${el.tagName}(\\s+[^>]*)?(?<!id="[^"]*")>`, 'g');
    result = result.replace(tagPattern, (match) => {
      if (match.includes(`id="`)) return match; // Already has an ID
      return match.replace(`<${el.tagName}`, `<${el.tagName} id="${id}"`);
    });
  });

  return result;
};

const generateProcessedHtml = (
  originalHtml: string,
  parsed: ParsedTemplate,
  signalInitializers: Map<string, string | number | boolean>,
  elementIdMap: Map<HtmlElement, string>,
  conditionals: ConditionalBlock[],
  whenElseBlocks: WhenElseBlock[] = [],
  repeatBlocks: RepeatBlock[] = [],
  eventBindings: EventBinding[] = [],
  textBindingSpans: Map<number, string> = new Map(),
): string => {
  const edits: Array<{ start: number; end: number; replacement: string }> = [];
  const elementEventMap = new Map<HtmlElement, EventBinding[]>();
  for (const evt of eventBindings) {
    for (const [element, id] of elementIdMap) {
      if (id === evt.elementId) {
        if (!elementEventMap.has(element)) {
          elementEventMap.set(element, []);
        }
        elementEventMap.get(element)!.push(evt);
        break;
      }
    }
  }
  for (const cond of conditionals) {
    const replacement = cond.initialValue ? cond.templateContent : `<template id="${cond.id}"></template>`;
    edits.push({
      start: cond.startIndex,
      end: cond.endIndex,
      replacement,
    });
  }
  for (const we of whenElseBlocks) {
    const thenReplacement = we.initialValue ? injectIdIntoFirstElement(we.thenTemplate, we.thenId) : `<template id="${we.thenId}"></template>`;
    const elseReplacement = we.initialValue ? `<template id="${we.elseId}"></template>` : injectIdIntoFirstElement(we.elseTemplate, we.elseId);
    edits.push({
      start: we.startIndex,
      end: we.endIndex,
      replacement: thenReplacement + elseReplacement,
    });
  }
  for (const rep of repeatBlocks) {
    const replacement = `<template id="${rep.id}"></template>`;
    edits.push({
      start: rep.startIndex,
      end: rep.endIndex,
      replacement,
    });
  }
  const conditionalRanges = conditionals.map((c) => ({ start: c.startIndex, end: c.endIndex }));
  const whenElseRanges = whenElseBlocks.map((w) => ({ start: w.startIndex, end: w.endIndex }));
  const repeatRanges = repeatBlocks.map((r) => ({ start: r.startIndex, end: r.endIndex }));
  const allRanges = [...conditionalRanges, ...whenElseRanges, ...repeatRanges];

  const exprRegex = /\$\{this\.(\w+)\(\)\}/g;
  let match: RegExpExecArray | null;

  while ((match = exprRegex.exec(originalHtml)) !== null) {
    const exprStart = match.index;
    const exprEnd = exprStart + match[0].length;
    const insideRange = allRanges.some((r) => exprStart >= r.start && exprStart < r.end);
    if (insideRange) continue;

    const signalName = match[1];
    if (!signalName) continue;
    const value = signalInitializers.get(signalName);
    const valueStr = value !== undefined ? String(value) : '';
    const spanId = textBindingSpans.get(exprStart);
    let replacement: string;
    if (spanId) {
      replacement = `<span id="${spanId}">${valueStr}</span>`;
    } else {
      replacement = valueStr;
    }

    edits.push({ start: exprStart, end: exprEnd, replacement });
  }
  const elementDataAttrs = new Map<HtmlElement, string[]>();

  for (const binding of parsed.bindings) {
    if (binding.type === 'event' && binding.eventName) {
      const eventBinding = eventBindings.find((eb) => eb.eventName === binding.eventName && eb.startIndex === binding.expressionStart);
      if (eventBinding) {
        edits.push({
          start: binding.expressionStart,
          end: binding.expressionEnd,
          replacement: '',
        });
        const attrValue = eventBinding.modifiers.length > 0 ? `${eventBinding.id}:${eventBinding.modifiers.join(':')}` : eventBinding.id;
        if (!elementDataAttrs.has(binding.element)) {
          elementDataAttrs.set(binding.element, []);
        }
        elementDataAttrs.get(binding.element)!.push(`data-evt-${binding.eventName}="${attrValue}"`);
      }
    }
  }
  for (const [element, id] of elementIdMap) {
    const insideRange = allRanges.some((r) => element.tagStart >= r.start && element.tagStart < r.end);
    if (insideRange) continue;
    const attrsToAdd: string[] = [];
    if (!element.attributes.has('id')) {
      attrsToAdd.push(`id="${id}"`);
    }
    const dataAttrs = elementDataAttrs.get(element);
    if (dataAttrs) {
      attrsToAdd.push(...dataAttrs);
    }

    if (attrsToAdd.length > 0) {
      edits.push({
        start: element.tagNameEnd,
        end: element.tagNameEnd,
        replacement: ' ' + attrsToAdd.join(' '),
      });
    }
  }
  edits.sort((a, b) => b.start - a.start);

  let result = originalHtml;
  for (const edit of edits) {
    result = result.substring(0, edit.start) + edit.replacement + result.substring(edit.end);
  }
  result = result.replace(/\s+/g, ' ').trim();

  return result;
};

const generateBindingUpdateCode = (binding: BindingInfo): string => {
  const elRef = binding.id;

  if (binding.type === 'style') {
    const prop = toCamelCase(binding.property!);
    return `${elRef}.style.${prop} = v`;
  } else if (binding.type === 'attr') {
    return `${elRef}.setAttribute('${binding.property}', v)`;
  } else {
    return `${elRef}.textContent = v`;
  }
};

const generateInitialValueCode = (binding: BindingInfo): string => {
  const elRef = binding.id;
  const signalCall = `this.${binding.signalName}()`;

  if (binding.type === 'style') {
    const prop = toCamelCase(binding.property!);
    return `${elRef}.style.${prop} = ${signalCall}`;
  } else if (binding.type === 'attr') {
    return `${elRef}.setAttribute('${binding.property}', ${signalCall})`;
  } else {
    return `${elRef}.textContent = ${signalCall}`;
  }
};

const groupBindingsBySignal = (bindings: BindingInfo[]): Map<string, BindingInfo[]> => {
  const groups = new Map<string, BindingInfo[]>();
  for (const binding of bindings) {
    const existing = groups.get(binding.signalName) || [];
    existing.push(binding);
    groups.set(binding.signalName, existing);
  }
  return groups;
};

const generateConsolidatedSubscription = (signalName: string, bindings: BindingInfo[]): string => {
  if (bindings.length === 1) {
    const update = generateBindingUpdateCode(bindings[0]!);
    return `this.${signalName}.subscribe(v => { ${update}; }, true)`;
  }
  const updates = bindings.map((b) => `      ${generateBindingUpdateCode(b)};`).join('\n');
  return `this.${signalName}.subscribe(v => {\n${updates}\n    }, true)`;
};

const generateInitBindingsFunction = (
  bindings: BindingInfo[],
  conditionals: ConditionalBlock[],
  whenElseBlocks: WhenElseBlock[] = [],
  repeatBlocks: RepeatBlock[] = [],
  eventBindings: EventBinding[] = [],
  filePath: string = '',
): { code: string; staticTemplates: string[] } => {
  const lines: string[] = [];
  const staticTemplates: string[] = []; // Collect static templates for repeat optimizations
  lines.push('  initializeBindings = () => {');
  lines.push('    const r = this.shadowRoot;');
  const topLevelBindings = bindings.filter((b) => !b.isInsideConditional);
  const topLevelIds = [...new Set(topLevelBindings.map((b) => b.id))];
  if (topLevelIds.length > 0) {
    for (const id of topLevelIds) {
      lines.push(`    const ${id} = r.getElementById('${id}');`);
    }
  }
  for (const binding of topLevelBindings) {
    lines.push(`    ${generateInitialValueCode(binding)};`);
  }
  const signalGroups = groupBindingsBySignal(topLevelBindings);
  for (const [signalName, signalBindings] of signalGroups) {
    lines.push(`    ${generateConsolidatedSubscription(signalName, signalBindings)};`);
  }
  for (const cond of conditionals) {
    const nestedBindings = cond.nestedBindings;
    const nestedConds = cond.nestedConditionals || [];
    const escapedTemplate = cond.templateContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    let nestedCode = '() => []';
    if (nestedBindings.length > 0 || nestedConds.length > 0) {
      const nestedIds = [...new Set(nestedBindings.map((b) => b.id))];
      const nestedLines: string[] = [];
      nestedLines.push('() => {');
      for (const id of nestedIds) {
        nestedLines.push(`      const ${id} = r.getElementById('${id}');`);
      }
      for (const binding of nestedBindings) {
        nestedLines.push(`      ${generateInitialValueCode(binding)};`);
      }
      const nestedSignalGroups = groupBindingsBySignal(nestedBindings);
      nestedLines.push('      return [');
      for (const [signalName, signalBindings] of nestedSignalGroups) {
        nestedLines.push(`        ${generateConsolidatedSubscription(signalName, signalBindings)},`);
      }
      for (const nestedCond of nestedConds) {
        const nestedCondEscaped = nestedCond.templateContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        let innerNestedCode = '() => []';
        if (nestedCond.nestedBindings.length > 0) {
          const innerBindingLines: string[] = [];
          const innerIds = [...new Set(nestedCond.nestedBindings.map((b) => b.id))];
          innerBindingLines.push('() => {');
          for (const id of innerIds) {
            innerBindingLines.push(`        const ${id} = r.getElementById('${id}');`);
          }
          for (const binding of nestedCond.nestedBindings) {
            innerBindingLines.push(`        ${generateInitialValueCode(binding)};`);
          }
          const innerGroups = groupBindingsBySignal(nestedCond.nestedBindings);
          innerBindingLines.push('        return [');
          for (const [signalName, signalBindings] of innerGroups) {
            innerBindingLines.push(`          ${generateConsolidatedSubscription(signalName, signalBindings)},`);
          }
          innerBindingLines.push('        ];');
          innerBindingLines.push('      }');
          innerNestedCode = innerBindingLines.join('\n');
        }

        const isNestedSimple = nestedCond.signalNames.length === 1 && nestedCond.jsExpression === `this.${nestedCond.signalName}()`;
        if (isNestedSimple) {
          nestedLines.push(`        ${BIND_FN.IF}(r, this.${nestedCond.signalName}, '${nestedCond.id}', \`${nestedCondEscaped}\`, ${innerNestedCode}),`);
        } else {
          const nestedSignalsArray = nestedCond.signalNames.map((s) => `this.${s}`).join(', ');
          nestedLines.push(
            `        ${BIND_FN.IF_EXPR}(r, [${nestedSignalsArray}], () => ${nestedCond.jsExpression}, '${nestedCond.id}', \`${nestedCondEscaped}\`, ${innerNestedCode}),`,
          );
        }
      }

      nestedLines.push('      ];');
      nestedLines.push('    }');
      nestedCode = nestedLines.join('\n');
    }
    const isSimpleExpr = cond.signalNames.length === 1 && cond.jsExpression === `this.${cond.signalName}()`;

    if (isSimpleExpr) {
      lines.push(`    ${BIND_FN.IF}(r, this.${cond.signalName}, '${cond.id}', \`${escapedTemplate}\`, ${nestedCode});`);
    } else {
      const signalsArray = cond.signalNames.map((s) => `this.${s}`).join(', ');
      lines.push(`    ${BIND_FN.IF_EXPR}(r, [${signalsArray}], () => ${cond.jsExpression}, '${cond.id}', \`${escapedTemplate}\`, ${nestedCode});`);
    }
  }
  for (const we of whenElseBlocks) {
    const thenTemplateWithId = injectIdIntoFirstElement(we.thenTemplate, we.thenId);
    const elseTemplateWithId = injectIdIntoFirstElement(we.elseTemplate, we.elseId);
    const escapedThenTemplate = thenTemplateWithId.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const escapedElseTemplate = elseTemplateWithId.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const generateNestedInitializer = (bindings: BindingInfo[], nestedConds: ConditionalBlock[], nestedWE: WhenElseBlock[]): string => {
      if (bindings.length === 0 && nestedConds.length === 0 && nestedWE.length === 0) {
        return '() => []';
      }

      const initLines: string[] = [];
      initLines.push('() => {');
      const ids = [...new Set(bindings.map((b) => b.id))];
      for (const id of ids) {
        initLines.push(`      const ${id} = r.getElementById('${id}');`);
      }
      for (const binding of bindings) {
        initLines.push(`      ${generateInitialValueCode(binding)};`);
      }

      initLines.push('      return [');
      const signalGroups = groupBindingsBySignal(bindings);
      for (const [signalName, signalBindings] of signalGroups) {
        initLines.push(`        ${generateConsolidatedSubscription(signalName, signalBindings)},`);
      }
      for (const cond of nestedConds) {
        const nestedEscapedTemplate = cond.templateContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        const nestedBindingsCode = generateNestedInitializer(cond.nestedBindings, [], []);
        const isSimple = cond.signalNames.length === 1 && cond.jsExpression === `this.${cond.signalName}()`;
        if (isSimple) {
          initLines.push(`        ${BIND_FN.IF}(r, this.${cond.signalName}, '${cond.id}', \`${nestedEscapedTemplate}\`, ${nestedBindingsCode}),`);
        } else {
          const signalsArray = cond.signalNames.map((s) => `this.${s}`).join(', ');
          initLines.push(`        ${BIND_FN.IF_EXPR}(r, [${signalsArray}], () => ${cond.jsExpression}, '${cond.id}', \`${nestedEscapedTemplate}\`, ${nestedBindingsCode}),`);
        }
      }
      for (const nestedWe of nestedWE) {
        const nestedThenWithId = injectIdIntoFirstElement(nestedWe.thenTemplate, nestedWe.thenId);
        const nestedElseWithId = injectIdIntoFirstElement(nestedWe.elseTemplate, nestedWe.elseId);
        const nestedThenTemplate = nestedThenWithId.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        const nestedElseTemplate = nestedElseWithId.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        const thenInitCode = generateNestedInitializer(
          nestedWe.thenBindings,
          nestedWe.nestedConditionals.filter((c) => nestedWe.thenBindings.some((b) => b.conditionalId === c.id) || true),
          nestedWe.nestedWhenElse,
        );
        const elseInitCode = generateNestedInitializer(nestedWe.elseBindings, [], []);
        const signalsArray = nestedWe.signalNames.map((s) => `this.${s}`).join(', ');
        initLines.push(`        ${BIND_FN.IF_EXPR}(r, [${signalsArray}], () => ${nestedWe.jsExpression}, '${nestedWe.thenId}', \`${nestedThenTemplate}\`, ${thenInitCode}),`);
        initLines.push(`        ${BIND_FN.IF_EXPR}(r, [${signalsArray}], () => !(${nestedWe.jsExpression}), '${nestedWe.elseId}', \`${nestedElseTemplate}\`, ${elseInitCode}),`);
      }

      initLines.push('      ];');
      initLines.push('    }');
      return initLines.join('\n');
    };
    const thenCode = generateNestedInitializer(we.thenBindings, we.nestedConditionals, we.nestedWhenElse);
    const elseCode = generateNestedInitializer(we.elseBindings, [], []);

    const signalsArray = we.signalNames.map((s) => `this.${s}`).join(', ');
    lines.push(`    ${BIND_FN.IF_EXPR}(r, [${signalsArray}], () => ${we.jsExpression}, '${we.thenId}', \`${escapedThenTemplate}\`, ${thenCode});`);
    lines.push(`    ${BIND_FN.IF_EXPR}(r, [${signalsArray}], () => !(${we.jsExpression}), '${we.elseId}', \`${escapedElseTemplate}\`, ${elseCode});`);
  }
  for (const rep of repeatBlocks) {
    const itemSignalVar = `${rep.itemVar}$`;
    const indexVar = rep.indexVar || '_idx';
    const hasItemBindings = rep.itemBindings.length > 0;
    const hasSignalBindings = rep.signalBindings.length > 0;
    const hasNestedRepeats = rep.nestedRepeats.length > 0;
    const hasNestedConditionals = rep.nestedConditionals.length > 0;
    const hasItemEvents = rep.itemEvents.length > 0;
    
    // Determine optimization skip reason (if any)
    let optimizationSkipReason: RepeatOptimizationSkipReason | null = null;
    
    // Check if we can use the optimized template-based approach:
    // - Only pure item bindings (no component signals mixed in)
    // - No nested repeats or conditionals
    // - No item-level event handlers
    // - No signal bindings inside items
    const hasMixedBindings = rep.itemBindings.some(b => b.expression.includes('this.'));
    
    if (!hasItemBindings) {
      optimizationSkipReason = 'no-bindings';
    } else if (hasSignalBindings) {
      optimizationSkipReason = 'signal-bindings';
    } else if (hasNestedRepeats) {
      optimizationSkipReason = 'nested-repeat';
    } else if (hasNestedConditionals) {
      optimizationSkipReason = 'nested-conditional';
    } else if (hasItemEvents) {
      optimizationSkipReason = 'item-events';
    } else if (hasMixedBindings) {
      optimizationSkipReason = 'mixed-bindings';
    }
    
    const canUseOptimized = optimizationSkipReason === null;
    
    if (canUseOptimized) {
      // Use optimized template-based approach
      const staticInfo = generateStaticRepeatTemplate(rep.itemTemplate, rep.itemBindings, rep.itemVar);
      
      if (staticInfo.canUseOptimized && staticInfo.elementBindings.length > 0) {
        // Generate static template identifier
        const templateId = `__tpl_${rep.id}`;
        
        // Generate static template IIFE
        const escapedStaticHtml = staticInfo.staticHtml
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r');
        
        // Add static template property to class (will be merged with static template)
        staticTemplates.push(`  static ${templateId} = (() => { const t = document.createElement('template'); t.innerHTML = \`${escapedStaticHtml}\`; return t; })();`);
        
        // Generate element bindings array
        const bindingsArrayStr = staticInfo.elementBindings.map(eb => 
          `{ path: [${eb.path.join(', ')}], id: '${eb.id}' }`
        ).join(', ');
        
        // Generate fill function that sets initial values
        const fillStatements: string[] = [];
        for (let i = 0; i < staticInfo.elementBindings.length; i++) {
          const eb = staticInfo.elementBindings[i]!;
          for (const binding of eb.bindings) {
            const expr = binding.expression.replace(new RegExp(`\\b${rep.itemVar}\\b`, 'g'), 'item');
            if (binding.type === 'text') {
              fillStatements.push(`els[${i}].textContent = ${expr}`);
            } else if (binding.type === 'attr' && binding.property) {
              fillStatements.push(`els[${i}].setAttribute('${binding.property}', ${expr})`);
            }
          }
        }
        const fillFn = `(els, item, ${indexVar}) => { ${fillStatements.join('; ')}; }`;
        
        // Generate init bindings function with subscriptions
        const updateStatements: string[] = [];
        for (let i = 0; i < staticInfo.elementBindings.length; i++) {
          const eb = staticInfo.elementBindings[i]!;
          for (const binding of eb.bindings) {
            const expr = binding.expression.replace(new RegExp(`\\b${rep.itemVar}\\b`, 'g'), 'v');
            if (binding.type === 'text') {
              updateStatements.push(`els[${i}].textContent = ${expr}`);
            } else if (binding.type === 'attr' && binding.property) {
              updateStatements.push(`els[${i}].setAttribute('${binding.property}', ${expr})`);
            }
          }
        }
        const initFn = `(els, ${itemSignalVar}, ${indexVar}) => [${itemSignalVar}.subscribe(v => { ${updateStatements.join('; ')} }, true)]`;
        
        // Build the optimized call
        let bindRepeatCall = `${BIND_FN.REPEAT_TPL}(r, this.${rep.signalName}, '${rep.id}', this.constructor.${templateId}, [${bindingsArrayStr}], ${fillFn}, ${initFn}`;
        
        if (rep.emptyTemplate) {
          const escapedEmptyTemplate = rep.emptyTemplate.replace(/`/g, '\\`');
          bindRepeatCall += `, \`${escapedEmptyTemplate}\``;
        } else if (rep.trackByFn) {
          bindRepeatCall += `, undefined`;
        }
        
        if (rep.trackByFn) {
          bindRepeatCall += `, ${rep.trackByFn}`;
        }
        
        bindRepeatCall += ')';
        lines.push(`    ${bindRepeatCall};`);
        continue; // Skip the fallback path
      } else if (staticInfo.skipReason) {
        // Log warning or error for template issues
        const fileName = filePath.split(/[/\\]/).pop() || filePath;
        if (staticInfo.skipReason === 'multi-root') {
          // Multi-root is a structural issue - emit error (build continues but user should fix)
          logger.error(NAME, `repeat() template in ${fileName} has multiple root elements. ` +
            `Wrap in a single container element for optimized rendering.`);
        } else {
          // Other skip reasons are warnings
          logger.warn(NAME, `repeat() in ${fileName}: ${getOptimizationSkipMessage(staticInfo.skipReason)}`);
        }
      }
    } else if (optimizationSkipReason && hasItemBindings) {
      // Log verbose info about why optimization was skipped (only if there were bindings to optimize)
      const fileName = filePath.split(/[/\\]/).pop() || filePath;
      logger.verbose(`[${NAME}] repeat() in ${fileName} using fallback: ${getOptimizationSkipMessage(optimizationSkipReason)}`);
    }
    
    // Fallback to string-based approach
    const escapedItemTemplate = rep.itemTemplate
      .replace(/\\/g, '\\\\') // Escape backslashes first
      .replace(/`/g, '\\`') // Escape backticks
      .replace(/\n/g, '\\n') // Escape newlines
      .replace(/\r/g, '\\r'); // Escape carriage returns
    const templateFn = `(${itemSignalVar}, ${indexVar}) => \`${escapedItemTemplate}\``;
    let initItemBindingsFn: string;

    if (!hasItemBindings && !hasSignalBindings && !hasNestedRepeats && !hasNestedConditionals) {
      initItemBindingsFn = `(els, ${itemSignalVar}, ${indexVar}) => []`;
    } else {
      const subscriptionLines: string[] = [];
      const nestedRepeatLines: string[] = [];
      const nestedConditionalLines: string[] = [];
      const findElCode = `const $ = (id) => ${BIND_FN.FIND_EL}(els, id);`;
      if (hasItemBindings) {
        const pureItemBindings: ItemBinding[] = [];
        const mixedBindings: { binding: ItemBinding; componentSignals: Set<string> }[] = [];

        for (const binding of rep.itemBindings) {
          const componentSignalRegex = /this\.(_\w+)\(\)/g;
          const componentSignals = new Set<string>();
          let signalMatch: RegExpExecArray | null;
          while ((signalMatch = componentSignalRegex.exec(binding.expression)) !== null) {
            componentSignals.add(signalMatch[1]!);
          }
          componentSignalRegex.lastIndex = 0;

          if (componentSignals.size === 0) {
            pureItemBindings.push(binding);
          } else {
            mixedBindings.push({ binding, componentSignals });
          }
        }
        if (pureItemBindings.length > 0) {
          const bindingsByElement = new Map<string, ItemBinding[]>();
          for (const binding of pureItemBindings) {
            if (!bindingsByElement.has(binding.elementId)) {
              bindingsByElement.set(binding.elementId, []);
            }
            bindingsByElement.get(binding.elementId)!.push(binding);
          }
          
          // Generate optimized code that caches element references
          const elementIds = Array.from(bindingsByElement.keys());
          const elementCacheDecls = elementIds.map((id, idx) => `_e${idx} = $('${id}')`).join(', ');
          const updateStatements: string[] = [];
          
          let elIdx = 0;
          for (const [elementId, bindings] of bindingsByElement) {
            const cachedVar = `_e${elIdx}`;
            for (const binding of bindings) {
              const signalExpr = binding.expression.replace(new RegExp(`\\b${rep.itemVar}\\b`, 'g'), `v`);
              if (binding.type === 'text') {
                updateStatements.push(`${cachedVar}.textContent = ${signalExpr}`);
              } else if (binding.type === 'attr' && binding.property) {
                updateStatements.push(`${cachedVar}.setAttribute('${binding.property}', ${signalExpr})`);
              } else if (binding.type === 'style' && binding.property) {
                updateStatements.push(`${cachedVar}.style.${binding.property} = ${signalExpr}`);
              }
            }
            elIdx++;
          }

          if (updateStatements.length > 0) {
            subscriptionLines.push(`((${elementCacheDecls}) => ${itemSignalVar}.subscribe(v => { ${updateStatements.join('; ')} }, true))()`);
          }
        }
        for (const { binding, componentSignals } of mixedBindings) {
          const signalExpr = binding.expression.replace(new RegExp(`\\b${rep.itemVar}\\b`, 'g'), `${itemSignalVar}()`);
          let updateStmt: string;
          if (binding.type === 'text') {
            updateStmt = `e = $('${binding.elementId}'); if (e) e.textContent = ${signalExpr};`;
          } else if (binding.type === 'attr' && binding.property) {
            updateStmt = `e = $('${binding.elementId}'); if (e) e.setAttribute('${binding.property}', ${signalExpr});`;
          } else if (binding.type === 'style' && binding.property) {
            updateStmt = `e = $('${binding.elementId}'); if (e) e.style.${binding.property} = ${signalExpr};`;
          } else {
            continue;
          }
          subscriptionLines.push(`${itemSignalVar}.subscribe(() => { let e; ${updateStmt} }, true)`);
          for (const componentSignal of componentSignals) {
            subscriptionLines.push(`this.${componentSignal}.subscribe(() => { let e; ${updateStmt} }, true)`);
          }
        }
      }
      if (hasSignalBindings) {
        const signalGroups = groupBindingsBySignal(rep.signalBindings);

        for (const [signalName, bindings] of signalGroups) {
          const updateStatements: string[] = [];

          for (const binding of bindings) {
            if (binding.type === 'text') {
              updateStatements.push(`e = $('${binding.id}'); if (e) e.textContent = v;`);
            } else if (binding.type === 'attr' && binding.property) {
              updateStatements.push(`e = $('${binding.id}'); if (e) e.setAttribute('${binding.property}', v);`);
            } else if (binding.type === 'style' && binding.property) {
              const prop = toCamelCase(binding.property);
              updateStatements.push(`e = $('${binding.id}'); if (e) e.style.${prop} = v;`);
            }
          }

          if (updateStatements.length > 0) {
            subscriptionLines.push(`this.${signalName}.subscribe(v => { let e; ${updateStatements.join(' ')} }, true)`);
          }
        }
      }
      if (hasNestedRepeats) {
        for (const nestedRep of rep.nestedRepeats) {
          const nestedEscapedTemplate = nestedRep.itemTemplate.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

          const nestedItemSignalVar = `${nestedRep.itemVar}$`;
          const nestedIndexVar = nestedRep.indexVar || '_idx2';
          const nestedTemplateFn = `(${nestedItemSignalVar}, ${nestedIndexVar}) => \`${nestedEscapedTemplate}\``;
          let nestedInitBindingsFn: string;
          const hasNestedItemBindings = nestedRep.itemBindings.length > 0;
          const hasNestedConditionalsInNested = nestedRep.nestedConditionals.length > 0;

          if (hasNestedItemBindings || hasNestedConditionalsInNested) {
            const nestedFindElCode = `const $n = (id) => ${BIND_FN.FIND_EL}(nel, id);`;
            const nestedUpdates: string[] = [];
            if (hasNestedItemBindings) {
              const pureNestedBindings: typeof nestedRep.itemBindings = [];
              const mixedNestedBindings: { binding: (typeof nestedRep.itemBindings)[0]; componentSignals: Set<string> }[] = [];

              for (const binding of nestedRep.itemBindings) {
                const componentSignalRegex = /this\.(_\w+)\(\)/g;
                const componentSignals = new Set<string>();
                let signalMatch: RegExpExecArray | null;
                while ((signalMatch = componentSignalRegex.exec(binding.expression)) !== null) {
                  componentSignals.add(signalMatch[1]!);
                }
                componentSignalRegex.lastIndex = 0;

                if (componentSignals.size === 0) {
                  pureNestedBindings.push(binding);
                } else {
                  mixedNestedBindings.push({ binding, componentSignals });
                }
              }
              if (pureNestedBindings.length > 0) {
                const updateStatements: string[] = [];
                for (const binding of pureNestedBindings) {
                  const signalExpr = binding.expression.replace(new RegExp(`\\b${nestedRep.itemVar}\\b`, 'g'), `v`);
                  if (binding.type === 'text') {
                    updateStatements.push(`e = $n('${binding.elementId}'); if (e) e.textContent = ${signalExpr};`);
                  } else if (binding.type === 'attr' && binding.property) {
                    updateStatements.push(`e = $n('${binding.elementId}'); if (e) e.setAttribute('${binding.property}', ${signalExpr});`);
                  }
                }
                if (updateStatements.length > 0) {
                  nestedUpdates.push(`${nestedItemSignalVar}.subscribe(v => { let e; ${updateStatements.join(' ')} }, true)`);
                }
              }
              for (const { binding, componentSignals } of mixedNestedBindings) {
                const signalExpr = binding.expression.replace(new RegExp(`\\b${nestedRep.itemVar}\\b`, 'g'), `${nestedItemSignalVar}()`);
                let updateStmt: string;
                if (binding.type === 'text') {
                  updateStmt = `e = $n('${binding.elementId}'); if (e) e.textContent = ${signalExpr};`;
                } else if (binding.type === 'attr' && binding.property) {
                  updateStmt = `e = $n('${binding.elementId}'); if (e) e.setAttribute('${binding.property}', ${signalExpr});`;
                } else {
                  continue;
                }

                nestedUpdates.push(`${nestedItemSignalVar}.subscribe(() => { let e; ${updateStmt} }, true)`);
                for (const componentSignal of componentSignals) {
                  nestedUpdates.push(`this.${componentSignal}.subscribe(() => { let e; ${updateStmt} }, true)`);
                }
              }
            }
            for (const nestedCond of nestedRep.nestedConditionals) {
              let condEscapedTemplate = nestedCond.templateContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
              const escapedSignalVar = nestedItemSignalVar.replace(/\$/g, '\\$');
              const itemSignalPattern = new RegExp(`\\$\\{${escapedSignalVar}\\(\\)\\}`, 'g');
              const placeholder = '___ITEM_SIGNAL_PLACEHOLDER___';
              condEscapedTemplate = condEscapedTemplate.replace(itemSignalPattern, placeholder);
              condEscapedTemplate = condEscapedTemplate.replace(/\$/g, '\\$');
              condEscapedTemplate = condEscapedTemplate.replace(new RegExp(placeholder, 'g'), `\${${nestedItemSignalVar}()}`);
              const condBindingUpdates: string[] = [];
              for (const binding of nestedCond.nestedBindings) {
                if (binding.type === 'text') {
                  condBindingUpdates.push(`this.${binding.signalName}.subscribe(v => { const el = $n('${binding.id}'); if (el) el.textContent = v; }, true)`);
                } else if (binding.type === 'attr' && binding.property) {
                  condBindingUpdates.push(
                    `this.${binding.signalName}.subscribe(v => { const el = $n('${binding.id}'); if (el) el.setAttribute('${binding.property}', v); }, true)`,
                  );
                } else if (binding.type === 'style' && binding.property) {
                  const prop = toCamelCase(binding.property);
                  condBindingUpdates.push(`this.${binding.signalName}.subscribe(v => { const el = $n('${binding.id}'); if (el) el.style.${prop} = v; }, true)`);
                }
              }
              for (const binding of nestedCond.nestedItemBindings) {
                const signalExpr = binding.expression.replace(new RegExp(`\\b${nestedRep.itemVar}\\b`, 'g'), `${nestedItemSignalVar}()`);

                if (binding.type === 'text') {
                  condBindingUpdates.push(`${nestedItemSignalVar}.subscribe(() => { const el = $n('${binding.elementId}'); if (el) el.textContent = ${signalExpr}; }, true)`);
                } else if (binding.type === 'attr' && binding.property) {
                  condBindingUpdates.push(
                    `${nestedItemSignalVar}.subscribe(() => { const el = $n('${binding.elementId}'); if (el) el.setAttribute('${binding.property}', ${signalExpr}); }, true)`,
                  );
                }
              }

              let condNestedCode = '() => []';
              if (condBindingUpdates.length > 0) {
                condNestedCode = `() => [${condBindingUpdates.join(', ')}]`;
              }
              const isSimple = nestedCond.signalNames.length === 1 && nestedCond.jsExpression === `this.${nestedCond.signalName}()`;

              if (isSimple) {
                nestedUpdates.push(`${BIND_FN.IF}({ getElementById: $n }, this.${nestedCond.signalName}, '${nestedCond.id}', \`${condEscapedTemplate}\`, ${condNestedCode})`);
              } else {
                const signalsArray = nestedCond.signalNames.map((s) => `this.${s}`).join(', ');
                nestedUpdates.push(
                  `${BIND_FN.IF_EXPR}({ getElementById: $n }, [${signalsArray}], () => ${nestedCond.jsExpression}, '${nestedCond.id}', \`${condEscapedTemplate}\`, ${condNestedCode})`,
                );
              }
            }
            nestedInitBindingsFn = `(nel, ${nestedItemSignalVar}, ${nestedIndexVar}) => { ${nestedFindElCode} return [${nestedUpdates.join(', ')}]; }`;
          } else {
            nestedInitBindingsFn = `(nel, ${nestedItemSignalVar}, ${nestedIndexVar}) => []`;
          }
          let nestedArrayExpr: string;
          const refsParentItem = new RegExp(`\\b${rep.itemVar}\\b`).test(nestedRep.itemsExpression);

          if (refsParentItem) {
            nestedArrayExpr = nestedRep.itemsExpression.replace(new RegExp(`\\b${rep.itemVar}\\b`, 'g'), `${itemSignalVar}()`);
          } else {
            nestedArrayExpr = nestedRep.itemsExpression;
          }

          nestedRepeatLines.push(`${BIND_FN.NESTED_REPEAT}(els, ${itemSignalVar}, () => ${nestedArrayExpr}, '${nestedRep.id}', ${nestedTemplateFn}, ${nestedInitBindingsFn})`);
        }
      }
      if (hasNestedConditionals) {
        for (const nestedCond of rep.nestedConditionals) {
          const condEscapedTemplate = nestedCond.templateContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
          let condNestedCode = '() => []';
          if (nestedCond.nestedBindings.length > 0) {
            const condBindingUpdates: string[] = [];
            for (const binding of nestedCond.nestedBindings) {
              if (binding.type === 'text') {
                condBindingUpdates.push(`this.${binding.signalName}.subscribe(v => { const el = $('${binding.id}'); if (el) el.textContent = v; }, true)`);
              } else if (binding.type === 'attr' && binding.property) {
                condBindingUpdates.push(`this.${binding.signalName}.subscribe(v => { const el = $('${binding.id}'); if (el) el.setAttribute('${binding.property}', v); }, true)`);
              } else if (binding.type === 'style' && binding.property) {
                const prop = toCamelCase(binding.property);
                condBindingUpdates.push(`this.${binding.signalName}.subscribe(v => { const el = $('${binding.id}'); if (el) el.style.${prop} = v; }, true)`);
              }
            }
            if (condBindingUpdates.length > 0) {
              condNestedCode = `() => [${condBindingUpdates.join(', ')}]`;
            }
          }
          const isSimple = nestedCond.signalNames.length === 1 && nestedCond.jsExpression === `this.${nestedCond.signalName}()`;

          if (isSimple) {
            nestedConditionalLines.push(`${BIND_FN.IF}({ getElementById: $ }, this.${nestedCond.signalName}, '${nestedCond.id}', \`${condEscapedTemplate}\`, ${condNestedCode})`);
          } else {
            const signalsArray = nestedCond.signalNames.map((s) => `this.${s}`).join(', ');
            nestedConditionalLines.push(
              `${BIND_FN.IF_EXPR}({ getElementById: $ }, [${signalsArray}], () => ${nestedCond.jsExpression}, '${nestedCond.id}', \`${condEscapedTemplate}\`, ${condNestedCode})`,
            );
          }
        }
      }
      const allCleanupLines = [...subscriptionLines, ...nestedRepeatLines, ...nestedConditionalLines];

      if (allCleanupLines.length > 0) {
        initItemBindingsFn = `(els, ${itemSignalVar}, ${indexVar}) => { ${findElCode} return [\n      ${allCleanupLines.join(',\n      ')}\n    ]; }`;
      } else {
        initItemBindingsFn = `(els, ${itemSignalVar}, ${indexVar}) => []`;
      }
    }
    let itemEventHandlersArg = '';
    if (rep.itemEvents.length > 0) {
      const eventsByType = new Map<string, ItemEventBinding[]>();
      for (const evt of rep.itemEvents) {
        if (!eventsByType.has(evt.eventName)) {
          eventsByType.set(evt.eventName, []);
        }
        eventsByType.get(evt.eventName)!.push(evt);
      }
      const eventTypeLines: string[] = [];
      for (const [eventType, handlers] of eventsByType) {
        const handlerLines = handlers.map((h) => {
          let handlerExpr = h.handlerExpression;
          handlerExpr = handlerExpr.replace(new RegExp(`\\b${rep.itemVar}\\b`, 'g'), `${itemSignalVar}()`);
          if (rep.indexVar) {
            handlerExpr = handlerExpr.replace(new RegExp(`\\b${rep.indexVar}\\b`, 'g'), indexVar);
          }
          const arrowMatch = handlerExpr.match(/^\s*\(?([^)]*)\)?\s*=>\s*(.+)$/);
          if (arrowMatch && arrowMatch[2]) {
            const body = arrowMatch[2].trim();
            if (!body.startsWith('{')) {
              handlerExpr = body;
            } else {
              handlerExpr = body.slice(1, -1).trim();
            }
          } else if (/^this\._?\w+$/.test(handlerExpr)) {
            handlerExpr = `${handlerExpr}(e)`;
          }

          return `'${h.eventId}': (${itemSignalVar}, ${indexVar}, e) => { ${handlerExpr}; }`;
        });
        eventTypeLines.push(`${eventType}: { ${handlerLines.join(', ')} }`);
      }

      itemEventHandlersArg = `, { ${eventTypeLines.join(', ')} }`;
    }
    let bindRepeatCall = `${BIND_FN.REPEAT}(r, this.${rep.signalName}, '${rep.id}', ${templateFn}, ${initItemBindingsFn}`;
    if (rep.emptyTemplate) {
      const escapedEmptyTemplate = rep.emptyTemplate.replace(/`/g, '\\`');
      bindRepeatCall += `, \`${escapedEmptyTemplate}\``;
    } else if (itemEventHandlersArg || rep.trackByFn) {
      bindRepeatCall += `, undefined`;
    }
    if (itemEventHandlersArg) {
      bindRepeatCall += itemEventHandlersArg;
    } else if (rep.trackByFn) {
      bindRepeatCall += `, undefined`;
    }
    if (rep.trackByFn) {
      bindRepeatCall += `, ${rep.trackByFn}`;
    }

    bindRepeatCall += ')';

    lines.push(`    ${bindRepeatCall};`);
  }
  if (eventBindings.length > 0) {
    const eventsByType = new Map<string, EventBinding[]>();
    for (const evt of eventBindings) {
      if (!eventsByType.has(evt.eventName)) {
        eventsByType.set(evt.eventName, []);
      }
      eventsByType.get(evt.eventName)!.push(evt);
    }
    const eventMapLines: string[] = [];
    for (const [eventType, handlers] of eventsByType) {
      const handlerEntries = handlers.map((h) => {
        let handlerCode = h.handlerExpression;
        if (/^this\.\w+$/.test(handlerCode)) {
          handlerCode = `(e) => ${handlerCode}.call(this, e)`;
        } else if (/^this\._?\w+$/.test(handlerCode)) {
          handlerCode = `(e) => ${handlerCode}.call(this, e)`;
        }
        return `'${h.id}': ${handlerCode}`;
      });
      eventMapLines.push(`      ${eventType}: { ${handlerEntries.join(', ')} }`);
    }

    lines.push(`    ${BIND_FN.EVENTS}(r, {`);
    lines.push(eventMapLines.join(',\n'));
    lines.push('    });');
  }

  lines.push('  };');

  return { code: '\n\n' + lines.join('\n'), staticTemplates };
};

const generateStaticTemplate = (content: string): string => {
  const escapedContent = content.replace(/`/g, '\\`');
  return `
  static template = (() => {
    const t = document.createElement('template');
    t.innerHTML = \`${escapedContent}\`;
    return t;
  })();`;
};

const generateUpdatedImport = (importInfo: ImportInfo, requiredBindFunctions: string[]): string => {
  const allImports = [...importInfo.namedImports, ...requiredBindFunctions];
  return `import { ${allImports.join(', ')} } from ${importInfo.quoteChar}${importInfo.moduleSpecifier}${importInfo.quoteChar}`;
};

export const transformComponentSource = (source: string, filePath: string): string | null => {
  const sourceFile = sourceCache.parse(filePath, source);
  const componentClass = findComponentClass(sourceFile);
  if (!componentClass) {
    return null;
  }

  const signalInitializers = findSignalInitializers(sourceFile);
  const servicesImport = findServicesImport(sourceFile);
  const htmlTemplates = findHtmlTemplates(sourceFile);

  const edits: Array<{ start: number; end: number; replacement: string }> = [];
  let allBindings: BindingInfo[] = [];
  let allConditionals: ConditionalBlock[] = [];
  let allWhenElseBlocks: WhenElseBlock[] = [];
  let allRepeatBlocks: RepeatBlock[] = [];
  let allEventBindings: EventBinding[] = [];
  let idCounter = 0;
  let lastProcessedTemplateContent = '';
  let hasConditionals = false;

  for (const templateInfo of htmlTemplates) {
    let templateContent = extractTemplateContent(templateInfo.node.template, sourceFile);

    const result = processHtmlTemplateWithConditionals(templateContent, signalInitializers, idCounter);
    templateContent = result.processedContent;
    allBindings = [...allBindings, ...result.bindings];
    allConditionals = [...allConditionals, ...result.conditionals];
    allWhenElseBlocks = [...allWhenElseBlocks, ...result.whenElseBlocks];
    allRepeatBlocks = [...allRepeatBlocks, ...result.repeatBlocks];
    allEventBindings = [...allEventBindings, ...result.eventBindings];
    idCounter = result.nextId;
    hasConditionals = hasConditionals || result.hasConditionals;

    lastProcessedTemplateContent = templateContent;

    edits.push({
      start: templateInfo.templateStart,
      end: templateInfo.templateEnd,
      replacement: '``',
    });
  }
  const visitCss = (node: ts.Node) => {
    if (ts.isTaggedTemplateExpression(node) && isCssTemplate(node)) {
      const cssContent = extractTemplateContent(node.template, sourceFile);
      edits.push({
        start: node.getStart(sourceFile),
        end: node.getEnd(),
        replacement: '`' + cssContent + '`',
      });
    }
    ts.forEachChild(node, visitCss);
  };
  visitCss(sourceFile);
  const { code: initBindingsFunction, staticTemplates: repeatStaticTemplates } = generateInitBindingsFunction(allBindings, allConditionals, allWhenElseBlocks, allRepeatBlocks, allEventBindings, filePath);

  let staticTemplateCode = '';
  if (lastProcessedTemplateContent) {
    staticTemplateCode = generateStaticTemplate(lastProcessedTemplateContent);
  }
  
  // Add any static templates for optimized repeat bindings
  if (repeatStaticTemplates.length > 0) {
    staticTemplateCode += '\n' + repeatStaticTemplates.join('\n');
  }
  
  let classBodyStart: number | null = null;
  const classStart = componentClass.getStart(sourceFile);
  const classText = componentClass.getText(sourceFile);
  const braceIndex = classText.indexOf('{');
  if (braceIndex !== -1) {
    classBodyStart = classStart + braceIndex + 1;
  }
  const hasAnyBindings = allBindings.length > 0 || allConditionals.length > 0 || allWhenElseBlocks.length > 0 || allRepeatBlocks.length > 0 || allEventBindings.length > 0;
  if (hasAnyBindings && servicesImport) {
    const requiredFunctions: string[] = [];
    if (allBindings.some((b) => b.type === 'style')) requiredFunctions.push(BIND_FN.STYLE);
    if (allBindings.some((b) => b.type === 'attr')) requiredFunctions.push(BIND_FN.ATTR);
    if (allBindings.some((b) => b.type === 'text')) requiredFunctions.push(BIND_FN.TEXT);
    const hasSimpleConditionals = allConditionals.some((c) => c.signalNames.length === 1 && c.jsExpression === `this.${c.signalName}()`);
    const hasComplexConditionals = allConditionals.some((c) => c.signalNames.length > 1 || c.jsExpression !== `this.${c.signalName}()`);

    if (hasSimpleConditionals) requiredFunctions.push(BIND_FN.IF);
    if (hasComplexConditionals || allWhenElseBlocks.length > 0) requiredFunctions.push(BIND_FN.IF_EXPR);
    if (allRepeatBlocks.length > 0) {
      // Check if any repeat uses optimized template-based approach
      const usesOptimized = repeatStaticTemplates.length > 0;
      if (usesOptimized) requiredFunctions.push(BIND_FN.REPEAT_TPL);
      // Still may need regular repeat for non-optimized cases
      const hasNonOptimized = allRepeatBlocks.some(rep => {
        const hasItemBindings = rep.itemBindings.length > 0;
        const hasSignalBindings = rep.signalBindings.length > 0;
        const hasNestedRepeats = rep.nestedRepeats.length > 0;
        const hasNestedConditionals = rep.nestedConditionals.length > 0;
        const hasItemEvents = rep.itemEvents.length > 0;
        const canUseOptimized = hasItemBindings && 
          !hasSignalBindings && 
          !hasNestedRepeats && 
          !hasNestedConditionals && 
          !hasItemEvents &&
          rep.itemBindings.every(b => !b.expression.includes('this.'));
        return !canUseOptimized;
      });
      if (hasNonOptimized) requiredFunctions.push(BIND_FN.REPEAT);
    }
    const hasNestedRepeats = allRepeatBlocks.some((rep) => rep.nestedRepeats.length > 0);
    if (hasNestedRepeats) requiredFunctions.push(BIND_FN.NESTED_REPEAT);
    // Only need __findEl for non-optimized repeat blocks or nested repeats
    const hasNonOptimizedWithBindings = allRepeatBlocks.some((rep) => {
      const hasItemBindings = rep.itemBindings.length > 0;
      const hasSignalBindings = rep.signalBindings.length > 0;
      const hasNestedRepeatSubs = rep.nestedRepeats.length > 0;
      const hasNestedConditionals = rep.nestedConditionals.length > 0;
      const hasItemEvents = rep.itemEvents.length > 0;
      const canUseOptimized = hasItemBindings && 
        !hasSignalBindings && 
        !hasNestedRepeatSubs && 
        !hasNestedConditionals && 
        !hasItemEvents &&
        rep.itemBindings.every(b => !b.expression.includes('this.'));
      // Need findEl if we have bindings but can't use optimized, or have nested repeats with bindings
      return (!canUseOptimized && hasItemBindings) || rep.nestedRepeats.some((nr) => nr.itemBindings.length > 0);
    });
    if (hasNonOptimizedWithBindings) requiredFunctions.push(BIND_FN.FIND_EL);
    if (allEventBindings.length > 0) requiredFunctions.push(BIND_FN.EVENTS);

    if (requiredFunctions.length > 0) {
      const newImport = generateUpdatedImport(servicesImport, requiredFunctions);
      edits.push({
        start: servicesImport.start,
        end: servicesImport.end,
        replacement: newImport,
      });
    }
  }

  let result = applyEdits(source, edits);

  if (classBodyStart !== null) {
    const injectedCode = staticTemplateCode + initBindingsFunction;
    result = result.replace(/class\s+extends\s+Component\s*\{/, (match) => {
      return match + injectedCode;
    });
  }

  return result;
};

export { transformComponentSource as transformReactiveBindings };

export const ReactiveBindingPlugin: Plugin = {
  name: NAME,
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      if (args.path.includes('scripts') || args.path.includes('node_modules')) {
        return undefined;
      }

      const source = await fs.promises.readFile(args.path, 'utf8');

      if (!extendsComponentQuick(source) || !hasHtmlTemplates(source)) {
        return undefined;
      }

      try {
        const transformed = transformComponentSource(source, args.path);

        if (transformed === null) {
          return undefined;
        }

        return createLoaderResult(transformed);
      } catch (error) {
        logger.error(NAME, `Error processing ${args.path}`, error);
        return undefined;
      }
    });
  },
};
