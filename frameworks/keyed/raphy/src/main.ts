import { createRaphy } from '@raphy-js/core'
import { renderer } from '@raphy-js/dom'
import App from './App.raphy'

const target = document.querySelector<HTMLElement>('#main')
if (target === null) {
  throw new Error('Missing JS Framework Benchmark mount target.')
}

createRaphy(App, { renderer: renderer({ target }) })
