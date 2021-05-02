function config( outFileName, mode, devtool, ext)
{
    return {
        entry: "./src/Main.tsx",

        output:
        {
            filename: outFileName,
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

        externals: ext
    }
}



module.exports =
[
    config( "main.dev.js", "development", "inline-source-map", {
        mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
        mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' }
    }),
    config( "main.js", "production", undefined, {
        mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' }
    }),
];



