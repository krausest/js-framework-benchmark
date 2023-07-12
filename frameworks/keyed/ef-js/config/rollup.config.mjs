import path from 'path'
import chalk from 'chalk'
import { deleteSync } from 'del'

// Rollup plugins
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import progress from 'rollup-plugin-progress'
import execute from 'rollup-plugin-shell'
import copy from 'rollup-plugin-copy-glob'

// build configuration
import userConfig from './build.config.mjs'
const {
	del,
	input,
	output,
	format,
	target,
	external,
	globals,
	devPath: _devPath,
	proPath: _proPath,
	plugins,
	copyOptions,
	execCommands
} = userConfig

console.log('ENV:', chalk.bold.green(process.env.NODE_ENV || 'development'))

const isProduction = process.env.NODE_ENV === 'production'

const dir = path.normalize(isProduction ? _proPath : _devPath)

// Clear previous builds files
if (del) {
	if (isProduction) deleteSync([`${_proPath}/**`])
	else deleteSync([`${_devPath}/**`])
}

export default {
	input: input || {
		main: 'src/main.js'
	},
	output: output || {
		format: format || 'iife',
		dir,
		sourcemap: !isProduction,
		globals
	},
	external,
	plugins: [
		copy(...copyOptions, {
			verbose: true,
			watch: !isProduction
		}),
		progress({
			clearLine: false
		}),
		esbuild({
			exclude: [],
			target: target || 'es2015',
			sourceMap: !isProduction,
			minify: isProduction,
			define: {
				'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
			}
		}),
		resolve({
			browser: true,
			extensions: ['.mjs', '.js', '.jsx', '.json', '.node']
		}),
		json(),
		commonjs(),
		execute(execCommands),
		...plugins
	],
	watch: !isProduction && {
		include: ['src/**/*.*']
	}
}
