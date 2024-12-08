import type { ServerConfigFactory } from '@michijs/dev-server';

export const config: ServerConfigFactory = () => ({
  esbuildOptions: {
    outdir: 'dist',
    legalComments: 'none',
    define: undefined
  }
});

export default config;