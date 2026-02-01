/**
 * AST Utilities for WCF Compiler
 * 
 * Provides helpers for working with TypeScript AST (Abstract Syntax Tree).
 */

import ts from 'typescript';
import type { ComponentDefinition } from '../types.js';

// ============================================================================
// Constants
// ============================================================================

export const FN = {
  REGISTER_COMPONENT: 'registerComponent',
  SIGNAL: 'signal',
  WHEN: 'when',
  WHEN_ELSE: 'whenElse',
  REPEAT: 'repeat',
  HTML: 'html',
  CSS: 'css',
} as const;

export const CLASS = {
  COMPONENT: 'Component',
} as const;

export const PROP = {
  SELECTOR: 'selector',
  TYPE: 'type',
  COMPONENT_MODULE: 'componentModule',
} as const;

export const COMPONENT_TYPE = {
  PAGE: 'page',
  COMPONENT: 'component',
} as const;

// ============================================================================
// Source File Creation
// ============================================================================

/**
 * Create a TypeScript source file from code
 */
export const createSourceFile = (filePath: string, source: string): ts.SourceFile => {
  return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
};

// ============================================================================
// Function Call Detection
// ============================================================================

/**
 * Check if a call expression calls a specific function
 */
export const isFunctionCall = (node: ts.CallExpression, functionName: string): boolean => {
  return ts.isIdentifier(node.expression) && node.expression.text === functionName;
};

/**
 * Check if node is a registerComponent() call
 */
export const isRegisterComponentCall = (node: ts.CallExpression): boolean => {
  return isFunctionCall(node, FN.REGISTER_COMPONENT);
};

/**
 * Check if node is a signal() call
 */
export const isSignalCall = (node: ts.CallExpression): boolean => {
  return isFunctionCall(node, FN.SIGNAL);
};

// ============================================================================
// Signal Detection
// ============================================================================

/**
 * Get signal name from a getter call like this._count()
 * Returns null if not a signal getter call
 */
export const getSignalGetterName = (node: ts.CallExpression): string | null => {
  if (
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
    ts.isIdentifier(node.expression.name) &&
    node.arguments.length === 0
  ) {
    return node.expression.name.text;
  }
  return null;
};

/**
 * Find all signal names referenced in an expression
 */
export const findSignalReferences = (node: ts.Node, sourceFile: ts.SourceFile): string[] => {
  const signals: string[] = [];
  
  const visit = (n: ts.Node) => {
    if (ts.isCallExpression(n)) {
      const signalName = getSignalGetterName(n);
      if (signalName && !signals.includes(signalName)) {
        signals.push(signalName);
      }
    }
    ts.forEachChild(n, visit);
  };
  
  visit(node);
  return signals;
};

/**
 * Extract static value from an expression if possible
 * Used for signal initializers and compile-time evaluation
 */
export const extractStaticValue = (arg: ts.Expression): string | number | boolean | null => {
  if (ts.isStringLiteral(arg)) return arg.text;
  if (ts.isNumericLiteral(arg)) return Number(arg.text);
  if (arg.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (arg.kind === ts.SyntaxKind.FalseKeyword) return false;

  // Simple string concatenation: "a" + "b"
  if (ts.isBinaryExpression(arg) && arg.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = extractStaticValue(arg.left);
    const right = extractStaticValue(arg.right);
    if (typeof left === 'string' && typeof right === 'string') {
      return left + right;
    }
  }
  return null;
};

/**
 * Find all signal property declarations and their initial values
 */
export const findSignalInitializers = (sourceFile: ts.SourceFile): Map<string, string | number | boolean> => {
  const initializers = new Map<string, string | number | boolean>();

  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyDeclaration(node) && 
      node.name && 
      ts.isIdentifier(node.name) && 
      node.initializer && 
      ts.isCallExpression(node.initializer) && 
      isSignalCall(node.initializer)
    ) {
      const args = node.initializer.arguments;
      const firstArg = args[0];
      if (args.length > 0 && firstArg) {
        const value = extractStaticValue(firstArg);
        if (value !== null) {
          initializers.set(node.name.text, value);
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return initializers;
};

// ============================================================================
// Class Detection
// ============================================================================

/**
 * Find a class that extends a specific base class
 */
export const findClassExtending = (
  sourceFile: ts.SourceFile, 
  baseClassName: string
): ts.ClassExpression | ts.ClassDeclaration | null => {
  let foundClass: ts.ClassExpression | ts.ClassDeclaration | null = null;

  const visit = (node: ts.Node) => {
    if ((ts.isClassDeclaration(node) || ts.isClassExpression(node)) && node.heritageClauses) {
      for (const clause of node.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
          for (const type of clause.types) {
            if (ts.isIdentifier(type.expression) && type.expression.text === baseClassName) {
              foundClass = node;
            }
          }
        }
      }
    }
    if (!foundClass) {
      ts.forEachChild(node, visit);
    }
  };

  visit(sourceFile);
  return foundClass;
};

/**
 * Find the Component class in a source file
 */
export const findComponentClass = (
  sourceFile: ts.SourceFile
): ts.ClassExpression | ts.ClassDeclaration | null => {
  return findClassExtending(sourceFile, CLASS.COMPONENT);
};

/**
 * Find the enclosing class for a given node
 */
export const findEnclosingClass = (node: ts.Node): ts.ClassExpression | ts.ClassDeclaration | null => {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isClassExpression(current) || ts.isClassDeclaration(current)) {
      return current;
    }
    current = current.parent;
  }
  return null;
};

