import path from 'path';
import type { Plugin } from 'esbuild';
import ts from 'typescript';
import type { PageSelectorInfo, RouteObject } from '../../types.js';
import { extractPageSelector, safeReadFile, sourceCache, logger, PLUGIN_NAME, PROP, generateSelectorHTML, createLoaderResult } from '../../utils/index.js';

const NAME = PLUGIN_NAME.ROUTES;

const resolvePagePath = (importPath: string, routesFilePath: string): string => {
  const routesDir = path.dirname(routesFilePath);
  let resolvedPath = importPath.replace(/\.js$/, '.ts');
  if (resolvedPath.startsWith('.')) {
    resolvedPath = path.resolve(routesDir, resolvedPath);
  }

  return resolvedPath;
};

const extractRouteImports = async (sourceFile: ts.SourceFile, routesFilePath: string): Promise<Map<string, PageSelectorInfo>> => {
  const pageSelectors = new Map<string, PageSelectorInfo>();

  const processArrowFunction = async (node: ts.ArrowFunction) => {
    const body = node.body;
    if (ts.isCallExpression(body)) {
      const expr = body.expression;
      if (expr.kind === ts.SyntaxKind.ImportKeyword && body.arguments.length > 0) {
        const importArg = body.arguments[0];
        if (importArg && ts.isStringLiteral(importArg)) {
          const importPath = importArg.text;
          const pagePath = resolvePagePath(importPath, routesFilePath);
          const cached = await sourceCache.get(pagePath);
          if (cached) {
            const selector = extractPageSelector(cached.sourceFile);
            if (selector) {
              pageSelectors.set(importPath, { importPath, selector });
            }
          }
        }
      }
    }
  };
  const collectArrowFunctions = (node: ts.Node): ts.ArrowFunction[] => {
    const nodes: ts.ArrowFunction[] = [];
    if (ts.isArrowFunction(node)) {
      nodes.push(node);
    }
    ts.forEachChild(node, (child) => {
      nodes.push(...collectArrowFunctions(child));
    });
    return nodes;
  };

  const arrowFunctions = collectArrowFunctions(sourceFile);
  for (const fn of arrowFunctions) {
    await processArrowFunction(fn);
  }

  return pageSelectors;
};

export const RoutesPrecompilerPlugin: Plugin = {
  name: NAME,
  setup(build) {
    build.onLoad({ filter: /routes\.ts$/ }, async (args) => {
      try {
        if (!args.path.includes('router')) {
          return undefined;
        }

        const source = await safeReadFile(args.path);
        if (!source) return undefined;

        const sourceFile = sourceCache.parse(args.path, source);
        const pageSelectors = await extractRouteImports(sourceFile, args.path);

        if (pageSelectors.size === 0) {
          return undefined;
        }

        logger.info(NAME, `Found ${pageSelectors.size} page selector(s) for CTFE injection`);
        const routeObjects: RouteObject[] = [];

        const collectRouteObjects = (node: ts.Node): void => {
          if (ts.isObjectLiteralExpression(node)) {
            let importPath: string | null = null;
            let hasSelector = false;
            let lastProp: ts.ObjectLiteralElementLike | null = null;

            for (const prop of node.properties) {
              lastProp = prop;
              if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                if (prop.name.text === PROP.COMPONENT_MODULE && ts.isArrowFunction(prop.initializer)) {
                  const body = prop.initializer.body;
                  if (ts.isCallExpression(body) && body.arguments.length > 0) {
                    const importArg = body.arguments[0];
                    if (importArg && ts.isStringLiteral(importArg)) {
                      importPath = importArg.text;
                    }
                  }
                }
                if (prop.name.text === PROP.SELECTOR) {
                  hasSelector = true;
                }
              }
            }

            if (lastProp && importPath && !hasSelector) {
              const selectorInfo = pageSelectors.get(importPath);
              if (selectorInfo) {
                const lastPropEnd = lastProp.getEnd();
                const afterProp = source.substring(lastPropEnd, lastPropEnd + 10);
                const hasTrailingComma = afterProp.trim().startsWith(',');

                routeObjects.push({
                  importPath,
                  lastPropEnd: hasTrailingComma ? lastPropEnd + afterProp.indexOf(',') + 1 : lastPropEnd,
                  needsComma: !hasTrailingComma,
                });
              }
            }
          }

          ts.forEachChild(node, collectRouteObjects);
        };

        collectRouteObjects(sourceFile);
        routeObjects.sort((a, b) => b.lastPropEnd - a.lastPropEnd);
        let modifiedSource = source;
        for (const routeObj of routeObjects) {
          const selectorInfo = pageSelectors.get(routeObj.importPath);
          if (selectorInfo) {
            const selectorHtml = generateSelectorHTML(selectorInfo.selector);
            const injection = `${routeObj.needsComma ? ',' : ''}\n    selector: '${selectorHtml}'`;

            modifiedSource = modifiedSource.substring(0, routeObj.lastPropEnd) + injection + modifiedSource.substring(routeObj.lastPropEnd);
          }
        }

        return createLoaderResult(modifiedSource);
      } catch (error) {
        logger.error(NAME, `Error processing ${args.path}`, error);
        return undefined;
      }
    });
  },
};
