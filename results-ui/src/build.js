const fs = require('fs');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify').uglify;
const CleanCSS = require('clean-css');
const path = require("path");
const yargs = require("yargs");

const start = +new Date();

const RESULTS_PATH = path.resolve(__dirname + '/../../webdriver-ts/results');

let args = yargs(process.argv)
    .usage("$0 [--framework Framework1 Framework2 ...]")
    .array("framework").argv;

function encodeBench(obj) {
    return [
        obj.benchmark.substr(0,2),
    //  +obj.min.toFixed(2),
    //  +obj.max.toFixed(2),
        +obj.mean.toFixed(2),
    //  +obj.median.toFixed(2),
    //  +obj.geometricMean.toFixed(2),
        +obj.standardDeviation.toFixed(2),
    //  obj.values.map(v => +v.toFixed(2)),
    ];
}

let libs = {
    keyed: {},
    unkeyed: {},
};

// grab result files, group by framework, bench types and encode benches into arrays
fs.readdirSync(RESULTS_PATH).filter(file => file.endsWith('.json')).filter(file => !args.framework || args.framework.length===0 || args.framework.some(f => file.indexOf(f)>-1)).forEach(file => {
    var r = JSON.parse(fs.readFileSync(RESULTS_PATH + "/" + file, 'utf8'));
    var implGroup = r.keyed ? libs.keyed : libs.unkeyed;
    var libName = r.framework;

    if (implGroup[libName] == null) {
        implGroup[libName] = {
            name: libName,
            bench: {
                cpu: [],
                memory: [],
                startup: [],
            },
        };
    }

    implGroup[libName].bench[r.type].push(encodeBench(r));
});

// convert to arrays and sort
Object.keys(libs).forEach(implType => {
    libs[implType] = Object.values(libs[implType]).sort((a, b) => a.name.localeCompare(b.name));
});

fs.writeFileSync(path.resolve(__dirname + '/data.js'), 'export default ' + JSON.stringify(libs), 'utf8');

async function build() {
    const bundle = await rollup.rollup({
        input: __dirname + "/ui.js",
        plugins: [
            buble(),
            uglify(),
        ],
    });

    const { code, map } = await bundle.generate({
        format: "iife",
    });

    var css = fs.readFileSync(__dirname + '/bootstrap-reboot.css', 'utf8').replace(/\/\*[\s\S]+?\*\/\s*/gm, '');
    css += fs.readFileSync(__dirname + '/style.css', 'utf8');
    const opts = {
        level: 2
    };

    const minCss = new CleanCSS(opts).minify(css).styles;

    const html = [
        '<!doctype html>',
        '<html>',
        '<head>',
        '<meta charset="utf-8">',
        '<meta http-equiv="x-ua-compatible" content="ie=edge">',
        '<title>Interactive Results</title>',
        '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">',
        '<style>',
        minCss,
        '</style>',
        '</head>',
        '<body>',
        '<script>',
        code.trim(),
        '</script>',
        '</body>',
        '</html>',
    ].join("");

    fs.writeFileSync(__dirname + "/../table.html", html, 'utf8');

    console.log("Built in " + (+new Date() - start) + "ms, (" + (html.length / 1024).toFixed(1) + "KB)");
}

build();