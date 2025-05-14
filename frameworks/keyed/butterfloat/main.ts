import { runStamps, StampCollection } from 'butterfloat'
import { App } from './app.js'
import { Row } from './row.js'

const stamps = new StampCollection()

const appStamp = document.querySelector<HTMLTemplateElement>('template#app')
if (appStamp) {
  stamps.registerOnlyStamp(App, appStamp)
}

const rowStamp = document.querySelector<HTMLTemplateElement>('template#row')
if (rowStamp) {
  stamps.registerOnlyStamp(Row, rowStamp)
}

const main = document.querySelector('#main')!
runStamps(main, App, stamps)
