/**
 * Error handling utilities for the WCF compiler
 */

import type { Diagnostic, DiagnosticSeverity, SourceLocation } from './types.js';

/**
 * Error codes for different compiler issues
 */
export enum ErrorCode {
  // Parse errors
  UNCLOSED_TAG = 'WCF001',
  INVALID_NESTING = 'WCF002',
  MALFORMED_ATTRIBUTE = 'WCF003',
  UNCLOSED_EXPRESSION = 'WCF004',
  INVALID_DIRECTIVE = 'WCF005',
  
  // Type errors
  TYPE_ERROR = 'WCF100',
  MISSING_SIGNAL = 'WCF101',
  INVALID_COMPONENT = 'WCF102',
  
  // Build errors
  FILE_NOT_FOUND = 'WCF200',
  BUILD_FAILED = 'WCF201',
  PLUGIN_ERROR = 'WCF202',
  
  // Runtime errors
  INVALID_SELECTOR = 'WCF300',
  DUPLICATE_COMPONENT = 'WCF301',
}

/**
 * Create a diagnostic message
 */
export function createDiagnostic(
  severity: DiagnosticSeverity,
  message: string,
  location?: SourceLocation,
  code?: string
): Diagnostic {
  return {
    severity,
    message,
    location,
    code,
  };
}

/**
 * Create an error diagnostic
 */
export function createError(
  message: string,
  location?: SourceLocation,
  code?: string
): Diagnostic {
  return createDiagnostic('error', message, location, code);
}

/**
 * Create a warning diagnostic
 */
export function createWarning(
  message: string,
  location?: SourceLocation,
  code?: string
): Diagnostic {
  return createDiagnostic('warning', message, location, code);
}

/**
 * Create an info diagnostic
 */
export function createInfo(
  message: string,
  location?: SourceLocation,
  code?: string
): Diagnostic {
  return createDiagnostic('info', message, location, code);
}

/**
 * Format a diagnostic for display
 */
export function formatDiagnostic(diagnostic: Diagnostic): string {
  const { severity, message, location, code } = diagnostic;
  
  let result = '';
  
  // Add severity prefix with color
  const prefix = severity === 'error' ? 'error' : 
                 severity === 'warning' ? 'warning' : 'info';
  result += `[${prefix}]`;
  
  // Add error code if present
  if (code) {
    result += ` ${code}:`;
  }
  
  // Add location if present (file:line:col format for VS Code clickability)
  if (location) {
    result += ` ${location.file}:${location.line}:${location.column}`;
  }
  
  // Add message
  result += `\n  ${message}`;
  
  return result;
}

/**
 * Format multiple diagnostics for display
 */
export function formatDiagnostics(diagnostics: Diagnostic[]): string {
  return diagnostics.map(formatDiagnostic).join('\n\n');
}

/**
 * Check if diagnostics contain any errors
 */
export function hasErrors(diagnostics: Diagnostic[]): boolean {
  return diagnostics.some(d => d.severity === 'error');
}

/**
 * Get only error diagnostics
 */
export function getErrors(diagnostics: Diagnostic[]): Diagnostic[] {
  return diagnostics.filter(d => d.severity === 'error');
}

/**
 * Get only warning diagnostics
 */
export function getWarnings(diagnostics: Diagnostic[]): Diagnostic[] {
  return diagnostics.filter(d => d.severity === 'warning');
}
