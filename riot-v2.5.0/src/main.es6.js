let riot = require('riot')
const {Store} = require('./store');
let app = require('./app.js')
let row = require('./row.js')

riot.mount('app', new Store());