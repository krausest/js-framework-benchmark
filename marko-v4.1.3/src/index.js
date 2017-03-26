var helloComponent = require('./table');
 
helloComponent.renderSync({name:'Hallo' })
    .appendTo(document.body);