export const minifyHTML = (html: string): string => {
  return (
    html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '> <')
      .replace(
        /(<\/(?:div|p|section|article|header|footer|main|nav|aside|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|form|fieldset|h[1-6]|template)>) (<(?:div|p|section|article|header|footer|main|nav|aside|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|form|fieldset|h[1-6]|template|!))/gi,
        '$1$2',
      )
      .replace(/(<(?:div|p|section|article|header|footer|main|nav|aside|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|form|fieldset|h[1-6])[^>]*>) /gi, '$1')
      .replace(/ (<\/(?:div|p|section|article|header|footer|main|nav|aside|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|form|fieldset|h[1-6])>)/gi, '$1')
      .replace(/^\s+</g, '<')
      .replace(/>\s+$/g, '>')
      .replace(/<!--(?!\[)[\s\S]*?-->/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
};

export const minifyCSS = (css: string): string => {
  return (
    css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/([{;:,])\s+/g, '$1')
      .replace(/\s+([};:,])/g, '$1')
      .replace(/\s*([>+~])\s*/g, '$1')
      .replace(/\)\s+\{/g, '){')
      .replace(/:\s+/g, ':')
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
};

export const minifyTemplatesInSource = (source: string): string => {
  const result: string[] = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i]!;
    if (char === '`') {
      const templateContent = extractTemplateLiteral(source, i);

      if (templateContent !== null) {
        const { content, endIndex } = templateContent;
        const minified = minifyTemplateContent(content);

        result.push('`' + minified + '`');
        i = endIndex + 1;
        continue;
      }
    }
    if (char === '"' || char === "'") {
      const quote = char;
      result.push(quote);
      i++;

      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\' && i + 1 < source.length) {
          result.push(source[i]!, source[i + 1]!);
          i += 2;
        } else {
          result.push(source[i]!);
          i++;
        }
      }

      if (i < source.length) {
        result.push(source[i]!); // closing quote
        i++;
      }
      continue;
    }
    if (char === '/' && i + 1 < source.length) {
      if (source[i + 1] === '/') {
        while (i < source.length && source[i] !== '\n') {
          result.push(source[i]!);
          i++;
        }
        continue;
      } else if (source[i + 1] === '*') {
        result.push('/*');
        i += 2;
        while (i < source.length - 1 && !(source[i] === '*' && source[i + 1] === '/')) {
          result.push(source[i]!);
          i++;
        }
        if (i < source.length - 1) {
          result.push('*/');
          i += 2;
        }
        continue;
      }
    }

    result.push(char);
    i++;
  }

  return result.join('');
};

const extractTemplateLiteral = (source: string, startIndex: number): { content: string; endIndex: number } | null => {
  if (source[startIndex] !== '`') return null;

  let i = startIndex + 1;
  let content = '';
  let braceDepth = 0;

  while (i < source.length) {
    const char = source[i]!;
    if (char === '\\' && i + 1 < source.length) {
      content += char + source[i + 1]!;
      i += 2;
      continue;
    }
    if (char === '$' && i + 1 < source.length && source[i + 1] === '{') {
      content += '${';
      i += 2;
      braceDepth = 1;
      while (i < source.length && braceDepth > 0) {
        const innerChar = source[i]!;
        
        if (innerChar === '\\' && i + 1 < source.length) {
          content += innerChar + source[i + 1]!;
          i += 2;
          continue;
        }

        if (innerChar === '{') {
          braceDepth++;
        } else if (innerChar === '}') {
          braceDepth--;
        } else if (innerChar === '`') {
          const nested = extractTemplateLiteral(source, i);
          if (nested) {
            content += '`' + nested.content + '`';
            i = nested.endIndex + 1;
            continue;
          }
        } else if (innerChar === '"' || innerChar === "'") {
          const quote = innerChar;
          content += quote;
          i++;
          while (i < source.length && source[i] !== quote) {
            if (source[i] === '\\' && i + 1 < source.length) {
              content += source[i]! + source[i + 1]!;
              i += 2;
            } else {
              content += source[i]!;
              i++;
            }
          }
          if (i < source.length) {
            content += source[i]!;
            i++;
          }
          continue;
        }

        content += innerChar;
        i++;
      }
      continue;
    }
    if (char === '`') {
      return { content, endIndex: i };
    }

    content += char;
    i++;
  }
  return null;
};

const minifyTemplateContent = (content: string): string => {
  const hasHTMLTags = /<[a-zA-Z][^>]*>/.test(content) || /<\/[a-zA-Z][^>]*>/.test(content);
  const hasCSSRules = /[{;]\s*[a-zA-Z-]+\s*:/.test(content) || /^\s*\.[a-zA-Z]/.test(content);

  if (hasHTMLTags) {
    return minifyHTML(content);
  } else if (hasCSSRules) {
    return minifyCSS(content);
  } else {
    return content.replace(/\s+/g, ' ').trim();
  }
};
