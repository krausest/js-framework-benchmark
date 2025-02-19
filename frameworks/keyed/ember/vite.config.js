import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  // Not normal stuff
  base: '/frameworks/keyed/ember/dist/',
  build: {
    rollupOptions: {
      output: { entryFileNames: '[name].js' },
      input: {
        main: 'src/index.jsbf.html',
      },
    },
  },

  // Normal stuff
  resolve: {
    extensions,
  },
  plugins: [
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
