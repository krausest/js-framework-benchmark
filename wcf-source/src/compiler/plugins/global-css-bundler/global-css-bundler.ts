import fs from 'fs';
import type { Plugin } from 'esbuild';
import { PLUGIN_NAME } from '../../utils/index.js';

const NAME = PLUGIN_NAME.GLOBAL_CSS_BUNDLER;

export interface GlobalCSSBundlerOptions {
  /** Whether to minify CSS (default: false) */
  minify?: boolean;
}

export const GlobalCSSBundlerPlugin = (options: GlobalCSSBundlerOptions = {}): Plugin => ({
  name: NAME,
  setup(build) {
    const shouldMinify = options.minify ?? false;

    build.onLoad({ filter: /\.css$/ }, async (args) => {
      try {
        let cssContent = await fs.promises.readFile(args.path, 'utf8');
        if (shouldMinify) {
          cssContent = minifyCSS(cssContent);
        }
        return {
          contents: `export default ${JSON.stringify(cssContent)};`,
          loader: 'ts',
        };
      } catch (error) {
        console.warn(`[${NAME}] CSS file not found: ${args.path}`);
        return {
          contents: `export default '';`,
          loader: 'ts',
        };
      }
    });
  },
});

function minifyCSS(css: string): string {
  return (
    css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim()
  );
}
