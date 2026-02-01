import { exec } from 'child_process';
import type { Plugin } from 'esbuild';
import { logger, PLUGIN_NAME } from '../../utils/index.js';

const NAME = PLUGIN_NAME.TYPE_CHECK;
let isRunning = false;

const runTypeCheck = (): void => {
  if (isRunning) return;
  isRunning = true;

  logger.info(NAME, 'Running TypeScript type check...');

  exec('tsc --noEmit', (error: Error | null, stdout: string) => {
    isRunning = false;

    if (error) {
      logger.error(NAME, 'Type check failed');
      console.error('---------------------------------------------------------------');
      console.error(stdout);
      console.error('---------------------------------------------------------------');
    }
  });
};

export const TypeCheckPlugin: Plugin = {
  name: NAME,
  setup(build) {
    build.onStart(() => runTypeCheck());
  },
};
