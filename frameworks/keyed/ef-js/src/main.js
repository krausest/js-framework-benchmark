import App from './app'
import {inform, exec} from 'ef-core'

inform()

const app = new App()

app.$mount({target: document.querySelector('#main')})

exec()

window.app = app
