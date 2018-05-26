import Solid from 'solid-js'
import App from './app'

Solid.root(() => {
  var app = new App()
  document.getElementById("main").appendChild(App.template(app));
})