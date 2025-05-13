import { runStamps, StampCollection } from 'butterfloat'
import { App } from './app.js'

const stamps = new StampCollection()

const appStamp = document.querySelector<HTMLTemplateElement>('template#app')
if (appStamp) {
  stamps.registerOnlyStamp(App, appStamp)
}

const main = document.querySelector('#main')!
runStamps(main, App, stamps)
