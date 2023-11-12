import minifyHTML from 'rollup-plugin-minify-html-literals-v3';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  plugins: [
    minifyHTML({
      options: {
        minifyOptions: {
          keepClosingSlash: true
        }
      }
    }),
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: true,
    file: 'dist/index.js',
  }
};
