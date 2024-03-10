import esbuild from "esbuild";

// ----------------------------------------------------------------------------- BUILD MODE
const buildMode = (process.argv[2] ?? "dev").toLowerCase();
const isDev = buildMode === "dev"
if ( buildMode !== 'prod' && buildMode !== 'dev' ) {
	console.error("Build mode need to be 'prod' or 'dev'.")
	process.exit(0)
}

// ----------------------------------------------------------------------------- BUILD CONTEXT
// Create build context
const _buildContext = await esbuild.context({
	//target: [ 'chrome58', 'edge18', 'firefox57', 'safari11' ],
	platform: "browser",
	format: "iife",
	minify: !isDev,
	mangleProps: isDev ? undefined : /^_/,
	bundle: true,
	loader: {
		'.ts' : 'ts',
		'.tsx' : 'tsx'
	},
	metafile: true,
	write: true,
	plugins: [],
	define: {
		"process.env.NODE_ENV": isDev ? `"development"` : `"production"`
	},
	logLevel: "info",
	outbase: "./src/",
	entryPoints: ["./src/main.tsx"],
	outdir: "./dist/"
})

// ----------------------------------------------------------------------------- DEV OR BUILD

// Dev mode
if ( isDev ) {
	await _buildContext.watch()
}
// Build mode
else {
	await _buildContext.rebuild()
	await _buildContext.dispose()
}
