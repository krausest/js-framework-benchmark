let riot = require('riot')
const {Store} = require('./store');
let app = require('./app.js')

riot.mount('app', new Store());