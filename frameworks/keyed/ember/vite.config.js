import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

const VITE_NO_JSBF = Boolean(process.env.VITE_NO_JSBF);

export default defineConfig({
  // Not normal stuff
  ...(VITE_NO_JSBF
    ? {
        base: '/',
        build: {
          rollupOptions: {
            input: {
              main: './src/index.dev.html',
            },
          },
        },
      }
    : {
        base: '/frameworks/keyed/ember/dist/',
        build: {
          rollupOptions: {
            output: { entryFileNames: '[name].js' },
            input: {
              main: 'src/index.jsbf.html',
            },
          },
        },
      }),

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
