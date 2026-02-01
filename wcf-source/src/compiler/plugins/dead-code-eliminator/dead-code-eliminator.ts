import type { Plugin } from 'esbuild';
import { logger } from '../../utils/index.js';

const NAME = 'dead-code-eliminator';

interface SignalInfo {
  name: string;
  initialValue: any;
  isModified: boolean;
  modificationCount: number;
}

const analyzeSignals = (source: string): Map<string, SignalInfo> => {
  const signals = new Map<string, SignalInfo>();
  const initPattern = /f\(this,"(_\w+)",T\(([^)]+)\)\)/g;
  let match: RegExpExecArray | null;

  while ((match = initPattern.exec(source)) !== null) {
    const name = match[1];
    const initialValueStr = match[2];

    if (!name || !initialValueStr) continue;
    let initialValue: any;
    try {
      if (initialValueStr === 'false') initialValue = false;
      else if (initialValueStr === 'true') initialValue = true;
      else if (initialValueStr === 'null') initialValue = null;
      else if (initialValueStr.startsWith('"') || initialValueStr.startsWith("'")) {
        initialValue = initialValueStr.slice(1, -1);
      } else if (initialValueStr.startsWith('[')) {
        initialValue = JSON.parse(initialValueStr.replace(/'/g, '"'));
      } else if (!isNaN(Number(initialValueStr))) {
        initialValue = Number(initialValueStr);
      } else {
        initialValue = undefined;
      }
    } catch {
      initialValue = undefined;
    }

    signals.set(name, {
      name,
      initialValue,
      isModified: false,
      modificationCount: 0,
    });
  }
  for (const [name, info] of signals) {
    const setterPattern = new RegExp(`this\\.${name}\\([^)]+\\)`, 'g');
    const matches = source.match(setterPattern) || [];
    const setterCalls = matches.filter((m) => !m.endsWith('()'));
    info.modificationCount = setterCalls.length;
    info.isModified = info.modificationCount > 0;
  }

  return signals;
};

const eliminateDeadConditionals = (source: string, signals: Map<string, SignalInfo>): string => {
  let result = source;
  const bindIfPattern = /A\(e,this\.(_\w+),"(b\d+)",`[^`]*`,\(\)=>\[[^\]]*\]\)/g;

  const replacements: Array<{ start: number; end: number; replacement: string }> = [];

  let match: RegExpExecArray | null;
  while ((match = bindIfPattern.exec(source)) !== null) {
    const signalName = match[1];
    if (!signalName) continue;
    const info = signals.get(signalName);

    if (info && !info.isModified && info.initialValue === false) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: '', // Remove entirely
      });
      logger.info(NAME, `Eliminated dead conditional for ${signalName} (always false, never modified)`);
    }
  }
  replacements.sort((a, b) => b.start - a.start);
  for (const rep of replacements) {
    result = result.substring(0, rep.start) + rep.replacement + result.substring(rep.end);
  }
  result = result.replace(/return\s*\[[,\s]*\]/g, 'return[]');
  result = result.replace(/,+\]/g, ']');
  result = result.replace(/,{2,}/g, ',');

  return result;
};

const eliminateConsole = (source: string): string => {
  return source.replace(/console\.\w+\([^)]*\),?/g, '').replace(/console\.\w+\("[^"]*"[^)]*\),?/g, '');
};

const simplifyEmptyCallbacks = (source: string): string => {
  let result = source.replace(/\(\)\s*=>\s*\{\s*return\s*\[\s*\];\s*\}/g, '()=>[]');
  result = result.replace(/\(\)\s*=>\s*\{\s*return\s*\[\s*\];\s*\}/g, '()=>[]');

  return result;
};

const compressPatterns = (source: string): string => {
  let result = source;
  result = result.replace(/;+\}/g, '}');
  result = result.replace(/;{2,}/g, ';');

  return result;
};

const inlineStaticBindings = (source: string, signals: Map<string, SignalInfo>): string => {
  let result = source;
  const staticSignals = new Map<string, any>();
  for (const [name, info] of signals) {
    if (!info.isModified && info.initialValue !== undefined) {
      staticSignals.set(name, info.initialValue);
    }
  }

  if (staticSignals.size === 0) return result;
  for (const [name, value] of staticSignals) {
    logger.info(NAME, `Static signal detected: ${name} = ${JSON.stringify(value)}`);
  }

  return result;
};

const removeUnusedVars = (source: string): string => {

  return source;
};

export const DeadCodeEliminatorPlugin: Plugin = {
  name: NAME,
  setup(build) {
    build.onEnd(async (result) => {
      if (!result.outputFiles || result.outputFiles.length === 0) {
        return;
      }

      const startTime = performance.now();
      let totalSaved = 0;

      for (let i = 0; i < result.outputFiles.length; i++) {
        const file = result.outputFiles[i];
        if (!file) continue;

        if (file.path.endsWith('.js')) {
          const originalContent = new TextDecoder().decode(file.contents);
          const originalSize = file.contents.length;
          const signals = analyzeSignals(originalContent);
          let modifiedCount = 0;
          let staticCount = 0;
          for (const [, info] of signals) {
            if (info.isModified) modifiedCount++;
            else staticCount++;
          }

          if (signals.size > 0) {
            logger.info(NAME, `Analyzed ${signals.size} signals: ${staticCount} static, ${modifiedCount} modified`);
          }
          let optimized = originalContent;
          optimized = eliminateDeadConditionals(optimized, signals);
          optimized = eliminateConsole(optimized);
          optimized = simplifyEmptyCallbacks(optimized);
          optimized = compressPatterns(optimized);
          optimized = inlineStaticBindings(optimized, signals);
          optimized = removeUnusedVars(optimized);
          const newContents = new TextEncoder().encode(optimized);
          const savedBytes = originalSize - newContents.length;
          totalSaved += savedBytes;

          result.outputFiles[i] = {
            path: file.path,
            contents: newContents,
            text: optimized,
            hash: file.hash,
          };
        }
      }

      const elapsed = (performance.now() - startTime).toFixed(2);
      const savedKB = (totalSaved / 1024).toFixed(2);

      if (totalSaved > 0) {
        logger.info(NAME, `Dead code elimination saved ${savedKB} KB in ${elapsed}ms`);
      }
    });
  },
};
