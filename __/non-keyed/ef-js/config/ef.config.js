import camelCase from 'camelcase'

import packageInfo from '../package.json'

const production = process.env.NODE_ENV === 'production'
const getOutputPath = (relativePath) => {
	if (production) return `dist/${relativePath}`
	return `dist/${relativePath}`
}

export default {
	efCoreModule: 'EFCore',
	input: 'src/main.js',
	name: camelCase(packageInfo.name, {pascalCase: true}),
	format: 'iife', // Choose from iife, amd, umd, cjs, esm, system
	bundle: 'main',
	devPath: 'dist',
	proPath: 'dist',
	copyOptions: [
		[
			{files: 'src/index.html', dest: getOutputPath('')},
			{files: 'src/assets/**.*', dest: getOutputPath('assets')}
		]
	],
	external: [],
	globals: {}
}
