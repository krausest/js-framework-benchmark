// Builds src/ with goal.js and writes the page its GET / route renders to index.html, so the
// benchmark's static server can serve it. The browser part is exactly what goal.js ships.
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { build } from 'goaljs/build';
import { page } from 'goaljs';
import { _$ctx } from 'goaljs/rt';

// The benchmark's word lists alone are about 300 B gzipped, so this app's chunk is a little over
// goal.js's 1 KB budget; the budget is raised here only, and the size printed below.
const r = await build('src', { out: 'dist', publicPath: '/frameworks/keyed/goal/dist/client/', budget: 2048 });
for (const c of r.chunks) console.log(`${c.url}  ${c.bytes} B, ${c.gzip} B gzipped`);
console.log(`loader  ${r.loader} B gzipped, inline`);
const routes = (await import(pathToFileURL('dist/server/_routes.js').href)).default;
const ctx = _$ctx();
const html = await routes.find((x) => x.path === '/').handler({}, { ctx });
writeFileSync('index.html', page(html.s, [...ctx.ev], ''));
console.log('index.html written');
