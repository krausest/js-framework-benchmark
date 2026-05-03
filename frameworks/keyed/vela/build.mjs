import fs from 'node:fs/promises';
import path from 'node:path';

const entryRoot = process.cwd();
const distDir = path.join(entryRoot, 'dist');

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(distDir, { recursive: true });
await fs.copyFile(path.join(entryRoot, 'src/precompiled-main.js'), path.join(distDir, 'main.js'));

console.log('Vela keyed benchmark entry built: dist/main.js');
