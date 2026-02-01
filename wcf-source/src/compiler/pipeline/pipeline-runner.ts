/**
 * Pipeline Runner
 * 
 * Executes the build pipeline by running plugins in sequence.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Plugin, OnLoadArgs, OnLoadResult, PluginBuild } from 'esbuild';
import type { PipelineConfig, CompilationResult } from '../types.js';
import type { PluginToggles, DebugTapConfig } from './pipeline-config.js';
import { PLUGIN_ORDER } from './pipeline-config.js';
import { logger } from '../utils/logger.js';

/**
 * Transform function signature for pipeline plugins
 */
export type TransformFn = (
  source: string, 
  filePath: string, 
  config: PipelineConfig
) => Promise<string | null> | string | null;

/**
 * Pipeline plugin definition
 */
export interface PipelinePlugin {
  name: keyof PluginToggles;
  transform: TransformFn;
  filter: RegExp;
  parallel?: boolean;
}

/**
 * Simple hash function for debug tap comparison
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Write debug tap output for a plugin transformation
 */
async function writeDebugTap(
  debugTap: DebugTapConfig,
  plugin: keyof PluginToggles, 
  filePath: string, 
  inputCode: string, 
  outputCode: string, 
  stepIndex: number
): Promise<void> {
  if (!debugTap.enabled) return;

  // Check if we should tap this plugin
  const shouldTap = debugTap.plugins.length === 0 || debugTap.plugins.includes(plugin);
  if (!shouldTap) return;

  const outputDir = debugTap.outputDir;
  const fileName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);

  // Create output directory
  await fs.promises.mkdir(outputDir, { recursive: true });

  // Write output file: {step}-{pluginName}-{filename}.{ext}
  const outputFileName = `${String(stepIndex).padStart(2, '0')}-${plugin}-${fileName}${ext}`;
  const outputPath = path.join(outputDir, outputFileName);

  await fs.promises.writeFile(outputPath, outputCode, 'utf-8');

  // Log if code changed
  const inputHash = simpleHash(inputCode);
  const outputHash = simpleHash(outputCode);

  if (inputHash !== outputHash) {
    logger.verbose(`[debug-tap] ${plugin}: ${fileName} ${inputHash} → ${outputHash}`);
  }
}

// Plugin registry
const pluginRegistry = new Map<keyof PluginToggles, PipelinePlugin>();

/**
 * Register a pipeline plugin
 */
export function registerPipelinePlugin(plugin: PipelinePlugin): void {
  pluginRegistry.set(plugin.name, plugin);
}

/**
 * Get all registered plugins in execution order
 */
export function getRegisteredPlugins(): PipelinePlugin[] {
  return PLUGIN_ORDER
    .filter((name) => pluginRegistry.has(name))
    .map((name) => pluginRegistry.get(name)!);
}

/**
 * Create an esbuild plugin that runs the WCF pipeline
 */
export function createPipelineRunner(
  config: PipelineConfig, 
  toggles: PluginToggles,
  debugTap: DebugTapConfig = { enabled: false, outputDir: './debug-output', plugins: [] }
): Plugin {
  const enabledPlugins = PLUGIN_ORDER.filter(name => toggles[name]);

  return {
    name: 'wcf-pipeline-runner',
    setup(build: PluginBuild) {
      build.onLoad({ filter: /\.tsx?$/ }, async (args: OnLoadArgs): Promise<OnLoadResult | null> => {
        // Skip node_modules
        if (args.path.includes('node_modules')) {
          return null;
        }

        let source: string;
        try {
          source = await fs.promises.readFile(args.path, 'utf-8');
        } catch (err) {
          return null;
        }

        let currentCode = source;
        let stepIndex = 0;

        for (const pluginName of enabledPlugins) {
          const plugin = pluginRegistry.get(pluginName);

          if (!plugin || !plugin.filter.test(args.path)) {
            continue;
          }

          try {
            const inputCode = currentCode;
            const result = await plugin.transform(currentCode, args.path, config);

            if (result !== null) {
              currentCode = result;
              await writeDebugTap(debugTap, pluginName, args.path, inputCode, currentCode, stepIndex);
              stepIndex++;
            }
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            logger.error(`[${pluginName}] Error processing ${args.path}: ${error.message}`);
            throw err;
          }
        }

        if (currentCode !== source) {
          return {
            contents: currentCode,
            loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts',
          };
        }

        return null;
      });
    },
  };
}

/**
 * Run a single plugin transformation (for testing)
 */
export async function runPluginTransform(
  pluginName: keyof PluginToggles, 
  source: string, 
  filePath: string, 
  config: PipelineConfig
): Promise<string | null> {
  const plugin = pluginRegistry.get(pluginName);

  if (!plugin) {
    throw new Error(`Plugin '${pluginName}' not registered`);
  }

  if (!plugin.filter.test(filePath)) {
    return null;
  }

  return plugin.transform(source, filePath, config);
}

/**
 * Run the full pipeline on source code (for testing)
 */
export async function runPipeline(
  source: string, 
  filePath: string, 
  config: PipelineConfig,
  toggles: PluginToggles
): Promise<CompilationResult> {
  const diagnostics: CompilationResult['diagnostics'] = [];
  let currentCode = source;

  const enabledPlugins = PLUGIN_ORDER.filter(name => toggles[name]);

  for (const pluginName of enabledPlugins) {
    const plugin = pluginRegistry.get(pluginName);

    if (!plugin || !plugin.filter.test(filePath)) {
      continue;
    }

    try {
      const result = await plugin.transform(currentCode, filePath, config);
      if (result !== null) {
        currentCode = result;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      diagnostics.push({
        severity: 'error',
        message: `[${pluginName}] ${error.message}`,
        location: { file: filePath, line: 1, column: 1 },
      });
      return { success: false, diagnostics };
    }
  }

  return {
    success: true,
    diagnostics,
    code: currentCode,
  };
}
