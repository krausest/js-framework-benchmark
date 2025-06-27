import type { ServerConfigFactory } from '@michijs/dev-server';
import { droppableFlags } from '@michijs/michijs/droppableFlags'

export const config: ServerConfigFactory = () => ({
  esbuildOptions: {
    legalComments: 'none',
    define: undefined,
    dropLabels: Object.values(droppableFlags)
  }
});

export default config;