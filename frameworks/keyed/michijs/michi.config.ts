import { ServerConfigFactory } from '@michijs/dev-server';

export const config: ServerConfigFactory = () => ({
  esbuildOptions: {
    entryPoints: ['src/index.tsx'],
    outdir: 'dist'
  }
});

export default config;