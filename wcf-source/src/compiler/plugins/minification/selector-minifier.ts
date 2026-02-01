const CHARS = 'abcdefghijklmnopqrstuvwxyz';

export const generateMinifiedSelector = (index: number): string => {
  const prefixIndex = Math.floor(index / CHARS.length);
  const suffixIndex = index % CHARS.length;
  let prefix = '';
  let remaining = prefixIndex;
  do {
    prefix = CHARS[remaining % CHARS.length] + prefix;
    remaining = Math.floor(remaining / CHARS.length) - 1;
  } while (remaining >= 0);

  const suffix = CHARS[suffixIndex];

  return `${prefix}-${suffix}`;
};

export class SelectorMap {
  private originalToMinified = new Map<string, string>();
  private minifiedToOriginal = new Map<string, string>();
  private nextIndex = 0;

  register(originalSelector: string): string {
    const existing = this.originalToMinified.get(originalSelector);
    if (existing) {
      return existing;
    }

    const minified = generateMinifiedSelector(this.nextIndex++);
    this.originalToMinified.set(originalSelector, minified);
    this.minifiedToOriginal.set(minified, originalSelector);
    return minified;
  }

  getMinified(original: string): string | undefined {
    return this.originalToMinified.get(original);
  }

  getOriginal(minified: string): string | undefined {
    return this.minifiedToOriginal.get(minified);
  }

  entries(): IterableIterator<[string, string]> {
    return this.originalToMinified.entries();
  }

  get size(): number {
    return this.originalToMinified.size;
  }

  clear(): void {
    this.originalToMinified.clear();
    this.minifiedToOriginal.clear();
    this.nextIndex = 0;
  }
}

export const applySelectorsToSource = (source: string, selectorMap: SelectorMap): string => {
  let result = source;

  for (const [original, minified] of selectorMap.entries()) {
    const escaped = original.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    result = result.replace(new RegExp(`<${escaped}(\\s|>|/)`, 'g'), `<${minified}$1`);
    result = result.replace(new RegExp(`</${escaped}>`, 'g'), `</${minified}>`);
    result = result.replace(new RegExp(`(['"])${escaped}\\1`, 'g'), `$1${minified}$1`);
  }

  return result;
};

export const extractSelectorsFromSource = (source: string): string[] => {
  const selectors: string[] = [];
  const selectorRegex = /selector:\s*(['"])([a-z][a-z0-9]*-[a-z0-9-]+)\1/gi;

  let match;
  while ((match = selectorRegex.exec(source)) !== null) {
    const selector = match[2];
    if (selector && !selectors.includes(selector)) {
      selectors.push(selector);
    }
  }

  return selectors;
};
