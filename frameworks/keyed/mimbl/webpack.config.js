let isProd = process.argv.indexOf('-p') !== -1;
let mode = isProd ? "production" : "development";
let devtool = isProd ? "source-map" : "#inline-source-map";
let outputFilename = isProd ? "main.js" : "main.dev.js";
let externals = isProd ? {} : { mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' } };


module.exports =
{
    entry: "./src/Main.tsx",

    output:
    {
        filename: outputFilename,
        path: __dirname + "/dist",
		libraryTarget: 'umd',
		globalObject: 'this'
    },

    mode: mode,

    devtool: devtool,

    resolve: { extensions: [".ts", ".tsx", ".js", ".json", ".css"] },

    module:
    {
        rules:
        [
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules|\.d\.ts$/ },
			{ test: /\.d\.ts$/, loader: 'ignore-loader' },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    externals: externals
};