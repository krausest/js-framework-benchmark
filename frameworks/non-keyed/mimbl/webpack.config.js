let isProd = process.argv.indexOf('-p') !== -1;
let mode = isProd ? "production" : "development";
let devtool = isProd ? "source-map" : "#inline-source-map";
let outputFilename = isProd ? "main.js" : "main.dev.js";


module.exports =
{
    entry: "./src/Main.tsx",

    output:
    {
        filename: outputFilename,
        path: __dirname + "/dist",
		// library: "mimapp",
		libraryTarget: 'umd',
		globalObject: 'this'
    },

    mode: mode,

    // Enable sourcemaps for debugging webpack's output.
    devtool: devtool,

    resolve:
    {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".css"]
    },

    module:
    {
        rules:
        [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            //{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.tsx?$/,
                use:
                [
                    //{ loader: "awesome-typescript-loader" },
                    { loader: "ts-loader" },
                ],
				exclude: /node_modules|\.d\.ts$/
            },

			{
				test: /\.d\.ts$/,
				loader: 'ignore-loader'
			},

			// {
			// 	test: /\.css$/,
			// 	use:
			// 	[
			// 		{
			// 			loader: MiniCssExtractPlugin.loader
			// 			//options:
			// 			//{
			// 			//	// you can specify a publicPath here
			// 			//	// by default it use publicPath in webpackOptions.output
			// 			//	publicPath: '../'
			// 			//}
			// 		},
			// 		"css-loader"
			// 	]
			// },

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

	// plugins:
	// [
	// 	new MiniCssExtractPlugin(
	// 	{
	// 		// Options similar to the same options in webpackOptions.output
	// 		// both options are optional
	// 		filename: "mimapp.styles.css"
	// 	})
	// ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals:
    {
        mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
    }
};