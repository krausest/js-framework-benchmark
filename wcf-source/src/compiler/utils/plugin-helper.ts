import fs from 'fs';
import ts from 'typescript';
import { sourceCache } from './cache.js';
import { logger } from './logger.js';

export interface ProcessResult {
  /** Modified source code, or null if no changes */
  contents: string | null;
  /** Loader to use (default: 'ts') */
  loader?: 'ts' | 'js' | 'tsx' | 'jsx';
}

export interface ProcessOptions {
  pluginName: string;
  filePath: string;
  shouldProcess?: (source: string) => boolean;
  transform: (source: string, sourceFile: ts.SourceFile) => string | null;
}

export const processFileWithAST = async (options: ProcessOptions): Promise<{ contents: string; loader: 'ts' } | undefined> => {
  const { pluginName, filePath, shouldProcess, transform } = options;

  try {
    // Read file
    const source = await fs.promises.readFile(filePath, 'utf8');

    // Quick check before expensive AST parsing
    if (shouldProcess && !shouldProcess(source)) {
      return undefined;
    }

    // Parse with cache
    const sourceFile = sourceCache.parse(filePath, source);

    // Transform
    const result = transform(source, sourceFile);

    if (result === null) {
      return undefined;
    }

    return {
      contents: result,
      loader: 'ts',
    };
  } catch (error) {
    logger.error(pluginName, `Error processing ${filePath}`, error);
    return undefined;
  }
};

export const shouldSkipPath = (filePath: string): boolean => {
  return filePath.includes('node_modules') || filePath.includes('scripts') || filePath.endsWith('.d.ts');
};

export const hasSignalPatterns = (source: string): boolean => {
  return source.includes('this.') && source.includes('()') && source.includes('signal(');
};

export const hasHtmlTemplates = (source: string): boolean => {
  return source.includes('html`');
};

export const extendsComponentQuick = (source: string): boolean => {
  return source.includes('extends Component');
};

export const createLoaderResult = (contents: string): { contents: string; loader: 'ts' } => ({
  contents,
  loader: 'ts',
});
