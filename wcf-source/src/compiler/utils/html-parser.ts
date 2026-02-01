type ParserState =
  | 'TEXT'
  | 'TAG_OPEN'
  | 'TAG_NAME'
  | 'TAG_SPACE'
  | 'ATTR_NAME'
  | 'ATTR_EQ'
  | 'ATTR_VALUE_Q'
  | 'ATTR_VALUE_UQ'
  | 'TAG_CLOSE'
  | 'SELF_CLOSE'
  | 'COMMENT';

export interface AttributeInfo {
  name: string;
  value: string;
  start: number;
  end: number;
  valueStart: number;
  valueEnd: number;
}

export interface HtmlElement {
  tagName: string;
  tagStart: number;
  tagNameEnd: number;
  openTagEnd: number;
  closeTagStart: number;
  closeTagEnd: number;
  attributes: Map<string, AttributeInfo>;
  children: HtmlElement[];
  parent: HtmlElement | null;
  isSelfClosing: boolean;
  isVoid: boolean;
  textContent: TextNode[];
  whenDirective?: string;
  whenDirectiveStart?: number;
  whenDirectiveEnd?: number;
}

export interface TextNode {
  content: string;
  start: number;
  end: number;
}

export interface BindingInfo {
  element: HtmlElement;
  type: 'text' | 'style' | 'attr' | 'when' | 'whenElse' | 'repeat' | 'event';
  signalName: string;
  signalNames?: string[];
  property?: string;
  expressionStart: number;
  expressionEnd: number;
  fullExpression: string;
  jsExpression?: string;
  thenTemplate?: string;
  elseTemplate?: string;
  itemsExpression?: string;
  itemVar?: string;
  indexVar?: string;
  itemTemplate?: string;
  emptyTemplate?: string;
  trackByFn?: string;
  eventName?: string;
  eventModifiers?: string[];
  handlerExpression?: string;
}

export interface ParsedTemplate {
  roots: HtmlElement[];
  bindings: BindingInfo[];
  html: string;
}

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

