import { NPM } from 'aurelia-cli';
import kill from 'tree-kill';
import { platform } from '../aurelia.json';

const npm =  new NPM();

function run() {
  console.log('`au run` is an alias of the `npm start`, you may use either of those; see README for more details.');
  const args = process.argv.slice(3);
  return npm.run('start', ['--', ... cleanArgs(args)]);
}

// Cleanup --env prod to --env production
// for backwards compatibility
function cleanArgs(args) {
  let host;
  const cleaned = [];

  for (let i = 0, ii = args.length; i < ii; i++) {
    if (args[i] === '--env' && i < ii - 1) {
      const env = args[++i].toLowerCase();
      if (env.startsWith('prod')) {
        cleaned.push('--env production');
      }
    } else if (args[i] === '--host' && i < ii -1) {
      host = args[++i];
    } else if (args[i].startsWith('--')){
      // webpack 5 validates options
      if (['--analyze', '--hmr', '--open', '--port'].includes(args[i])) {
        cleaned.push(args[i]);
      }
    } else{
      cleaned.push(args[i]);
    }
  }

  // Deal with --host before webpack-dev-server calls webpack config.
  // Because of https://discourse.aurelia.io/t/changing-platform-host-in-aurelia-json-doesnt-change-the-host-ip/3043/10?u=huochunpeng
  if (!host) host = platform.host;
  if (host) cleaned.push('--host', host);
  return cleaned;
}

const shutdownDevServer = () => {
  if (npm && npm.proc) {
    kill(npm.proc.pid);
  }
};

export { run as default, shutdownDevServer };