/**
 * Check if a class extends Component
 */
export const extendsComponent = (node: ts.ClassDeclaration | ts.ClassExpression): boolean => {
  if (!node.heritageClauses) return false;
  
  for (const clause of node.heritageClauses) {
    if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
      for (const type of clause.types) {
        if (ts.isIdentifier(type.expression) && type.expression.text === CLASS.COMPONENT) {
          return true;
        }
      }
    }
  }
  return false;
};

// ============================================================================
// Template Detection
// ============================================================================

/**
 * Check if a tagged template is html``
 */
export const isHtmlTemplate = (node: ts.TaggedTemplateExpression): boolean => {
  return ts.isIdentifier(node.tag) && node.tag.text === FN.HTML;
};

/**
 * Check if a tagged template is css``
 */
export const isCssTemplate = (node: ts.TaggedTemplateExpression): boolean => {
  return ts.isIdentifier(node.tag) && node.tag.text === FN.CSS;
};

/**
 * Check if source code contains html`` templates
 */
export const hasHtmlTemplates = (source: string): boolean => {
  return source.includes('html`');
};

/**
 * Extract template content from a template literal
 * Supports both TaggedTemplateExpression and TemplateLiteral
 */
export const extractTemplateContent = (
  template: ts.TaggedTemplateExpression | ts.TemplateLiteral,
  sourceFile?: ts.SourceFile
): string => {
  // Handle TaggedTemplateExpression - get the template property
  const templateLiteral = ts.isTaggedTemplateExpression(template) 
    ? template.template 
    : template;
    
  if (ts.isNoSubstitutionTemplateLiteral(templateLiteral)) {
    return templateLiteral.text;
  }
  
  // For template expressions with substitutions, we need to reconstruct
  if (ts.isTemplateExpression(templateLiteral)) {
    let content = templateLiteral.head.text;
    for (const span of templateLiteral.templateSpans) {
      // Use sourceFile.getText if available for more accurate representation
      const exprText = sourceFile 
        ? span.expression.getText(sourceFile)
        : span.expression.getText();
      content += '${' + exprText + '}';
      content += span.literal.text;
    }
    return content;
  }
  
  return '';
};

// ============================================================================
// Component Registration
// ============================================================================

interface ComponentRegistrationConfig {
  selector: string | null;
  type: string | null;
}

/**
 * Extract configuration from registerComponent() config argument
 */
export const extractRegisterComponentConfig = (
  configArg: ts.ObjectLiteralExpression
): ComponentRegistrationConfig => {
  let selector: string | null = null;
  let type: string | null = null;

  for (const prop of configArg.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      if (prop.name.text === PROP.SELECTOR && ts.isStringLiteral(prop.initializer)) {
        selector = prop.initializer.text;
      }
      if (prop.name.text === PROP.TYPE && ts.isStringLiteral(prop.initializer)) {
        type = prop.initializer.text;
      }
    }
  }

  return { selector, type };
};

/**
 * Extract all component definitions from a source file
 */
export const extractComponentDefinitions = (sourceFile: ts.SourceFile, filePath: string): ComponentDefinition[] => {
  const definitions: ComponentDefinition[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (hasExport) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name) && decl.initializer && ts.isCallExpression(decl.initializer) && isRegisterComponentCall(decl.initializer)) {
            const configArg = decl.initializer.arguments[0];
            if (configArg && ts.isObjectLiteralExpression(configArg)) {
              const { selector, type } = extractRegisterComponentConfig(configArg);

              // Only register 'component' type (not 'page')
              if (selector && type === COMPONENT_TYPE.COMPONENT) {
                definitions.push({
                  name: decl.name.text,
                  selector,
                  filePath,
                });
              }
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return definitions;
};

/**
 * Extract the page selector from a source file
 */
export const extractPageSelector = (sourceFile: ts.SourceFile): string | null => {
  let selector: string | null = null;

  const visit = (node: ts.Node) => {
    if (ts.isExportAssignment(node) && !node.isExportEquals) {
      const expr = node.expression;
      if (ts.isCallExpression(expr) && isRegisterComponentCall(expr)) {
        const configArg = expr.arguments[0];
        if (configArg && ts.isObjectLiteralExpression(configArg)) {
          const config = extractRegisterComponentConfig(configArg);
          selector = config.selector;
        }
      }
    }

    if (!selector) {
      ts.forEachChild(node, visit);
    }
  };

  visit(sourceFile);
  return selector;
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert kebab-case to camelCase
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert camelCase to kebab-case
 */
export const toKebabCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

// ============================================================================
// Component HTML Generation (Compile-time)
// ============================================================================

interface ComponentHTMLConfig {
  selector: string;
  props: Record<string, any>;
}

/**
 * Generate HTML for a component at compile time
 */
export const generateComponentHTML = (config: ComponentHTMLConfig): string => {
  const { selector, props } = config;

  const propsString = Object.entries(props)
    .map(([key, value]) => {
      const val = typeof value === 'string' ? value : JSON.stringify(value) || '';
      return `${key}="${val.replace(/"/g, '&quot;')}"`;
    })
    .join(' ');

  return `<${selector}${propsString ? ' ' + propsString : ''}></${selector}>`;
};