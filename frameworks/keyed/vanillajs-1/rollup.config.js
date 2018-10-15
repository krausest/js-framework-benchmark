// import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const plugins = [
	// babel({
	// 	presets: [["@babel/preset-env", {
  //     "targets": {
  //       "ie": "11"
  //     }
  //   }]]
  // })
]

if (process.env.production) {
	plugins.push(terser());
}

export default {
  input: 'src/Main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife'
  },
  plugins
}
