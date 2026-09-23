import { element } from '@openelement/element/vite';

// One self-contained JFB entry: the Element compiler plugin lowers src/main.tsx
// and the browser entry lands as a single script (dist/main.js) that index.html
// loads. `base: './'` keeps every emitted URL relative, so the page works
// unchanged from the benchmark's server root.
export default {
  base: './',
  plugins: [element()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    lib: {
      entry: 'src/register.ts',
      formats: ['es'],
      fileName: () => 'main.js',
    },
  },
};
