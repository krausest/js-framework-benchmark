/**
 * Source Editor Utilities
 * 
 * Provides utilities for editing source code with position-based edits.
 */

/**
 * Represents a single edit to source code
 */
export interface SourceEdit {
  start: number;
  end: number;
  replacement: string;
}

/**
 * Represents a code removal (edit with empty replacement)
 */
export interface CodeRemoval {
  start: number;
  end: number;
  description?: string;
}

/**
 * Apply multiple edits to source code
 * 
 * Edits are applied from bottom to top (highest position first)
 * to avoid position shifting issues.
 * 
 * @param source - Original source code
 * @param edits - Array of edits to apply
 * @returns Modified source code
 */
export const applyEdits = (source: string, edits: SourceEdit[]): string => {
  if (edits.length === 0) return source;

  // Sort by position descending (apply from bottom to top)
  const sortedEdits = [...edits].sort((a, b) => b.start - a.start);

  let result = source;
  for (const edit of sortedEdits) {
    result = result.substring(0, edit.start) + edit.replacement + result.substring(edit.end);
  }

  return result;
};

/**
 * Remove code at specified positions
 * 
 * @param source - Original source code
 * @param removals - Array of code sections to remove
 * @returns Modified source code
 */
export const removeCode = (source: string, removals: CodeRemoval[]): string => {
  const edits: SourceEdit[] = removals.map((r) => ({
    start: r.start,
    end: r.end,
    replacement: '',
  }));
  return applyEdits(source, edits);
};

/**
 * Insert text at a specific position
 * 
 * @param source - Original source code
 * @param position - Position to insert at
 * @param text - Text to insert
 * @returns Modified source code
 */
export const insertAt = (source: string, position: number, text: string): string => {
  return source.substring(0, position) + text + source.substring(position);
};

/**
 * Replace text between positions
 * 
 * @param source - Original source code
 * @param start - Start position
 * @param end - End position
 * @param replacement - Replacement text
 * @returns Modified source code
 */
export const replaceRange = (source: string, start: number, end: number, replacement: string): string => {
  return source.substring(0, start) + replacement + source.substring(end);
};

/**
 * Get line and column for a position in source
 * 
 * @param source - Source code
 * @param position - Character position
 * @returns Line and column (1-indexed)
 */
export const getLineAndColumn = (source: string, position: number): { line: number; column: number } => {
  const lines = source.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  };
};

/**
 * Get position for a line and column in source
 * 
 * @param source - Source code
 * @param line - Line number (1-indexed)
 * @param column - Column number (1-indexed)
 * @returns Character position
 */
export const getPosition = (source: string, line: number, column: number): number => {
  const lines = source.split('\n');
  let position = 0;
  
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    position += lines[i]!.length + 1; // +1 for newline
  }
  
  return position + column - 1;
};
