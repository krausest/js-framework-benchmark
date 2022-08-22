import { nodeResolve } from '@rollup/plugin-node-resolve';
import { qwikRollup } from '@builder.io/qwik/optimizer';
import { terser } from 'rollup-plugin-terser';
import { resolve } from 'path';

export default async function () {
  return {
    input: [
      'src/main.tsx'
    ],
    preserveEntrySignatures: true,
    plugins: [
      nodeResolve({ extensions: [".tsx", ".ts", ".jsx", ".js"], exportConditions: ["min"] }),
      qwikRollup({
        srcDir: resolve('./src'),
        entryStrategy: {type: 'single' }
      }),
      terser()
    ],
    output:
      {
        chunkFileNames: 'q-[hash].js',
        dir: 'dist',
        format: 'es',
      },
  };
}
