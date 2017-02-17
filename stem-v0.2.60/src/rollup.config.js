import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import includePaths from "rollup-plugin-includepaths";

let includePathOptions = {
    extensions: [".es6.js", ".jsx"],
    paths: [
        "../node_modules/stem-core/src",
        "../node_modules/stem-core/src/state",
        "../node_modules/stem-core/src/base",
        "../node_modules/stem-core/src/ui",
    ]
};

export default {
    entry: "Main.jsx",
    format: "umd",
    moduleId: "bundle",
    moduleName: "bundle",
    plugins: [
        includePaths(includePathOptions),
        babel(),
        //uglify(),
    ],
    dest: "bundle.js"
};
