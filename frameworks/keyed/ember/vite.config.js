import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

const VITE_NO_JSBF = Boolean(process.env.VITE_NO_JSBF);

let options = {
  base: '/frameworks/keyed/ember/dist/',
  build: {
    rollupOptions: {
      output: { entryFileNames: '[name].js' },
      input: {
        main: 'src/index.jsbf.html',
      },
    },
  },
};

if (VITE_NO_JSBF) {
  options = {
    base: '/',
    build: {
      rollupOptions: {
        input: {
          main: './src/index.dev.html',
        },
      },
    },
  };

  console.log(`Visit /src/index.dev.html`);
}

export default defineConfig({
  // Not normal stuff
  ...options,
  // Normal stuff
  plugins: [
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
