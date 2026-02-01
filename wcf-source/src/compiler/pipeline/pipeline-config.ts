/**
 * Pipeline Configuration
 * 
 * Defines configuration types and defaults for the build pipeline.
 */

import type { Environment, PipelineConfig } from '../types.js';

/**
 * Plugin toggle configuration
 * Controls which plugins are enabled in the pipeline
 */
export interface PluginToggles {
  typeCheck: boolean;
  routesPrecompiler: boolean;
  componentPrecompiler: boolean;
  reactiveBinding: boolean;
  registerComponentStripper: boolean;
  globalCssBundler: boolean;
  htmlBootstrapInjector: boolean;
  minification: boolean;
  deadCodeEliminator: boolean;
  postBuild: boolean;
}

/**
 * Debug tap configuration for intermediate output
 */
export interface DebugTapConfig {
  enabled: boolean;
  outputDir: string;
  plugins: (keyof PluginToggles)[];
}

/**
 * Order in which plugins are executed
 */
export const PLUGIN_ORDER: (keyof PluginToggles)[] = [
  'typeCheck',
  'routesPrecompiler',
  'componentPrecompiler',
  'reactiveBinding',
  'registerComponentStripper',
  'globalCssBundler',
  'htmlBootstrapInjector',
  'minification',
  'deadCodeEliminator',
  'postBuild',
];

/**
 * Default plugin toggles for production builds
 */
export const DEFAULT_PLUGIN_TOGGLES: PluginToggles = {
  typeCheck: true,
  routesPrecompiler: true,
  componentPrecompiler: true,
  reactiveBinding: true,
  registerComponentStripper: true,
  globalCssBundler: true,
  htmlBootstrapInjector: true,
  minification: true,
  deadCodeEliminator: true,
  postBuild: true,
};

/**
 * Plugin toggles for development builds (no minification)
 */
export const DEV_PLUGIN_TOGGLES: PluginToggles = {
  ...DEFAULT_PLUGIN_TOGGLES,
  minification: false,
  deadCodeEliminator: false,
};

/**
 * Default debug tap configuration
 */
export const DEFAULT_DEBUG_TAP: DebugTapConfig = {
  enabled: false,
  outputDir: './debug-output',
  plugins: [],
};

/**
 * Options for creating a pipeline configuration
 */
export interface CreatePipelineConfigOptions {
  environment: Environment;
  entry?: string;
  outDir?: string;
  assetsDir?: string;
  htmlTemplate?: string;
  serve?: boolean;
  gzip?: boolean;
  debugTap?: Partial<DebugTapConfig>;
  plugins?: Partial<PluginToggles>;
}

/**
 * Create a pipeline configuration with sensible defaults
 */
export function createPipelineConfig(options: CreatePipelineConfigOptions): PipelineConfig {
  const { 
    environment, 
    entry = './src/main.ts',
    outDir = './dist',
    assetsDir,
    htmlTemplate,
    serve = false, 
    gzip = false, 
    plugins = {} 
  } = options;

  const isProd = environment === 'prod';

  // Use dev toggles in development, full toggles in production
  const basePluginToggles = isProd ? DEFAULT_PLUGIN_TOGGLES : DEV_PLUGIN_TOGGLES;

  return {
    entry,
    outDir,
    environment,
    minify: isProd,
    sourceMap: !isProd,
    gzip,
    verbose: false,
    silent: false,
    assetsDir,
    htmlTemplate,
  };
}

/**
 * Get list of enabled plugins based on configuration
 */
export function getEnabledPlugins(toggles: PluginToggles): (keyof PluginToggles)[] {
  return PLUGIN_ORDER.filter(name => toggles[name]);
}
