import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'tmp/src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve({
      module: true,
    }),
  ]
}
