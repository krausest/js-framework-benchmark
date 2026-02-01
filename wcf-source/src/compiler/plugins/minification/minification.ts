import fs from 'fs';
import path from 'path';
import type { Plugin } from 'esbuild';
import { SelectorMap, applySelectorsToSource, extractSelectorsFromSource } from './selector-minifier.js';
import { minifyTemplatesInSource } from './template-minifier.js';
import { logger } from '../../utils/index.js';

const NAME = 'minification';
const selectorMap = new SelectorMap();

export const MinificationPlugin: Plugin = {
  name: NAME,
  setup(build) {
    build.onStart(() => {
      selectorMap.clear();
    });
    build.onEnd(async (result) => {
      if (!result.outputFiles || result.outputFiles.length === 0) {
        return;
      }

      const startTime = performance.now();
      for (const file of result.outputFiles) {
        if (file.path.endsWith('.js')) {
          const content = new TextDecoder().decode(file.contents);
          const selectors = extractSelectorsFromSource(content);

          for (const selector of selectors) {
            selectorMap.register(selector);
          }
        }
      }

      if (selectorMap.size > 0) {
        logger.info(NAME, `Registered ${selectorMap.size} selector(s) for minification`);
      }
      let totalSaved = 0;

      for (let i = 0; i < result.outputFiles.length; i++) {
        const file = result.outputFiles[i];
        if (!file) continue;

        if (file.path.endsWith('.js')) {
          const originalContent = new TextDecoder().decode(file.contents);
          const originalSize = file.contents.length;
          let minifiedContent = applySelectorsToSource(originalContent, selectorMap);
          minifiedContent = minifyTemplatesInSource(minifiedContent);
          const newContents = new TextEncoder().encode(minifiedContent);
          const savedBytes = originalSize - newContents.length;
          totalSaved += savedBytes;
          result.outputFiles[i] = {
            path: file.path,
            contents: newContents,
            text: minifiedContent,
            hash: file.hash,
          };
        }
      }
      const firstFile = result.outputFiles[0];
      if (!firstFile) return;
      const distDir = path.dirname(firstFile.path);
      await fs.promises.mkdir(distDir, { recursive: true });

      await Promise.all(
        result.outputFiles.map(async (file) => {
          const dir = path.dirname(file.path);
          await fs.promises.mkdir(dir, { recursive: true });
          await fs.promises.writeFile(file.path, file.contents);
        }),
      );

      const elapsed = (performance.now() - startTime).toFixed(2);
      const savedKB = (totalSaved / 1024).toFixed(2);

      if (totalSaved > 0) {
        logger.info(NAME, `Minified ${result.outputFiles.filter((f) => f.path.endsWith('.js')).length} file(s), saved ${savedKB} KB in ${elapsed}ms`);
      }
      if (selectorMap.size > 0) {
        const mappings: string[] = [];
        for (const [original, minified] of selectorMap.entries()) {
          mappings.push(`${original} → ${minified}`);
        }
        logger.info(NAME, `Selector mappings: ${mappings.join(', ')}`);
      }
    });
  },
};

export const getSelectorMap = (): SelectorMap => selectorMap;

export const minifySelectorsInHTML = (html: string): string => {
  if (selectorMap.size === 0) return html;
  return applySelectorsToSource(html, selectorMap);
};