export function parseHtmlTemplate(html: string): ParsedTemplate {
  const roots: HtmlElement[] = [];
  const bindings: BindingInfo[] = [];

  let state: ParserState = 'TEXT';
  let pos = 0;

  let currentElement: HtmlElement | null = null;
  let elementStack: HtmlElement[] = [];

  let tagName = '';
  let tagStart = 0;
  let attrName = '';
  let attrValue = '';
  let attrStart = 0;
  let attrValueStart = 0;
  let quoteChar = '';

  let textStart = 0;
  let textContent = '';

  let commentBuffer = '';

  let exprBraceDepth = 0;
  let inTemplateBacktick = false;
  let templateBraceDepth = 0;

  const flushText = () => {
    if (textContent.trim()) {
      const parent = elementStack[elementStack.length - 1];
      if (parent) {
        parent.textContent.push({
          content: textContent,
          start: textStart,
          end: pos,
        });
        findBindingsInText(textContent, textStart, parent, bindings);
      } else {
        const virtualRoot: HtmlElement = {
          tagName: '__root__',
          tagStart: 0,
          tagNameEnd: 0,
          openTagEnd: 0,
          closeTagStart: 0,
          closeTagEnd: 0,
          attributes: new Map(),
          children: [],
          parent: null,
          isSelfClosing: false,
          isVoid: false,
          textContent: [],
        };
        findBindingsInText(textContent, textStart, virtualRoot, bindings);
      }
    }
    textContent = '';
  };

  const pushElement = (element: HtmlElement) => {
    const parent = elementStack[elementStack.length - 1];
    if (parent) {
      parent.children.push(element);
      element.parent = parent;
    } else {
      roots.push(element);
    }
    if (!element.isSelfClosing && !element.isVoid) {
      elementStack.push(element);
    }
  };

  const closeElement = (closingTagName: string, closeStart: number, closeEnd: number) => {
    for (let i = elementStack.length - 1; i >= 0; i--) {
      const stackElement = elementStack[i];
      if (stackElement && stackElement.tagName.toLowerCase() === closingTagName.toLowerCase()) {
        stackElement.closeTagStart = closeStart;
        stackElement.closeTagEnd = closeEnd;
        elementStack.length = i;
        return;
      }
    }
  };

  while (pos < html.length) {
    const char = html[pos]!;
    const nextChar = html[pos + 1];

    switch (state) {
      case 'TEXT':
        if (char === '$' && nextChar === '{' && !inTemplateBacktick) {
          if (textContent === '') {
            textStart = pos;
          }
          textContent += '${';
          pos += 2;
          exprBraceDepth = 1;
          continue;
        }

        if (exprBraceDepth > 0) {
          if (textContent === '') {
            textStart = pos;
          }

          if (inTemplateBacktick) {
            if (char === '$' && nextChar === '{') {
              templateBraceDepth++;
              textContent += '${';
              pos += 2;
              continue;
            }
            if (char === '}' && templateBraceDepth > 0) {
              templateBraceDepth--;
              textContent += char;
              pos++;
              continue;
            }
            if (char === '`' && templateBraceDepth === 0) {
              inTemplateBacktick = false;
              textContent += char;
              pos++;
              continue;
            }
            textContent += char;
            pos++;
            continue;
          }

          if (char === '`') {
            inTemplateBacktick = true;
            templateBraceDepth = 0;
            textContent += char;
            pos++;
            continue;
          }
          if (char === '{') {
            exprBraceDepth++;
            textContent += char;
            pos++;
            continue;
          }
          if (char === '}') {
            exprBraceDepth--;
            textContent += char;
            pos++;
            if (exprBraceDepth === 0) {
            }
            continue;
          }
          textContent += char;
          pos++;
          continue;
        }

        if (char === '<') {
          flushText();
          if (nextChar === '!') {
            if (html.substring(pos, pos + 4) === '<!--') {
              state = 'COMMENT';
              commentBuffer = '';
              pos += 4;
              continue;
            }
          }
          tagStart = pos;
          state = 'TAG_OPEN';
        } else {
          if (textContent === '') {
            textStart = pos;
          }
          textContent += char;
        }
        break;

      case 'TAG_OPEN':
        if (char === '/') {
          state = 'TAG_CLOSE';
          tagName = '';
        } else if (/[a-zA-Z]/.test(char)) {
          state = 'TAG_NAME';
          tagName = char;
        } else {
          state = 'TEXT';
          textContent += '<' + char;
        }
        break;

      case 'TAG_NAME':
        if (/[\w\-:]/.test(char)) {
          tagName += char;
        } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
          state = 'TAG_SPACE';
          currentElement = createEmptyElement(tagName, tagStart, pos);
        } else if (char === '>') {
          currentElement = createEmptyElement(tagName, tagStart, pos);
          currentElement.openTagEnd = pos + 1;
          if (currentElement.isVoid) {
            currentElement.closeTagStart = pos + 1;
            currentElement.closeTagEnd = pos + 1;
          }
          pushElement(currentElement);
          findBindingsInAttributes(currentElement, bindings);
          currentElement = null;
          state = 'TEXT';
          textContent = '';
          textStart = pos + 1;
        } else if (char === '/' && nextChar === '>') {
          currentElement = createEmptyElement(tagName, tagStart, pos);
          currentElement.isSelfClosing = true;
          currentElement.openTagEnd = pos + 2;
          currentElement.closeTagStart = pos + 2;
          currentElement.closeTagEnd = pos + 2;
          pushElement(currentElement);
          findBindingsInAttributes(currentElement, bindings);
          currentElement = null;
          state = 'TEXT';
          pos++;
          textContent = '';
          textStart = pos + 1;
        }
        break;

      case 'TAG_SPACE':
        if (char === '>') {
          currentElement!.openTagEnd = pos + 1;
          if (currentElement!.isVoid) {
            currentElement!.closeTagStart = pos + 1;
            currentElement!.closeTagEnd = pos + 1;
          }
          pushElement(currentElement!);
          findBindingsInAttributes(currentElement!, bindings);
          currentElement = null;
          state = 'TEXT';
          textContent = '';
          textStart = pos + 1;
        } else if (char === '/' && nextChar === '>') {
          currentElement!.isSelfClosing = true;
          currentElement!.openTagEnd = pos + 2;
          currentElement!.closeTagStart = pos + 2;
          currentElement!.closeTagEnd = pos + 2;
          pushElement(currentElement!);
          findBindingsInAttributes(currentElement!, bindings);
          currentElement = null;
          state = 'TEXT';
          pos++;
          textContent = '';
          textStart = pos + 1;
        } else if (char === '"' && html.substring(pos, pos + 8) === '"${when(') {
          const directiveStart = pos;
          let braceDepth = 0;
          let parenDepth = 0;
          let i = pos + 2;
          while (i < html.length) {
            if (html[i] === '{') braceDepth++;
            else if (html[i] === '}') {
              braceDepth--;
              if (braceDepth === 0 && html[i + 1] === '"') {
                const directiveEnd = i + 2;
                const directive = html.substring(directiveStart, directiveEnd);
                currentElement!.whenDirective = directive;
                currentElement!.whenDirectiveStart = directiveStart;
                currentElement!.whenDirectiveEnd = directiveEnd;
                pos = directiveEnd - 1;
                break;
              }
            } else if (html[i] === '(') parenDepth++;
            else if (html[i] === ')') parenDepth--;
            i++;
          }
          state = 'TAG_SPACE';
        } else if (/[a-zA-Z_:@]/.test(char)) {
          state = 'ATTR_NAME';
          attrName = char;
          attrStart = pos;
        }
        break;

      case 'ATTR_NAME':
        if (/[\w\-:@.]/.test(char)) {
          attrName += char;
        } else if (char === '=') {
          state = 'ATTR_EQ';
        } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
          let lookAhead = pos + 1;
          while (lookAhead < html.length && /\s/.test(html[lookAhead]!)) {
            lookAhead++;
          }
          if (lookAhead < html.length && html[lookAhead] === '=') {
            pos = lookAhead - 1;
            state = 'ATTR_NAME';
          } else {
            currentElement!.attributes.set(attrName, {
              name: attrName,
              value: '',
              start: attrStart,
              end: pos,
              valueStart: pos,
              valueEnd: pos,
            });
            state = 'TAG_SPACE';
          }
        } else if (char === '>') {
          currentElement!.attributes.set(attrName, {
            name: attrName,
            value: '',
            start: attrStart,
            end: pos,
            valueStart: pos,
            valueEnd: pos,
          });
          currentElement!.openTagEnd = pos + 1;
          if (currentElement!.isVoid) {
            currentElement!.closeTagStart = pos + 1;
            currentElement!.closeTagEnd = pos + 1;
          }
          pushElement(currentElement!);
          findBindingsInAttributes(currentElement!, bindings);
          currentElement = null;
          state = 'TEXT';
          textContent = '';
          textStart = pos + 1;
        }
        break;

      case 'ATTR_EQ':
        if (char === '"' || char === "'") {
          quoteChar = char;
          attrValue = '';
          attrValueStart = pos + 1;
          state = 'ATTR_VALUE_Q';
        } else if (char === '$' && nextChar === '{') {
          attrValueStart = pos;
          let braceDepth = 0;
          let i = pos;
          while (i < html.length) {
            if (html[i] === '$' && html[i + 1] === '{') {
              braceDepth++;
              i += 2;
              continue;
            }
            if (html[i] === '{') {
              braceDepth++;
            } else if (html[i] === '}') {
              braceDepth--;
              if (braceDepth === 0) {
                attrValue = html.substring(attrValueStart, i + 1);
                currentElement!.attributes.set(attrName, {
                  name: attrName,
                  value: attrValue,
                  start: attrStart,
                  end: i + 1,
                  valueStart: attrValueStart,
                  valueEnd: i + 1,
                });
                pos = i;
                state = 'TAG_SPACE';
                break;
              }
            }
            i++;
          }
        } else if (char !== ' ' && char !== '\t' && char !== '\n' && char !== '\r') {
          attrValue = char;
          attrValueStart = pos;
          state = 'ATTR_VALUE_UQ';
        }
        break;

      case 'ATTR_VALUE_Q':
        if (char === quoteChar) {
          currentElement!.attributes.set(attrName, {
            name: attrName,
            value: attrValue,
            start: attrStart,
            end: pos + 1,
            valueStart: attrValueStart,
            valueEnd: pos,
          });
          state = 'TAG_SPACE';
        } else {
          attrValue += char;
        }
        break;

      case 'ATTR_VALUE_UQ':
        if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
          currentElement!.attributes.set(attrName, {
            name: attrName,
            value: attrValue,
            start: attrStart,
            end: pos,
            valueStart: attrValueStart,
            valueEnd: pos,
          });
          state = 'TAG_SPACE';
        } else if (char === '>') {
          currentElement!.attributes.set(attrName, {
            name: attrName,
            value: attrValue,
            start: attrStart,
            end: pos,
            valueStart: attrValueStart,
            valueEnd: pos,
          });
          currentElement!.openTagEnd = pos + 1;
          if (currentElement!.isVoid) {
            currentElement!.closeTagStart = pos + 1;
            currentElement!.closeTagEnd = pos + 1;
          }
          pushElement(currentElement!);
          findBindingsInAttributes(currentElement!, bindings);
          currentElement = null;
          state = 'TEXT';
          textContent = '';
          textStart = pos + 1;
        } else {
          attrValue += char;
        }
        break;

      case 'TAG_CLOSE':
        if (/[\w-]/.test(char)) {
          tagName += char;
        } else if (char === '>') {
          flushText();
          closeElement(tagName, tagStart, pos + 1);
          state = 'TEXT';
          textContent = '';
          textStart = pos + 1;
        } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        }
        break;

      case 'COMMENT':
        commentBuffer += char;
        if (commentBuffer.endsWith('-->')) {
          state = 'TEXT';
          textContent = '';
          textStart = pos + 1;
        }
        break;
    }

    pos++;
  }

  flushText();

  return { roots, bindings, html };
}

