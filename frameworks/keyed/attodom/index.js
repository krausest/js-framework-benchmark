/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/

var Store = require('./src/store'),
    View = require('./src/view')

var view = View(new Store)
view.update()
document.body.appendChild(view)
