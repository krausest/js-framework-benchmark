import ts from 'typescript';
import { safeReadFile } from './file-utils.js';

interface CachedFile {
  source: string;
  sourceFile: ts.SourceFile;
}

class SourceFileCache {
  private cache = new Map<string, CachedFile>();

  async get(filePath: string): Promise<{ source: string; sourceFile: ts.SourceFile } | null> {
    // Check cache first
    const cached = this.cache.get(filePath);
    if (cached) {
      return { source: cached.source, sourceFile: cached.sourceFile };
    }

    // Read and parse file
    const source = await safeReadFile(filePath);
    if (!source) return null;

    const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

    // Cache it
    this.cache.set(filePath, {
      source,
      sourceFile,
    });

    return { source, sourceFile };
  }

  parse(filePath: string, source: string): ts.SourceFile {
    return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(filePath: string): void {
    this.cache.delete(filePath);
  }

  stats(): { size: number; files: string[] } {
    return {
      size: this.cache.size,
      files: Array.from(this.cache.keys()),
    };
  }
}

export const sourceCache = new SourceFileCache();
