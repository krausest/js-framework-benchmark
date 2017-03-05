import riot from 'riot'
import Store from './store'
import './app.html'

riot.mount('app', {
  store: new Store()
});