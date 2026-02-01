import fs from 'fs';
import type { Plugin } from 'esbuild';
import ts from 'typescript';
import { sourceCache, removeCode, logger, PLUGIN_NAME, COMPONENT_TYPE, createLoaderResult } from '../../utils/index.js';
import type { CodeRemoval } from '../../utils/source-editor.js';

const NAME = PLUGIN_NAME.STRIPPER;

export const RegisterComponentStripperPlugin: Plugin = {
  name: NAME,
  setup(build) {
    build.onLoad({ filter: /shadow-dom\.ts$/ }, async (args) => {
      try {
        const source = await fs.promises.readFile(args.path, 'utf8');
        const sourceFile = sourceCache.parse(args.path, source);
        const removals: CodeRemoval[] = [];

        const visit = (node: ts.Node) => {
          if (ts.isFunctionDeclaration(node) && node.name?.text === 'registerComponent' && node.body) {
            for (const statement of node.body.statements) {
              if (ts.isIfStatement(statement)) {
                const condition = statement.expression;
                if (
                  ts.isBinaryExpression(condition) &&
                  ts.isPropertyAccessExpression(condition.left) &&
                  condition.left.name.text === 'type' &&
                  ts.isStringLiteral(condition.right) &&
                  condition.right.text === COMPONENT_TYPE.PAGE
                ) {
                  if (statement.elseStatement) {
                    removals.push({
                      start: statement.elseStatement.getStart(sourceFile) - 5, // Include 'else' keyword
                      end: statement.elseStatement.getEnd(),
                      description: 'registerComponent else-branch (component return)',
                    });
                  }
                }
              }
            }
          }
          if (ts.isImportDeclaration(node)) {
            const moduleSpecifier = node.moduleSpecifier;
            if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text.includes('component-html')) {
              const importClause = node.importClause;
              if (importClause?.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
                const imports = importClause.namedBindings.elements;
                const hasCreateComponentHTMLSelector = imports.some((el) => el.name.text === 'createComponentHTMLSelector');

                if (hasCreateComponentHTMLSelector) {
                  if (imports.length === 1) {
                    removals.push({
                      start: node.getStart(sourceFile),
                      end: node.getEnd(),
                      description: 'createComponentHTMLSelector import',
                    });
                  } else {
                    for (const el of imports) {
                      if (el.name.text === 'createComponentHTMLSelector') {
                        let start = el.getStart(sourceFile);
                        let end = el.getEnd();
                        const afterElement = source.substring(end, end + 10);
                        if (afterElement.trim().startsWith(',')) {
                          end = end + afterElement.indexOf(',') + 1;
                        } else {
                          const beforeElement = source.substring(start - 10, start);
                          const commaIndex = beforeElement.lastIndexOf(',');
                          if (commaIndex !== -1) {
                            start = start - (10 - commaIndex);
                          }
                        }

                        removals.push({
                          start,
                          end,
                          description: 'createComponentHTMLSelector named import',
                        });
                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        if (removals.length === 0) {
          return undefined;
        }

        logger.info(NAME, `Removing ${removals.length} code block(s) from shadow-dom.ts`);

        return createLoaderResult(removeCode(source, removals));
      } catch (error) {
        logger.error(NAME, `Error processing ${args.path}`, error);
        return undefined;
      }
    });
    build.onLoad({ filter: /services[/\\]index\.ts$/ }, async (args) => {
      try {
        const source = await fs.promises.readFile(args.path, 'utf8');
        const sourceFile = sourceCache.parse(args.path, source);

        const removals: CodeRemoval[] = [];

        const visit = (node: ts.Node) => {
          if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
            if (ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.includes('component-html')) {
              removals.push({
                start: node.getStart(sourceFile),
                end: node.getEnd(),
                description: 'component-html.js re-export',
              });
            }
          }

          ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        if (removals.length === 0) {
          return undefined;
        }

        logger.info(NAME, `Removing ${removals.length} export(s) from services/index.ts`);

        return createLoaderResult(removeCode(source, removals));
      } catch (error) {
        logger.error(NAME, `Error processing ${args.path}`, error);
        return undefined;
      }
    });
  },
};
