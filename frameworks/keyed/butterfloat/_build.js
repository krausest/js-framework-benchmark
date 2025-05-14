import { writeFile } from 'node:fs/promises'
import { buildStamp, makeTestComponentContext, makeTestEvent } from 'butterfloat'
import { build } from 'esbuild'
import { JSDOM } from 'jsdom'
import { NEVER } from 'rxjs'

await build({
  entryPoints: ['./app-vm.ts', './app.tsx', './data.ts', './row-vm.ts', './row.tsx'],
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
const { context: appContext } = makeTestComponentContext({
  run: makeTestEvent(NEVER),
  runlots: makeTestEvent(NEVER),
  add: makeTestEvent(NEVER),
  update: makeTestEvent(NEVER),
  clear: makeTestEvent(NEVER),
  swaprows: makeTestEvent(NEVER),
})
const appStamp = buildStamp(App({}, appContext), document)
appStamp.id = 'app'
document.body.append(appStamp)

const { Row } = await import('./row.js')
const { AppViewModel } = await import('./app-vm.js')
const { RowViewModel } = await import('./row-vm.js')
const vm = new RowViewModel(new AppViewModel(), -999)
const { context: rowContext } = makeTestComponentContext({
  select: makeTestEvent(NEVER),
  remove: makeTestEvent(NEVER),
})
const rowStamp = buildStamp(Row({ vm }, rowContext), document)
rowStamp.id = 'row'
document.body.append(rowStamp)

await writeFile('./index.html', dom.serialize())
