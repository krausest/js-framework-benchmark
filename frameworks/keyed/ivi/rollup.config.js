import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve-main-fields';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'es',
  },
  plugins: [
    replace({
      values: {
        DEBUG: false,
        TARGET: JSON.stringify('evergreen'),
      },
    }),
    nodeResolve({
      mainFields: ['es2016', 'module', 'main'],
    }),
    terser({
      parse: {
        ecma: 8,
      },
      compress: {
        ecma: 5,
        inline: true,
        reduce_funcs: false,
        passes: 5,
      },
      output: {
        ecma: 5,
        comments: false,
      },
      toplevel: true,
      module: true,
    })
  ],
};
