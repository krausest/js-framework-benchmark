import eft from 'rollup-plugin-eft'
import eslint from '@rollup/plugin-eslint'

export default {
	input: {
		main: 'src/main.js'
	},
	del: true,
	format: 'iife',
	target: 'es2015',
	devPath: 'dist',
	proPath: 'dist',
	copyOptions: [[]],
	external: [],
	globals: {},
	plugins: [
		eft(),
		eslint({
			exclude: ['src/static/**.*', '../../../**/**.*', '**/*.efml']
		})
	],
	execCommands: []
}
