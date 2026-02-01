/**
 * WCF Compiler Type Definitions
 * These types are used internally by the compiler.
 */

import type ts from 'typescript';

/**
 * Application type
 */
export type Application = 'client' | 'admin';

/**
 * Build environment
 */
export type Environment = 'dev' | 'prod';

/**
 * Log level for compiler output
 */
export type LogLevel = 'silent' | 'normal' | 'verbose';

/**
 * Diagnostic severity
 */
export type DiagnosticSeverity = 'error' | 'warning' | 'info';

/**
 * Source location for error reporting
 */
export interface SourceLocation {
  file: string;
  line: number;
  column: number;
  length?: number;
}

/**
 * Compiler diagnostic message
 */
export interface Diagnostic {
  severity: DiagnosticSeverity;
  message: string;
  location?: SourceLocation;
  code?: string;
}

/**
 * Result of a compilation step
 */
export interface CompilationResult {
  success: boolean;
  diagnostics: Diagnostic[];
  code?: string;
  sourceMap?: string;
}

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  entry: string;
  outDir: string;
  environment: Environment;
  minify: boolean;
  sourceMap: boolean;
  gzip: boolean;
  verbose: boolean;
  silent: boolean;
  assetsDir?: string;
  htmlTemplate?: string;
}

/**
 * Plugin interface
 */
export interface Plugin {
  name: string;
  enabled?: boolean;
  transform: (code: string, filePath: string, config: PipelineConfig) => CompilationResult;
}

/**
 * Plugin result
 */
export interface PluginResult {
  code: string;
  diagnostics: Diagnostic[];
}

/**
 * File transformation context
 */
export interface TransformContext {
  filePath: string;
  code: string;
  config: PipelineConfig;
}

/**
 * Component definition
 */
export interface ComponentDefinition {
  name: string;
  selector: string;
  filePath: string;
}

/**
 * Page selector info for routes
 */
export interface PageSelectorInfo {
  importPath: string;
  selector: string;
}

/**
 * Route object for routes precompiler
 */
export interface RouteObject {
  importPath: string;
  lastPropEnd: number;
  needsComma: boolean;
}

/**
 * Template info from AST analysis
 */
export interface TemplateInfo {
  node: ts.TaggedTemplateExpression;
  expressions: SignalExpression[];
  templateStart: number;
  templateEnd: number;
}

/**
 * Reactive binding info
 */
export interface ReactiveBinding {
  signalName: string;
  elementSelector: string;
  propertyType: 'style' | 'attribute' | 'innerText';
  property?: string;
}

/**
 * Signal expression in template
 */
export interface SignalExpression {
  signalName: string;
  fullExpression: string;
  start: number;
  end: number;
}

/**
 * Template edit operation
 */
export interface TemplateEdit {
  type: 'remove' | 'replace' | 'insertId';
  start: number;
  end: number;
  content?: string;
  elementId?: string;
}

/**
 * Import info for dependency tracking
 */
export interface ImportInfo {
  namedImports: string[];
  moduleSpecifier: string;
  start: number;
  end: number;
  quoteChar: string;
}
