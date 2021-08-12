import del from 'del'
import path from 'path'
import chalk from 'chalk'

// Rollup plugins
import buble from '@rollup/plugin-buble'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import progress from 'rollup-plugin-progress'
import json from '@rollup/plugin-json'
import eft from 'rollup-plugin-eft'
import postcss from 'rollup-plugin-postcss'
import inject from '@rollup/plugin-inject'
import {eslint} from 'rollup-plugin-eslint'
import {terser} from 'rollup-plugin-terser'

// Postcss plugins
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import postcssPresetEnv from 'postcss-preset-env'

// ef configuration
import efConfig from './ef.config.js'
const {
	efCoreModule,
	input,
	name,
	format,
	bundle,
	devPath,
	proPath,
	copyOptions,
	external,
	globals
} = efConfig

console.log('Target:', chalk.bold.green(process.env.NODE_ENV || 'development'))

// Clear previous builds files
if (process.env.NODE_ENV === 'production') del.sync([`${proPath}/**`])
else del.sync([`${devPath}dev/**`])

export default {
	input,
	name,
	format,
	copyOptions,
	external,
	globals,
	bundle: path.normalize(bundle),
	devPath: path.normalize(devPath),
	proPath: path.normalize(proPath),
	plugins: [
		progress({
			clearLine: false
		}),
		eslint(),
		resolve({
			browser: true,
			extensions: ['.mjs', '.js', '.jsx', '.json', '.node']
		}),
		json(),
		eft(),
		postcss({
			extract: true,
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: process.env.NODE_ENV !== 'production',
			plugins: [
				simplevars(),
				nested(),
				postcssPresetEnv({ warnForDuplicates: false })
			]
		}),
		buble({
			transforms: {
				modules: false,
				dangerousForOf: true
			},
			objectAssign: 'Object.assign',
			jsx: `${efCoreModule}.createElement`,
			jsxFragment: `${efCoreModule}.Fragment`
		}),
		inject({
			include: ['**/*.js', '**/*.jsx'],
			exclude: 'node_modules/**',
			modules: {
				[efCoreModule]: ['ef-core', '*']
			}
		}),
		commonjs(),
		replace({
			preventAssignment: true,
			values: {
				'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
			}
		}),
		(process.env.NODE_ENV === 'production' && terser())
	]
}
