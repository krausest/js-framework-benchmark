/**
 * WCF Build Runner
 */

import { build, context, type BuildOptions } from 'esbuild';
import type { BuildConfig } from './types.js';
import { consoleColors } from '../utils/index.js';

// Import plugins
import { TypeCheckPlugin } from '../plugins/tsc-type-checker/tsc-type-checker.js';
import { RoutesPrecompilerPlugin } from '../plugins/routes-precompiler/routes-precompiler.js';
import { ComponentPrecompilerPlugin } from '../plugins/component-precompiler/component-precompiler.js';
import { ReactiveBindingPlugin } from '../plugins/reactive-binding-compiler/reactive-binding-compiler.js';
import { RegisterComponentStripperPlugin } from '../plugins/register-component-stripper/register-component-stripper.js';
import { GlobalCSSBundlerPlugin } from '../plugins/global-css-bundler/global-css-bundler.js';
import { HTMLBootstrapInjectorPlugin } from '../plugins/html-bootstrap-injector/html-bootstrap-injector.js';
import { MinificationPlugin } from '../plugins/minification/minification.js';
import { DeadCodeEliminatorPlugin } from '../plugins/dead-code-eliminator/dead-code-eliminator.js';
import { PostBuildPlugin } from '../plugins/post-build-processor/post-build-processor.js';

export async function runBuild(config: BuildConfig): Promise<void> {
  const startTime = performance.now();
  const environment = config.isProd ? 'prod' : 'dev';
  
  console.info(consoleColors.blue, `Running ${environment} build...`);
  
  // Create plugins with config
  const basePlugins = [
    TypeCheckPlugin,
    RoutesPrecompilerPlugin,
    ComponentPrecompilerPlugin,
    ReactiveBindingPlugin,
    RegisterComponentStripperPlugin,
    GlobalCSSBundlerPlugin({ minify: config.isProd }),
    HTMLBootstrapInjectorPlugin({ entryPoints: config.entryPoints }),
  ];
  
  const postBuildOptions = {
    distDir: config.outDir,
    inputHTMLFilePath: config.inputHTMLFilePath,
    outputHTMLFilePath: config.outputHTMLFilePath,
    assetsInputDir: config.assetsInputDir,
    assetsOutputDir: config.assetsOutputDir,
    serve: config.serve,
    isProd: config.isProd,
    useGzip: config.useGzip,
  };
  
  const prodPlugins = [
    ...basePlugins,
    MinificationPlugin,
    DeadCodeEliminatorPlugin,
    PostBuildPlugin(postBuildOptions),
  ];

  const devPlugins = [
    ...basePlugins,
    PostBuildPlugin(postBuildOptions),
  ];
  
  const baseEsbuildConfig: BuildOptions = {
    entryPoints: config.entryPoints,
    bundle: true,
    platform: 'browser',
    target: ['es2022', 'chrome94', 'firefox93', 'safari15', 'edge94'],
    outdir: config.outDir,
    treeShaking: true,
    logLevel: 'error',
    splitting: true,
    format: 'esm',
    sourcemap: false,
    metafile: true,
    entryNames: '[name]-[hash]',
    chunkNames: '[name]-[hash]',
    legalComments: 'none',
  };

  const devBuildConfig: BuildOptions = {
    ...baseEsbuildConfig,
    minify: false,
    write: true,
    plugins: devPlugins,
  };

  const prodBuildConfig: BuildOptions = {
    ...baseEsbuildConfig,
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    drop: ['console', 'debugger'],
    write: false,
    plugins: prodPlugins,
  };

  const buildConfig = config.isProd ? prodBuildConfig : devBuildConfig;

  try {
    if (!config.serve) {
      await build(buildConfig);
      console.info(consoleColors.green, `\n⏱️  Build completed in ${(performance.now() - startTime).toFixed(2)}ms`);
    } else {
      const ctx = await context(buildConfig);
      await ctx.watch({});
      console.info(consoleColors.blue, 'Watching for changes...');
    }
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}
