import type { ServerConfigFactory } from '@michijs/dev-server';

export const config: ServerConfigFactory = () => ({
  esbuildOptions: {
    outdir: 'dist',
    legalComments: 'none',
    define: undefined,
    splitting: false
  }
});

export default config;