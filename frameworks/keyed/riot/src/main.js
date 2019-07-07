import {component} from 'riot'
import Store from './store'
import App from './app.riot'

component(App)(document.getElementById('app'), {
  store: new Store()
})