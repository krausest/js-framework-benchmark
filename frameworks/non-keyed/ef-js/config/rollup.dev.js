// Import plugins
import copy from 'rollup-plugin-copy-glob'
// Import base config
import base from './rollup.base'
// Import browsersync config
import bsConfig from './bs-config'
// Import dev plugins
import browsersync from 'rollup-plugin-browsersync'

const { input, name, format, copyOptions, plugins, devPath, bundle, external, globals } = base

plugins.push(browsersync(bsConfig))

const config = {
	input,
	external,
	output: {
		name,
		format,
		file: `${devPath}/${bundle}.js`,
		sourcemap: true,
		globals
	},
	plugins: [
		copy(...copyOptions, {verbose: true, watch: true}),
		...plugins
	],
	watch: {
		include: ['src/**/*.*']
	}
}

export default config