function createEmptyElement(tagName: string, tagStart: number, tagNameEnd: number): HtmlElement {
  return {
    tagName,
    tagStart,
    tagNameEnd: tagNameEnd,
    openTagEnd: 0,
    closeTagStart: 0,
    closeTagEnd: 0,
    attributes: new Map(),
    children: [],
    parent: null,
    isSelfClosing: false,
    isVoid: VOID_ELEMENTS.has(tagName.toLowerCase()),
    textContent: [],
    whenDirective: undefined,
    whenDirectiveStart: undefined,
    whenDirectiveEnd: undefined,
  };
}

function findBindingsInText(text: string, textStart: number, parent: HtmlElement | null, bindings: BindingInfo[]): void {
  if (!parent) return;

  const complexExprPositions: Array<{ start: number; end: number }> = [];

  const whenElseRegex = /\$\{whenElse\(/g;
  let whenElseMatch: RegExpExecArray | null;

  while ((whenElseMatch = whenElseRegex.exec(text)) !== null) {
    const startPos = whenElseMatch.index;
    const parsed = parseWhenElseExpression(text, startPos);
    if (parsed) {
      complexExprPositions.push({ start: startPos, end: parsed.end });

      bindings.push({
        element: parent,
        type: 'whenElse',
        signalName: parsed.signals[0] || '',
        signalNames: parsed.signals,
        expressionStart: textStart + startPos,
        expressionEnd: textStart + parsed.end,
        fullExpression: text.substring(startPos, parsed.end),
        jsExpression: parsed.condition,
        thenTemplate: parsed.thenTemplate,
        elseTemplate: parsed.elseTemplate,
      });
    }
  }

  const repeatRegex = /\$\{repeat\(/g;
  let repeatMatch: RegExpExecArray | null;

  while ((repeatMatch = repeatRegex.exec(text)) !== null) {
    const startPos = repeatMatch.index;
    const parsed = parseRepeatExpression(text, startPos);
    if (parsed) {
      complexExprPositions.push({ start: startPos, end: parsed.end });

      bindings.push({
        element: parent,
        type: 'repeat',
        signalName: parsed.signals[0] || '',
        signalNames: parsed.signals,
        expressionStart: textStart + startPos,
        expressionEnd: textStart + parsed.end,
        fullExpression: text.substring(startPos, parsed.end),
        itemsExpression: parsed.itemsExpression,
        itemVar: parsed.itemVar,
        indexVar: parsed.indexVar,
        itemTemplate: parsed.itemTemplate,
        emptyTemplate: parsed.emptyTemplate,
        trackByFn: parsed.trackByFn,
      });
    }
  }

  const exprRegex = /\$\{this\.(\w+)\(\)\}/g;
  let match: RegExpExecArray | null;

  while ((match = exprRegex.exec(text)) !== null) {
    const pos = match.index;
    const insideComplex = complexExprPositions.some((cp) => pos >= cp.start && pos < cp.end);
    if (insideComplex) continue;

    const signalName = match[1];
    if (!signalName) continue;

    bindings.push({
      element: parent,
      type: 'text',
      signalName,
      expressionStart: textStart + match.index,
      expressionEnd: textStart + match.index + match[0].length,
      fullExpression: match[0],
    });
  }
}

function parseWhenElseExpression(
  text: string,
  startPos: number,
): {
  end: number;
  condition: string;
  thenTemplate: string;
  elseTemplate: string;
  signals: string[];
} | null {
  let pos = startPos + '${whenElse('.length;
  let parenDepth = 1;

  const args: string[] = [];
  let currentArg = '';
  let inBacktick = false;
  let templateBraceDepth = 0;

  while (pos < text.length) {
    const char = text[pos];

    if (char === '`' && !inBacktick) {
      inBacktick = true;
      templateBraceDepth = 0;
      currentArg += char;
      pos++;
      continue;
    }

    if (char === '`' && inBacktick && templateBraceDepth === 0) {
      inBacktick = false;
      currentArg += char;
      pos++;
      continue;
    }

    if (inBacktick && char === '$' && text[pos + 1] === '{') {
      templateBraceDepth++;
      currentArg += '${';
      pos += 2;
      continue;
    }

    if (inBacktick && char === '}' && templateBraceDepth > 0) {
      templateBraceDepth--;
      currentArg += char;
      pos++;
      continue;
    }

    if (inBacktick) {
      currentArg += char;
      pos++;
      continue;
    }

    if (char === '(') {
      parenDepth++;
      currentArg += char;
    } else if (char === ')') {
      parenDepth--;
      if (parenDepth === 0) {
        args.push(currentArg.trim());
        pos++;
        if (text[pos] === '}') {
          pos++;
        }
        break;
      }
      currentArg += char;
    } else if (char === ',' && parenDepth === 1) {
      args.push(currentArg.trim());
      currentArg = '';
    } else {
      currentArg += char;
    }

    pos++;
  }

  if (args.length !== 3) {
    return null;
  }

  const condition = args[0];
  const arg1 = args[1];
  const arg2 = args[2];
  if (!condition || !arg1 || !arg2) return null;

  const thenTemplate = extractHtmlTemplateContent(arg1);
  const elseTemplate = extractHtmlTemplateContent(arg2);

  const signalRegex = /this\.(\w+)\(\)/g;
  const signals: string[] = [];
  let signalMatch: RegExpExecArray | null;
  while ((signalMatch = signalRegex.exec(condition)) !== null) {
    const signalName = signalMatch[1];
    if (signalName && !signals.includes(signalName)) {
      signals.push(signalName);
    }
  }

  return {
    end: pos,
    condition,
    thenTemplate,
    elseTemplate,
    signals,
  };
}

function parseRepeatExpression(
  text: string,
  startPos: number,
): {
  end: number;
  itemsExpression: string;
  itemVar: string;
  indexVar?: string;
  itemTemplate: string;
  emptyTemplate?: string;
  trackByFn?: string;
  signals: string[];
} | null {
  let pos = startPos + '${repeat('.length;
  let parenDepth = 1;

  const args: string[] = [];
  let currentArg = '';
  let inBacktick = false;
  let templateBraceDepth = 0;

  while (pos < text.length) {
    const char = text[pos];

    if (char === '`' && !inBacktick) {
      inBacktick = true;
      templateBraceDepth = 0;
      currentArg += char;
      pos++;
      continue;
    }

    if (char === '`' && inBacktick && templateBraceDepth === 0) {
      inBacktick = false;
      currentArg += char;
      pos++;
      continue;
    }

    if (inBacktick && char === '$' && text[pos + 1] === '{') {
      templateBraceDepth++;
      currentArg += '${';
      pos += 2;
      continue;
    }

    if (inBacktick && char === '}' && templateBraceDepth > 0) {
      templateBraceDepth--;
      currentArg += char;
      pos++;
      continue;
    }

    if (inBacktick) {
      currentArg += char;
      pos++;
      continue;
    }

    if (char === '(') {
      parenDepth++;
      currentArg += char;
    } else if (char === ')') {
      parenDepth--;
      if (parenDepth === 0) {
        args.push(currentArg.trim());
        pos++;
        if (text[pos] === '}') {
          pos++;
        }
        break;
      }
      currentArg += char;
    } else if (char === ',' && parenDepth === 1) {
      args.push(currentArg.trim());
      currentArg = '';
    } else {
      currentArg += char;
    }

    pos++;
  }

  const filteredArgs = args.filter(a => a.trim() !== '');

  if (filteredArgs.length < 2 || filteredArgs.length > 4) {
    return null;
  }

  const itemsExpression = filteredArgs[0];
  const templateFn = filteredArgs[1];
  if (!itemsExpression || !templateFn) {
    return null;
  }

  const arrowMatch = templateFn.match(/^\(([^)]*)\)\s*=>\s*(.*)$/s);
  if (!arrowMatch) {
    return null;
  }

  const arrowParams = arrowMatch[1];
  const arrowBody = arrowMatch[2];
  if (!arrowParams || !arrowBody) return null;

  const params = arrowParams.split(',').map((p) => p.trim());
  const itemVar = params[0];
  if (!itemVar) return null;
  const indexVar = params[1];

  const templateBody = arrowBody.trim();
  const itemTemplate = extractHtmlTemplateContent(templateBody);

  let emptyTemplate: string | undefined;
  const arg2 = filteredArgs[2];
  if (filteredArgs.length >= 3 && arg2 && arg2.trim() !== 'null' && arg2.trim() !== 'undefined') {
    emptyTemplate = extractHtmlTemplateContent(arg2.trim());
  }

  let trackByFn: string | undefined;
  const arg3 = filteredArgs[3];
  if (filteredArgs.length === 4 && arg3) {
    const trimmed = arg3.trim();
    // Validate trackBy function pattern - must be arrow function returning property access
    // Valid: (item) => item.id, (item, idx) => item.key, item => item.id
    const arrowPattern = /^\(?[\w,\s]+\)?\s*=>\s*[\w.[\]]+$/;
    if (!arrowPattern.test(trimmed)) {
      console.warn(`[wcf] trackBy function should be an arrow function returning a key property, e.g., (item) => item.id`);
    }
    trackByFn = trimmed;
  }

  const signalRegex = /this\.(\w+)\(\)/g;
  const signals: string[] = [];
  let signalMatch: RegExpExecArray | null;
  while ((signalMatch = signalRegex.exec(itemsExpression)) !== null) {
    const signalName = signalMatch[1];
    if (signalName && !signals.includes(signalName)) {
      signals.push(signalName);
    }
  }

  return {
    end: pos,
    itemsExpression,
    itemVar,
    indexVar,
    itemTemplate,
    emptyTemplate,
    trackByFn,
    signals,
  };
}

function extractHtmlTemplateContent(arg: string): string {
  const htmlMatch = arg.match(/^html`([\s\S]*)`$/);
  if (htmlMatch && htmlMatch[1] !== undefined) {
    return htmlMatch[1];
  }
  
  const plainMatch = arg.match(/^`([\s\S]*)`$/);
  if (plainMatch && plainMatch[1] !== undefined) {
    return plainMatch[1];
  }
  
  return arg;
}

function findBindingsInAttributes(element: HtmlElement, bindings: BindingInfo[]): void {
  if (element.whenDirective) {
    const whenMatch = element.whenDirective.match(/^"\$\{when\((.+)\)\}"$/);
    if (whenMatch) {
      const innerExpr = whenMatch[1];
      if (!innerExpr) return;
      const signalRegex = /this\.(\w+)\(\)/g;
      const signals: string[] = [];
      let signalMatch: RegExpExecArray | null;
      while ((signalMatch = signalRegex.exec(innerExpr)) !== null) {
        const signalName = signalMatch[1];
        if (signalName && !signals.includes(signalName)) {
          signals.push(signalName);
        }
      }

      const primarySignal = signals[0];
      if (signals.length > 0 && primarySignal) {
        bindings.push({
          element,
          type: 'when',
          signalName: primarySignal,
          signalNames: signals,
          expressionStart: element.whenDirectiveStart!,
          expressionEnd: element.whenDirectiveEnd!,
          fullExpression: element.whenDirective,
          jsExpression: innerExpr,
        });
      }
    }
  }

  for (const [name, attr] of element.attributes) {
    if (name.startsWith('@')) {
      const eventParts = name.slice(1).split('.');
      const eventName = eventParts[0];
      const modifiers = eventParts.slice(1);

      const eventExprMatch = attr.value.match(/^\$\{(.+)\}$/s);
      if (eventExprMatch && eventExprMatch[1]) {
        const handlerExpression = eventExprMatch[1].trim();
        bindings.push({
          element,
          type: 'event',
          signalName: '',
          eventName,
          eventModifiers: modifiers,
          handlerExpression,
          expressionStart: attr.start,
          expressionEnd: attr.end,
          fullExpression: `@${name.slice(1)}="${attr.value}"`,
        });
      }
      continue;
    }

    if (name === 'style') {
      const styleExprRegex = /([\w-]+)\s*:\s*(\$\{this\.(\w+)\(\)\})/g;
      let styleMatch: RegExpExecArray | null;

      while ((styleMatch = styleExprRegex.exec(attr.value)) !== null) {
        const fullExpr = styleMatch[2];
        const signalName = styleMatch[3];
        const propertyName = styleMatch[1];
        if (!fullExpr || !signalName || !propertyName) continue;

        const exprStartInValue = styleMatch.index + styleMatch[0].indexOf(fullExpr);
        bindings.push({
          element,
          type: 'style',
          signalName,
          property: propertyName,
          expressionStart: attr.valueStart + exprStartInValue,
          expressionEnd: attr.valueStart + exprStartInValue + fullExpr.length,
          fullExpression: fullExpr,
        });
      }
      continue;
    }

    const attrExprRegex = /\$\{this\.(\w+)\(\)\}/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrExprRegex.exec(attr.value)) !== null) {
      const signalName = attrMatch[1];
      if (!signalName) continue;
      bindings.push({
        element,
        type: 'attr',
        signalName,
        property: name,
        expressionStart: attr.valueStart + attrMatch.index,
        expressionEnd: attr.valueStart + attrMatch.index + attrMatch[0].length,
        fullExpression: attrMatch[0],
      });
    }
  }
}

export function walkElements(roots: HtmlElement[], callback: (element: HtmlElement, depth: number) => void): void {
  const walk = (elements: HtmlElement[], depth: number) => {
    for (const el of elements) {
      callback(el, depth);
      walk(el.children, depth + 1);
    }
  };
  walk(roots, 0);
}

export function findElements(roots: HtmlElement[], predicate: (el: HtmlElement) => boolean): HtmlElement[] {
  const results: HtmlElement[] = [];
  walkElements(roots, (el) => {
    if (predicate(el)) {
      results.push(el);
    }
  });
  return results;
}

export function findElementsWithAttribute(roots: HtmlElement[], attrName: string): HtmlElement[] {
  return findElements(roots, (el) => el.attributes.has(attrName));
}

export function findElementsWithWhenDirective(roots: HtmlElement[]): HtmlElement[] {
  return findElements(roots, (el) => el.whenDirective !== undefined);
}

export function getElementHtml(element: HtmlElement, html: string): string {
  return html.substring(element.tagStart, element.closeTagEnd);
}

export function getElementInnerHtml(element: HtmlElement, html: string): string {
  if (element.isSelfClosing || element.isVoid) {
    return '';
  }
  return html.substring(element.openTagEnd, element.closeTagStart);
}

export function getBindingsForElement(element: HtmlElement, bindings: BindingInfo[]): BindingInfo[] {
  const elementIds = new Set<HtmlElement>();

  const collectElements = (el: HtmlElement) => {
    elementIds.add(el);
    for (const child of el.children) {
      collectElements(child);
    }
  };
  collectElements(element);

  return bindings.filter((b) => elementIds.has(b.element));
}

export function isElementInside(element: HtmlElement, container: HtmlElement): boolean {
  let current = element.parent;
  while (current) {
    if (current === container) return true;
    current = current.parent;
  }
  return false;
}

export interface HtmlEdit {
  start: number;
  end: number;
  replacement: string;
}

export function applyHtmlEdits(html: string, edits: HtmlEdit[]): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let result = html;
  for (const edit of sorted) {
    result = result.substring(0, edit.start) + edit.replacement + result.substring(edit.end);
  }
  return result;
}

