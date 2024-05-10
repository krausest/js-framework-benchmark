import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

import assertRemove from 'destam-dom/transform/assertRemove.js';
import staticMount from 'destam-dom/transform/staticMount.js';
import compileHTMLLiteral from 'destam-dom/transform/htmlLiteral.js';

const createTransform = (name, transform, jsx) => ({
  name,
  transform(code, id) {
    if (id.endsWith('.js') || (jsx && id.endsWith('.jsx'))) {
      const transformed = transform(code, {
        util_import: 'destam-dom',
        sourceFileName: id,
        plugins: id.endsWith('.jsx') ? ['jsx'] : [],
      });
      return {
        code: transformed.code,
        map: transformed.decodedMap,
      };
    }
  }
});

const plugins = [
  createTransform('assert-remove', assertRemove),
  createTransform('transform-literal-html', compileHTMLLiteral, true),
  createTransform('static-mount', staticMount, true),
  resolve({ extensions: [".js", ".jsx"] }),
];

if (process.env.production) {
  plugins.push(terser({
    mangle: {
      properties: {
        regex: /_$/,
      }
    }
  }));
}

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins,
};
