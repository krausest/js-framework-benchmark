import rollupHellaJS from 'rollup-plugin-hellajs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.jsx',
  output: {
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins: [
    rollupHellaJS(),
    resolve(),
    terser({
      compress: {
        passes: 3,
        drop_console: true,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        toplevel: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
      },
    }),
  ],
};
