const { copyFileSync } = require('fs');
const path = require('path');


copyFileSync(
    path.join(__dirname, "../", "dist/index.html"),
    path.join(__dirname, "../index.html")
)