export function createIdInjectionEdit(element: HtmlElement, id: string): HtmlEdit | null {
  if (element.attributes.has('id')) {
    return null;
  }
  return {
    start: element.tagNameEnd,
    end: element.tagNameEnd,
    replacement: ` id="${id}"`,
  };
}

export function createDataAttrEdit(element: HtmlElement, attrName: string, attrValue: string): HtmlEdit {
  return {
    start: element.tagNameEnd,
    end: element.tagNameEnd,
    replacement: ` ${attrName}="${attrValue}"`,
  };
}

export function createWhenDirectiveRemovalEdit(element: HtmlElement): HtmlEdit | null {
  if (!element.whenDirective || element.whenDirectiveStart === undefined || element.whenDirectiveEnd === undefined) {
    return null;
  }
  return {
    start: element.whenDirectiveStart,
    end: element.whenDirectiveEnd,
    replacement: '',
  };
}

export function createEventBindingRemovalEdit(binding: BindingInfo): HtmlEdit | null {
  if (binding.type !== 'event') {
    return null;
  }
  return {
    start: binding.expressionStart,
    end: binding.expressionEnd,
    replacement: '',
  };
}

export function createSignalReplacementEdits(
  html: string,
  signalValues: Map<string, string | number | boolean>,
  excludeRanges: Array<{ start: number; end: number }> = [],
): HtmlEdit[] {
  const edits: HtmlEdit[] = [];
  const exprRegex = /\$\{this\.(\w+)\(\)\}/g;
  let match: RegExpExecArray | null;

  while ((match = exprRegex.exec(html)) !== null) {
    const exprStart = match.index;
    const exprEnd = exprStart + match[0].length;

    const insideExcluded = excludeRanges.some((r) => exprStart >= r.start && exprStart < r.end);
    if (insideExcluded) continue;

    const signalName = match[1];
    if (!signalName) continue;
    const value = signalValues.get(signalName);
    if (value !== undefined) {
      edits.push({
        start: exprStart,
        end: exprEnd,
        replacement: String(value),
      });
    }
  }

  return edits;
}

