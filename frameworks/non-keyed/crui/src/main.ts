import { mount } from '@crui/core/dom/browser';
import { App } from './app'
import { Store } from './store'

mount(
  document.getElementById('main')!,
  App(new Store),
  {}
)