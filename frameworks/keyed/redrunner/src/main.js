import {mount} from 'redrunner'
import {MainView} from './views'
import {store} from './store'

store.root = mount('#main', MainView)
