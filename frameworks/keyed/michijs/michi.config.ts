import type { ServerConfigFactory } from '@michijs/dev-server';

export const config: ServerConfigFactory = () => ({
  esbuildOptions: {
    entryPoints: ['src/index.tsx'],
    outdir: 'dist',
    legalComments: 'none'
  }
});

export default config;