export interface EventBindingDescriptor {
  element: HtmlElement;
  eventName: string;
  modifiers: string[];
  handlerExpression: string;
  expressionStart: number;
  expressionEnd: number;
}

export function extractEventBindings(parsed: ParsedTemplate): EventBindingDescriptor[] {
  const result: EventBindingDescriptor[] = [];

  for (const binding of parsed.bindings) {
    if (binding.type === 'event' && binding.eventName && binding.handlerExpression) {
      result.push({
        element: binding.element,
        eventName: binding.eventName,
        modifiers: binding.eventModifiers || [],
        handlerExpression: binding.handlerExpression,
        expressionStart: binding.expressionStart,
        expressionEnd: binding.expressionEnd,
      });
    }
  }

  return result;
}

export function groupBindingsByElement(bindings: BindingInfo[]): Map<HtmlElement, BindingInfo[]> {
  const map = new Map<HtmlElement, BindingInfo[]>();
  for (const binding of bindings) {
    if (!map.has(binding.element)) {
      map.set(binding.element, []);
    }
    map.get(binding.element)!.push(binding);
  }
  return map;
}

export function isPositionInRanges(pos: number, ranges: Array<{ start: number; end: number }>): boolean {
  return ranges.some((r) => pos >= r.start && pos < r.end);
}

export function findElementsNeedingIds(parsed: ParsedTemplate): HtmlElement[] {
  const elementsSet = new Set<HtmlElement>();

  for (const binding of parsed.bindings) {
    if (binding.type === 'text' || binding.type === 'style' || binding.type === 'attr' || binding.type === 'event') {
      elementsSet.add(binding.element);
    }
  }

  return Array.from(elementsSet);
}

export function createIdGenerator(prefix: string, startFrom = 0): () => string {
  let counter = startFrom;
  return () => `${prefix}${counter++}`;
}

export function normalizeHtmlWhitespace(html: string): string {
  return html.replace(/\s+/g, ' ').replace(/\s+>/g, '>').replace(/>\s+</g, '><').trim();
}

export function injectIdIntoFirstElement(html: string, id: string): string {
  const trimmed = html.trim();
  const firstTagMatch = trimmed.match(/^<(\w+)/);
  if (!firstTagMatch) {
    return trimmed;
  }

  const tagName = firstTagMatch[1];
  if (!tagName) return trimmed;
  const tagNameEnd = tagName.length + 1;

  return trimmed.substring(0, tagNameEnd) + ` id="${id}"` + trimmed.substring(tagNameEnd);
}
