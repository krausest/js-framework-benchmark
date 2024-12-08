import type { ServerConfigFactory } from '@michijs/dev-server';

export const config: ServerConfigFactory = () => ({
  esbuildOptions: {
    outdir: 'dist',
    legalComments: 'none'
  }
});

export default config;