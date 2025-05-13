import { writeFile } from 'node:fs/promises'
import { buildStamp } from 'butterfloat'
import { build } from 'esbuild'
import { JSDOM } from 'jsdom'

await build({
  entryPoints: ['./app.tsx'],
  bundle: false,
  format: 'esm',
  outdir: '.',
})

await build({
    entryPoints: ['./main.ts'],
    bundle: true,
    format: 'esm',
    outdir: '.',
})

const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Butterfloat</title>
    <link href="/css/currentStyle.css" rel="stylesheet"/>
    <script type="module" src="./main.js"></script>
</head>
<body>
<div id='main'>
</div>
<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</body>
</html>
`)

const { window } = dom
const { document } = window
globalThis.document = document
globalThis.window = window

const { App } = await import('./app.js')
const appStamp = buildStamp(App(), document)
appStamp.id = 'app'
document.body.append(appStamp)

await writeFile('./index.html', dom.serialize())
